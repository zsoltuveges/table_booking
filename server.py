from flask import Flask, render_template, request, url_for, redirect
import data_manager

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/booking', methods=['GET', 'POST'])
def booking():
    pass
    #new_booking = data_manager.booking_code_generator(request.form.to_dict())
    #if "comp_name" in new_booking:
        #data_manager.add_to_company(new_booking)
    #else:
        #pass
        #data_manager.add_to_individuals(new_booking)
    #return render_template('index.html')


@app.route('/modify-delete-booking', methods=["POST"])
def modify_delete_booking():
    mod_del_target = request.form.to_dict()
    booking_data = data_manager.return_booking_data(mod_del_target)
    return render_template('handle_booking.html',
                           booking_data=booking_data)


@app.route('/save-edited-booking', methods=['POST'])
def save_edited_booking():
    edited_data = request.form.to_dict()
    if edited_data["name"]:
        data_manager.modify_delete_individual_booking(edited_data)
        return redirect(url_for('index'))
    else:
        pass


@app.route('/new-booking', methods=['POST'])
def new_booking():
    """Receives new booking info from script.js, and writes it to database"""
    booking_data = request.form.to_dict()
    booking_data_with_booking_id = data_manager.booking_code_generator(booking_data)
    data_manager.add_to_individuals(booking_data_with_booking_id)



if __name__ == '__main__':
    app.run(
        debug=True
    )