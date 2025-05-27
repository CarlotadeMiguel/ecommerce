# backend/app.py
from flask import Flask,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuración desde settings.py
    from backend.config.settings import DevelopmentConfig
    app.config.from_object(DevelopmentConfig)
    
    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
 
    # Importar modelos para registrar mapeos
    from backend.models import User, Product, Order, OrderItem, Cart, CartItem
    
    # Añadir claims personalizados al JWT
    @jwt.additional_claims_loader
    def add_claims_to_jwt(identity):
        user = User.query.get(identity)
        return {"role": user.role}

    # Registrar blueprints
    from backend.api.auth import auth_bp
    from backend.api.products import products_bp
    from backend.api.orders import orders_bp
    from backend.api.cart import cart_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
 
    CORS(
        app,
        origins=["http://localhost:3000"],
        supports_credentials=True,
        allow_headers=["Authorization", "Content-Type"],
        methods=["GET", "POST", "PUT", "DELETE"]
    )

    return app

app = create_app()

if __name__ == '__main__':
    app.run()
