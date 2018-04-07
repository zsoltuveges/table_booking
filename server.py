from flask import Flask, render_template, request, url_for, redirect, session, jsonify
from flask_mail import Mail, Message
import data_manager
import hash
import login as login_module


app = Flask(__name__)

app.config.update(
    DEBUG=True,
    # EMAIL SETTINGS
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME='kepregenyborze.asztalfoglalas@gmail.com',
    MAIL_PASSWORD='petproject',
    SECURITY_PASSWORD_SALT='jagjeiogjawoegjoawetjpoawjiegpoawjgojwegohawepiogawogj')

mail = Mail(app)


def send_bookig_code(booking_data):
    msg = Message(
        "Képregénybörze asztalfoglalás visszaigazoló",
        sender="kepregenyborze.asztalfoglalas@gmail.com",
        recipients=[booking_data["email"]])
    msg.body = "Kedves " + booking_data["name"] + "!\n" + "Köszönjük a foglalásod! A foglalási kódod: " + booking_data["booking_id"] + "\nEnnek segítségével módosíthatod vagy törölheted a foglalásod."
    mail.send(msg)
    return "Sent"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/registration/<token>', methods=['GET', 'POST'])
def registration(token):
    if request.method == 'POST':
        new_registration = request.form.to_dict()
        if new_registration["password2"] == new_registration["password"]:
            hashed_password = hash.hash_password(new_registration["password"])
            new_registration["password"] = hashed_password
            data_manager.add_new_user_to_database(new_registration)
            data_manager.delete_token(new_registration["token"])
            return render_template('login.html')
    is_token_in_database = data_manager.is_token_in_database(token)
    if is_token_in_database:
        return render_template('register.html', token=token)
    else:
        return redirect(url_for('index'))


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
    individual_data = data_manager.get_all_booking_from_individuals()
    company_data = data_manager.get_all_booking_from_company()
    return render_template('admin.html',
                           individual_data=individual_data,
                           comp_data=company_data)


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
    if "city" in edited_data:
        data_manager.modify_delete_company_booking(edited_data)
        return redirect(url_for('index'))
    else:
        data_manager.modify_delete_individual_booking(edited_data)
        return redirect(url_for('index'))


@app.route('/new-booking', methods=['POST'])
def new_booking():
    """Receives new booking info from script.js, and writes it to database"""
    booking_data = request.form.to_dict()
    booking_data_with_booking_id = data_manager.booking_code_generator(booking_data)
    if "city" in booking_data:
        data_manager.add_to_company(booking_data_with_booking_id)
    else:
        data_manager.add_to_individuals(booking_data_with_booking_id)
    send_bookig_code(booking_data_with_booking_id)
    return "Done"


@app.route('/send-invitation', methods=['GET', 'POST'])
def send_invitation():
    email = request.form["invitation_email"]
    new_token = data_manager.add_new_token_to_database()
    url = "http://127.0.0.1:5000/registration/"
    send_invitation_email(email, new_token, url)
    return redirect(url_for('admin_page'))


def send_invitation_email(email, token, url):
    msg = Message(
        "Képregénybörze asztalfoglaló app meghívó",
        sender="kepregenyborze.asztalfoglalas@gmail.com",
        recipients=[email])
    msg.body = "Kedves " + email + "!\n" + "Az alábbi linkre kattintva tudsz regisztálni: " + url + token
    mail.send(msg)
    return "Sent"


@app.route('/get-individual-bookings')
def get_individual_bookings():
    all_individual_booking_data = data_manager.get_all_booking_from_individuals()
    return jsonify(all_individual_booking_data)


@app.route('/get-company-bookings')
def get_company_bookings():
    all_company_booking_data = data_manager.get_all_booking_from_company()
    return jsonify(all_company_booking_data)


if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(
        debug=True,
        port=5000
    )
