from flask import Flask
from config.settings import get_config

def create_app():
    app = Flask(__name__)
    
    # Cargar configuración
    config = get_config()
    app.config.from_object(config)
    
    # Inicializar extensiones y blueprints aquí
    return app

app = create_app()

if __name__ == '__main__':
    app.run()