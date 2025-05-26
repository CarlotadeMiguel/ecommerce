# backend/models/User.py
from backend.app import db 
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    orders = db.relationship('Order', backref='user', lazy=True)

    def __init__(self, name=None, email=None, password=None):
        if name and len(name.strip()) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres")
        if email and not self.is_valid_email(email):
            raise ValueError("Formato de email inválido")
        
        self.name = name
        self.email = email
        if password:
            self.password = password

    @property
    def password(self):
        raise AttributeError('Password is not readable')
    
    @password.setter
    def password(self, password):
        if len(password) < 8:
            raise ValueError("La contraseña debe tener mínimo 8 caracteres")
        if not any(c.isupper() for c in password):
            raise ValueError("La contraseña debe contener al menos una mayúscula")
        if not any(c.isdigit() for c in password):
            raise ValueError("La contraseña debe contener al menos un número")
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def is_valid_email(email):
        return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email) is not None
    
    @staticmethod
    def is_strong_password(password):
        return (len(password) >= 8 and 
                any(c.isupper() for c in password) and 
                any(c.isdigit() for c in password) and 
                any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password))
    
    @staticmethod
    def hash_password(password):
        if not User.is_strong_password(password):
            raise ValueError("La contraseña no cumple con los requisitos de seguridad")
        return generate_password_hash(password)
    
    def save(self):
        db.session.add(self)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        
    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
