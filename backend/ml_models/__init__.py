# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_mail import Mail

# db = SQLAlchemy()
# mail = Mail()

# def create_app():
#     app = Flask(__name__)

#     # Database config (already present in your project)
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cityserve.db'  # or your DB

#     # Email config
#     app.config['MAIL_SERVER'] = 'smtp.gmail.com'
#     app.config['MAIL_PORT'] = 587
#     app.config['MAIL_USE_TLS'] = True
#     app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
#     app.config['MAIL_PASSWORD'] = 'your_app_password'  # Gmail App Password

#     db.init_app(app)
#     mail.init_app(app)

#     # Register blueprints (already in your project)
#     from routes.complaints import complaints_bp
#     app.register_blueprint(complaints_bp)

#     return app
