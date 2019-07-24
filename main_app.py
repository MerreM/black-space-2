#!env python

from flask import Flask
from flask import render_template
# from flask import url_for
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


# @app.route('/about_me')
# def about_me():
#     return render_template('about_me.html')


@app.route('/particles')
def particles():
    return render_template('particles.html')


@app.route('/life')
def life():
    return render_template('life.html')


@app.context_processor
def inject_nav_options():
    return dict(url_options={
        "index": "Home",
        "particles": "Particle Javascript",
        "life": "Game of Life",
        # "about_me": "About me"
    })
