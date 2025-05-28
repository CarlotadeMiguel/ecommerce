from flask_jwt_extended import jwt_required, get_jwt

# Decorador para requerir rol admin
def admin_required(fn):
    from functools import wraps
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"error": "Solo administradores pueden realizar esta acción"}), 403
        return fn(*args, **kwargs)
    return wrapper