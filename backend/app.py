from flask import Flask
from config.settings import get_config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


def create_app():
    app = Flask(__name__)
    
    # Cargar configuración
    config = get_config()
    app.config.from_object(config)

    db = SQLAlchemy(app)
    migrate = Migrate(app, db)
    
    # Inicializar extensiones y blueprints aquí
    return app

app = create_app()

if __name__ == '__main__':
    app.run()