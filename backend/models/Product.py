# models/Product.py

from backend import db

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
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    def update_stock(self, quantity):
        if self.stock + quantity < 0:
            raise ValueError("Stock no puede ser negativo")
        self.stock += quantity
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': float(self.price),
            'stock': self.stock,
            'category': self.category,
            'image_url': self.image_url,
            'is_active': self.is_active 
        }
