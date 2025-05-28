# backend/api/admin.py
from flask import Blueprint
from flask import Blueprint, request, jsonify, abort
from backend.models import Product, Order, User
from backend.app import db
from backend.decorator.adminRol import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/products', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    required_fields = ['name', 'price']
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    name = data.get('name')
    price = data.get('price')
    description = data.get('description', '')
    stock = data.get('stock', 0)
    category = data.get('category')
    image_url = data.get('image_url')
    is_active = data.get('is_active', True)

    # Validaciones básicas
    if not isinstance(price, (int, float)) or price <= 0:
        return jsonify({"error": "El precio debe ser mayor a 0"}), 400
    if not name or len(name) < 2:
        return jsonify({"error": "El nombre debe tener al menos 2 caracteres"}), 400

    # Nombre único por categoría
    existing = Product.query.filter_by(name=name, category=category).first()
    if existing:
        return jsonify({"error": "Ya existe un producto con ese nombre en la categoría"}), 409

    try:
        product = Product(
            name=name,
            price=price,
            description=description,
            stock=stock,
            category=category,
            image_url=image_url,
            is_active=is_active
        )
        db.session.add(product)
        db.session.commit()
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al crear producto: {str(e)}"}), 500

@admin_bp.route('/products', methods=['GET'])
@admin_required
def list_all_products():
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        products = Product.query.paginate(page=page, per_page=limit)
        return jsonify({
            'products': [p.to_dict() for p in products.items],
            'total': products.total,
            'pages': products.pages
        }), 200
    except Exception as e:
        return jsonify({"error": "Error al listar productos"}), 500

@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Producto eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def list_all_orders():
    try:
        orders = Order.query.all()
        return jsonify([order.get_order_summary() for order in orders]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_all_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500