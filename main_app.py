#!env python

from flask import Flask
from flask import render_template
# from flask import url_for
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about_me')
def about_me():
    return render_template('about_me.html')
