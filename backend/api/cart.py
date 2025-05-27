from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import Cart, CartItem, Product
from backend.app import db

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({'items': []})
    items = [{
        'product_id': item.product_id,
        'quantity': item.quantity
    } for item in cart.items]
    return jsonify({'items': items})

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    product = Product.query.get(product_id)
    if not product or not product.is_active or product.stock < quantity:
        return jsonify({'error': 'Producto no disponible'}), 400
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
    item = next((i for i in cart.items if i.product_id == product_id), None)
    if item:
        item.quantity += quantity
    else:
        db.session.add(CartItem(cart=cart, product_id=product_id, quantity=quantity))
    db.session.commit()
    return jsonify({'message': 'Producto agregado al carrito'}), 200
