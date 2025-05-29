# backend/models/Order.py
from backend.app import db
from decimal import Decimal

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Numeric(10, 2), default=Decimal('0.00'))
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

    def calculate_total(self):
        subtotal = sum(
            (item.price_at_purchase or Decimal('0.00')) * (item.quantity or 0)
            for item in self.items
        )
        iva = subtotal * Decimal('0.16')
        self.total = subtotal + iva

    @property
    def total_price(self):
        # Devuelve el total como float para las respuestas JSON
        return float(self.total or 0)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'total': self.total_price,
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price_at_purchase = db.Column(db.Numeric(10, 2), nullable=False, default=Decimal('0.00'))
    subtotal = db.Column(db.Numeric(10, 2), nullable=False, default=Decimal('0.00'), server_default='0.00')
    product = db.relationship('Product', back_populates='order_items', lazy=True)

    def to_dict(self):
        return {
            'product_id': self.product_id,
            'quantity': self.quantity or 0,
            'price_at_purchase': float(self.price_at_purchase or 0),
            'subtotal': float(self.subtotal or 0)
        }
