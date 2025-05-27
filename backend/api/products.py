# backend/api/products.py

from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from backend.models import Product, User
from backend.app import db

products_bp = Blueprint('products', __name__)

# Utilidad para respuesta de paginación
def paginate_query(query, page, limit):
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    return {
        "products": [p.to_dict() for p in pagination.items],
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "pages": pagination.pages,
        'current_page': pagination.page
    }

@products_bp.route('/', methods=['GET'])
def list_products():
    try:
        # Validar y obtener parámetros
        max_price = request.args.get('max_price', type=float)
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', default=10, type=int)
        if page < 1 or limit < 1:
            return jsonify({"error": "Parámetros de paginación inválidos"}), 400

        query = Product.query.filter_by(is_active=True)
        if max_price is not None:
            if max_price <= 0:
                return jsonify({"error": "max_price debe ser mayor a 0"}), 400
            query = query.filter(Product.price <= max_price)

        data = paginate_query(query, page, limit)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": "Error al listar productos"}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.filter_by(id=product_id, is_active=True).first()
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(product.to_dict()), 200

# Decorador para requerir rol admin
def admin_required(fn):
    from functools import wraps
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"error": "Solo administradores pueden realizar esta acción"}), 403
        return fn(*args, **kwargs)
    return wrapper

@products_bp.route('/', methods=['POST'])
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

