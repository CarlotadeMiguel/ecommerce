# backend/api/auth.py

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
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

        # Crear el access_token para el nuevo usuario
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'user': user.to_dict(),
            'accessToken': access_token
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear usuario'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.verify_password(password):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    access_token = create_access_token(identity=user.id)

    response = jsonify({
        'message': 'Login exitoso',
        'user': user.to_dict(),
        'accessToken': access_token
    })

    # Configurar la cookie con el token de acceso
    response.set_cookie(
        'access_token_cookie',
        access_token,
        max_age=24*60*60,  # 24 horas
        httponly=True,
        secure=False,      # Cambia a True en producción con HTTPS
        samesite='Lax'
    )

    return response, 200