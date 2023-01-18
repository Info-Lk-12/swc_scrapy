from __init__ import app


@app.route("/favicon")
def favicon():
    return "favicon"
