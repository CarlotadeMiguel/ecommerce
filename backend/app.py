# backend/app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Configuración desde settings.py
    from backend.config.settings import DevelopmentConfig
    app.config.from_object(DevelopmentConfig)
    
    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
 
    # Importar modelos para registrar mapeos
    from backend.models import User, Product, Order, OrderItem
    
    # Registrar blueprints
    from backend.api.auth import auth_bp
    from backend.api.products import products_bp
    from backend.api.orders import orders_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run()
