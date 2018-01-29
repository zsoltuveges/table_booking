from flask import Flask, render_template, request, redirect, url_for
import data_manager

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/booking', methods=['POST'])
def booking():
    new_booking = data_manager.booking_code_generator(request.form.to_dict())
    if "comp_name" in new_booking:
        data_manager.add_to_company(new_booking)
    else:
        data_manager.add_to_individuals(new_booking)
    return redirect('/')


if __name__ == '__main__':
    app.run(
        debug=True
    )