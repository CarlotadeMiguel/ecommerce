# backend/api/products.py

from flask import Blueprint, request, jsonify, abort
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
