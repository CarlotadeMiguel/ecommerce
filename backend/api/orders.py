# backend/api/orders.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import Order, OrderItem, Product, User
from backend.app import db

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
            'total': float(order.total_price),
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'items': []
        }
        for item in order.items:
            order_data['items'].append({
                'product_id': item.product_id,
                'quantity': item.quantity,
                'price_at_purchase': float(item.price_at_purchase),
                'subtotal': float(item.subtotal)
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
            
            order_item = OrderItem(
                order=order,
                product_id=product.id,
                quantity=item['quantity'],
                price_at_purchase=product.price
            )
            product.stock -= item['quantity']
            db.session.add(order_item)
        
        order.calculate_total()
        db.session.commit()
        
        return jsonify({
            'message': 'Orden creada',
            'order_id': order.id,
            'total': float(order.total)
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
        'total': float(order.total),
        'status': order.status,
        'items': [{
            'product_id': item.product_id,
            'quantity': item.quantity,
            'price': float(item.price_at_purchase)
        } for item in order.items]
    }), 200
