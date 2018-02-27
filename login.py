from flask import redirect, url_for, session


def login_required(function):
    def decorated_function(*args, **kwargs):
        if 'username' not in session.keys():
            return redirect(url_for('index'))
        return function(*args, **kwargs)
    decorated_function.__name__ = function.__name__
    return decorated_function
