# backend/api/auth.py

from flask import Blueprint, jsonify, request
from backend.models import User, Product, Order, OrderItem
from backend.app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Validaciones básicas
    if not name or not email or not password:
        return jsonify({'error': 'Todos los campos son obligatorios'}), 400
    if not User.is_valid_email(email):
        return jsonify({'error': 'Email no válido'}), 400
    if not User.is_strong_password(password):
        return jsonify({'error': 'Contraseña insegura'}), 400

    # Comprobar que el email no esté registrado
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    try:
        user = User(name=name, email=email)
        user.password = password  # setter encripta y valida
        db.session.add(user)
        db.session.commit()
        return jsonify({'user': user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear usuario'}), 500
