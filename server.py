from flask import Flask, render_template, request, url_for, redirect, session, jsonify
from flask_mail import Mail, Message
import data_manager
import hash
import login as login_module
import util
import os

app = Flask(__name__)
app.secret_key = 'uniqSecretKey'

app.config.update(
    DEBUG=True,
    # EMAIL SETTINGS
    MAIL_SERVER=os.environ.get('MAIL_SERVER'),
    MAIL_PORT=os.environ.get('MAIL_PORT'),
    MAIL_USE_SSL=os.environ.get('MAIL_USE_SSL'),
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME'),
    MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD'),
    SECURITY_PASSWORD_SALT=os.environ.get('MAIL_PASSWORD_SALT'))

mail = Mail(app)
PUBLIC_SPACE_NAMES = util.read_public_spaces_from_file()


def send_bookig_code(booking_data):
    msg = Message(
        "Képregénybörze asztalfoglalás visszaigazoló",
        sender="kepregenyborze.asztalfoglalas@gmail.com",
        recipients=[booking_data["email"]])
    msg.body = "Kedves " + booking_data["name"] + "!\n" + "Köszönjük a foglalásod! A foglalási kódod: " + booking_data["booking_id"] + "\nEnnek segítségével módosíthatod vagy törölheted a foglalásod."
    mail.send(msg)
    return "Sent"


@app.route('/resend-booking-code', methods=['GET', 'POST'])
def resend_booking_code():
    booking_email = request.form.to_dict()["resend_code_booking_email"]
    booking_data = data_manager.get_booking_code_for_resend(booking_email)
    if booking_data:
        msg = Message(
            "Képregénybörze asztalfoglalás foglalási kód újraküldés",
            sender="kepregenyborze.asztalfoglalas@gmail.com",
            recipients=[booking_data["email"]])
        msg.body = "Kedves " + booking_data["name"] + "!\n" + "A foglalási kódod: " + \
                   booking_data["booking_id"] + \
                   "\nKérlek őrizd meg a kódot, ennek segítségével módosíthatod vagy törölheted a foglalásod."
        mail.send(msg)
        return redirect(url_for('index'))


@app.route('/set-max-tables', methods=['POST'])
def set_max_tables():
    max_tables = request.form.to_dict()
    data_manager.set_max_tables(max_tables)
    return "Done"


@app.route('/get-max-tables-data')
def get_max_tables_data():
    max_tables_data = data_manager.get_max_tables()
    return jsonify(max_tables_data)


@app.route('/')
def index():
    number_of_remaining_tables = data_manager.get_max_tables()["remaining_tables"]
    max_tables = data_manager.get_max_tables()["max_tables"]
    return render_template('index.html',
                           public_space_names=PUBLIC_SPACE_NAMES,
                           number_of_remaining_tables=number_of_remaining_tables,
                           max_tables=max_tables)


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
        if user_data_from_database != None:
            is_correct_password = hash.verify_password(login_data["password"], user_data_from_database["password"])
            if is_correct_password:
                session["username"] = login_data["username"]
                session["user_id"] = user_data_from_database["id"]
                return redirect(url_for('admin_page', admin_name=session["username"]))
        return render_template('login.html', failed_login=True)
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/admin-page/<admin_name>')
@login_module.login_required
def admin_page(admin_name):
    search = True
    notification_number = data_manager.get_number_of_unseen_modified_bookings()
    return render_template('admin.html',
                           search=search,
                           admin_name=admin_name,
                           notification_number=notification_number["count"])


@app.route('/mod-del-by-admin', methods=['POST'])
def mod_del_by_admin():
    data = request.form.to_dict()
    if "company" in data:
        data_manager.mod_del_comp_by_admin(data)
        booking_id = data_manager.get_booking_id_by_id(data["id"], "company")
        data_manager.get_previous_bookings_and_save_to_modified_table(booking_id["booking_id"], "company")
    else:
        booking_id = data_manager.get_booking_id_by_id(data["id"], "individuals")
        data_manager.mod_del_indi_by_admin(data)
        data_manager.get_previous_bookings_and_save_to_modified_table(booking_id["booking_id"], "indi")
    return "Done"


@app.route('/modify-delete-booking', methods=["GET", "POST"])
def modify_delete_booking():
    """Collects the data of the previous booking from database,
    and displays it for modification"""
    mod_del_target = request.form.to_dict()
    booking_data = data_manager.return_booking_data(mod_del_target)
    return render_template('handle_booking.html',
                           booking_data=booking_data,
                           public_space_names=PUBLIC_SPACE_NAMES)


@app.route('/save-edited-booking', methods=['POST'])
def save_edited_booking():
    """Sends the edited booking to database for saving,
    or deleting the booking."""
    edited_data = request.form.to_dict()
    if "city" in edited_data:
        data_manager.modify_delete_company_booking(edited_data)
        data_manager.get_previous_bookings_and_save_to_modified_table(edited_data["booking_number"], "company")
        return redirect(url_for('index'))
    else:
        data_manager.modify_delete_individual_booking(edited_data)
        data_manager.get_previous_bookings_and_save_to_modified_table(edited_data["booking_number"], "indi")
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
    return redirect(url_for('admin_page', admin_name=session["username"]))


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


@app.route('/order/<orderby>/<direction>/<category>')
def order_admin_page(orderby, direction, category):
    sorted_individual_datas = data_manager.order_by_column(orderby, direction, category)
    return jsonify(sorted_individual_datas)


@app.route('/admin/booking-settings')
def booking_settings():
    admin_name = session["username"]
    notification_number = data_manager.get_number_of_unseen_modified_bookings()
    return render_template('admin_booking_settings.html', admin_name=admin_name, notification_number=notification_number["count"])


@app.route('/get-city/<zip_code>')
def get_city(zip_code):
    data_for_zip_code = data_manager.get_city(zip_code)
    return jsonify(data_for_zip_code)


@app.route('/admin/modified-table-bookings')
def modified_table_bookings():
    admin_name = session["username"]
    notification_number = data_manager.get_number_of_unseen_modified_bookings()
    return render_template('modified_bookings.html', admin_name=admin_name, modified=True, notification_number=notification_number["count"])


@app.route('/admin/get-indi-modified-bookings')
def get_indi_modified_bookings():
    indi_modified_bookings = data_manager.get_indi_modified_bookings()
    return jsonify(indi_modified_bookings)


@app.route('/admin/get-company-modified-bookings')
def get_company_modified_bookings():
    company_modified_bookings = data_manager.get_company_modified_bookings()
    return jsonify(company_modified_bookings)


@app.route('/save/modified-bookings/<booking_category>/<booking_id>')
def save_modified_bookings(booking_category, booking_id):
    data_manager.get_previous_bookings_and_save_to_modified_table(booking_id, booking_category)


@app.route('/admin-change-modified-to-seen', methods=["POST"])
def change_seen():
    seenRowId = request.form.to_dict()
    data_manager.change_status_seen(seenRowId["seenRowId"])
    return "Changed the status"


if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )
