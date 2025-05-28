# backend/models/Order.py

from backend.app import db 
from sqlalchemy import exc
from sqlalchemy.ext.hybrid import hybrid_property

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Numeric(10,2))
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

    def add_item(self, product, quantity):
        if product.stock < quantity:
            raise ValueError("Stock insuficiente para este producto")
        
        item = OrderItem(
            order_id=self.id,
            product_id=product.id,
            quantity=quantity,
            price_at_purchase=product.price
        )
        db.session.add(item)
        product.reserve_stock(quantity)
    
    def calculate_total(self):
        return sum(item.subtotal for item in self.items) * 1.16  # IVA 16%

    def process_order(self):
        if self.status != 'pending':
            raise ValueError("Solo se pueden procesar órdenes en estado pending")
        
        try:
            self.status = 'confirmed'
            db.session.commit()
        except exc.SQLAlchemyError:
            db.session.rollback()
            raise

    def cancel_order(self):
        if self.status not in ['pending', 'confirmed']:
            raise ValueError("No se puede cancelar la orden en su estado actual")
        
        for item in self.items:
            item.product.release_stock(item.quantity)
        
        self.status = 'cancelled'
        db.session.commit()

    def get_order_summary(self):
        return {
            'order_id': self.id,
            'total': float(self.total_price),
            'status': self.status,
            'items': [{
                'product_id': item.product_id,
                'quantity': item.quantity,
                'unit_price': float(item.price_at_purchase)
            } for item in self.items]
        }


    @hybrid_property
    def total_price(self):
        return sum(item.subtotal for item in self.items)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_purchase = db.Column(db.Numeric(10,2), nullable=False)
    
    @hybrid_property
    def subtotal(self):
        return self.price_at_purchase * self.quantity