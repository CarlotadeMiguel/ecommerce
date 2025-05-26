import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

class Config:
    """Configuración base para todos los entornos"""
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PROPAGATE_EXCEPTIONS = True
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'False') == 'True'
    CSRF_ENABLED = os.getenv('CSRF_ENABLED', 'True') == 'True'
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')

class DevelopmentConfig(Config):
    """Configuración para entorno de desarrollo"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///ecommerce.db')
    JWT_ACCESS_TOKEN_EXPIRES = False  # Tokens sin expiración en desarrollo

class ProductionConfig(Config):
    """Configuración para entorno de producción"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hora de expiración
    SESSION_COOKIE_SECURE = True

def get_config():
    """Seleccionar configuración basada en entorno"""
    env = os.getenv('FLASK_ENV', 'development')
    return {
        'development': DevelopmentConfig,
        'production': ProductionConfig
    }[env]
