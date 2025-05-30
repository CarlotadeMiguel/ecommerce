from flask import current_app, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import Order, OrderItem, Product, User
from backend.app import db
from decimal import Decimal
import stripe

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()
    result = []
    for order in orders:
        order_data = {
            'id': order.id,
            'status': order.status,
            'total': float(order.total_price or order.total or 0),
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'items': []
        }
        for item in order.items:
            order_data['items'].append({
                'product_id': item.product_id,
                'quantity': item.quantity or 0,
                'price_at_purchase': float(item.price_at_purchase or 0),
                'subtotal': float(item.subtotal or 0),
                'name': item.product.name if item.product else 'Nombre no disponible'
            })
        result.append(order_data)
    return jsonify(result), 200

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        order = Order(user_id=user_id)
        db.session.add(order)
        
        for item in data['items']:
            product = Product.query.get(item['product_id'])
            if not product or product.stock < item['quantity']:
                raise ValueError(f"Producto {item['product_id']} no disponible")
            
            price = product.price if product.price is not None else Decimal('0.00')
            quantity = item['quantity'] if item['quantity'] is not None else 0
            subtotal = price * quantity

            order_item = OrderItem(
                order=order,
                product_id=product.id,
                quantity=quantity,
                price_at_purchase=price,
                subtotal=subtotal
            )
            product.stock -= quantity
            db.session.add(order_item)
        
        order.calculate_total() 
        db.session.commit()
        
        return jsonify({
            'message': 'Orden creada',
            'order_id': order.id,
            'total': float(order.total or 0)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({'error': 'Orden no encontrada'}), 404
    
    return jsonify({
        'id': order.id,
        'total': float(order.total or 0),
        'status': order.status,
        'items': [{
            'product_id': item.product_id,
            'quantity': item.quantity or 0,
            'price': float(item.price_at_purchase or 0),
            'name': item.product.name if item.product else 'Nombre no disponible'
        } for item in order.items]
    }), 200

@orders_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
    try:
        data = request.get_json()
        amount = int(data['amount'] * 100)  # Stripe espera centavos
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='eur',  # o 'mxn', según tu negocio
            automatic_payment_methods={'enabled': True}
        )
        return jsonify({'clientSecret': intent.client_secret}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500