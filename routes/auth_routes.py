from __init__ import app
from flask import session, render_template, request, redirect, make_response

from utils.password_manager import check_password
from utils.request_codes import RequestCode


@app.route("/login", methods=["GET", "POST"])
def login():
    redirection = request.args.get("jump") or "/"

    if session.get("logged_in"):
        return redirect(redirection)

    if request.method == "POST":
        password = request.form.get("password")
        state = check_password(password)

        if state:
            session["logged_in"] = True
            session.permanent = True
            return redirect(redirection)

        return make_response(
            render_template("auth/login.html", error="Wrong username or password"),
            RequestCode.ClientError.Unauthorized
        )

    return render_template("auth/login.html", redirect=request.args.get("jump") or None)


@app.route("/logout")
def logout():
    session["logged_in"] = None
    return redirect("/")
