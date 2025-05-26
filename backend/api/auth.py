# backend/api/auth.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from backend.models.User import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Implementar lógica de registro
    return jsonify({'message': 'Usuario registrado'}), 201