# backend/api/orders.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import Order

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
