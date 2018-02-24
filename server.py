from flask import Flask, render_template, request, url_for
import data_manager

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/booking', methods=['GET', 'POST'])
def booking():
    new_booking = data_manager.booking_code_generator(request.form.to_dict())
    if "comp_name" in new_booking:
        data_manager.add_to_company(new_booking)
    else:
        data_manager.add_to_individuals(new_booking)
    return render_template('index.html')


@app.route('/modify-delete-booking', methods=["POST"])
def modify_delete_booking():
    mod_del_target = request.form.to_dict()
    booking_data = data_manager.return_booking_data(mod_del_target)
    return render_template('handle_booking.html',
                           booking_data=booking_data)


@app.route('/save-edited-booking')
def save_edited_booking():
    data =


if __name__ == '__main__':
    app.run(
        debug=True
    )