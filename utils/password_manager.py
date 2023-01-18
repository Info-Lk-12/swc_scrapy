from functools import wraps
from flask import session, request, render_template

from __init__ import config


def check_password(password):
    return password == config["PASSWORD"]


def auth_required(func):
    @wraps(func)
    def check(*args, **kwargs):
        if session.get("logged_in"):
            return func(*args, **kwargs)
        return render_template("auth/login.html", redirect=request.path)

    return check
