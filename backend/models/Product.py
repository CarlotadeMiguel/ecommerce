# backend/models/Product.py
from backend.app import db
from urllib.parse import urlparse

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10,2), nullable=False)
    stock = db.Column(db.Integer, default=0)
    category = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    order_items = db.relationship('OrderItem', back_populates='product', lazy=True)

    def __init__(self, name, price, **kwargs):
        if price <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        if not self.is_valid_url(kwargs.get('image_url', '')):
            raise ValueError("URL de imagen inválida")
        
        self.name = name
        self.price = price
        self.stock = kwargs.get('stock', 0)
        self.category = kwargs.get('category')
        self.image_url = kwargs.get('image_url')
        self.is_active = kwargs.get('is_active', True)

    def reserve_stock(self, quantity):
        if quantity <= 0:
            raise ValueError("Cantidad debe ser positiva")
        if self.stock < quantity:
            raise ValueError("Stock insuficiente")
        self.stock -= quantity

    def release_stock(self, quantity):
        if quantity <= 0:
            raise ValueError("Cantidad debe ser positiva")
        self.stock += quantity

    def update_stock(self, quantity):
        if self.stock + quantity < 0:
            raise ValueError("Stock no puede ser negativo")
        self.stock += quantity

    @staticmethod
    def is_valid_url(url):
        if not url:
            return True
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    def calculate_total_value(self):
        return self.price * self.stock
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'stock': self.stock,
            'category': self.category,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
