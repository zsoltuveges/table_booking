from flask import Flask, render_template, request, url_for, redirect, session
import data_manager
import hash
import login as login_module


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/noone-knows', methods=['GET', 'POST'])
def registration():
    if request.method == "POST":
        new_registration = request.form.to_dict()
        if new_registration["password2"] == new_registration["password"]:
            hashed_password = hash.hash_password(new_registration["password"])
            new_registration["password"] = hashed_password
            data_manager.add_new_user_to_database(new_registration)
            return render_template('login.html')
    return render_template('register.html')


@app.route('/admin', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login_data = request.form.to_dict()
        user_data_from_database = data_manager.get_user_data(login_data)
        is_correct_password = hash.verify_password(login_data["password"], user_data_from_database["password"])
        if is_correct_password:
            session["username"] = login_data["username"]
            session["user_id"] = user_data_from_database["id"]
            return redirect(url_for('admin_page'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/admin-page')
@login_module.login_required
def admin_page():
    return render_template('admin.html')


@app.route('/modify-delete-booking', methods=["POST"])
def modify_delete_booking():
    """Collects the data of the previous booking from database,
    and displays it for modification"""
    mod_del_target = request.form.to_dict()
    booking_data = data_manager.return_booking_data(mod_del_target)
    return render_template('handle_booking.html',
                           booking_data=booking_data)


@app.route('/save-edited-booking', methods=['POST'])
def save_edited_booking():
    """Sends the edited booking to database for saving,
    or deleting the booking."""
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
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(
        debug=True
    )
