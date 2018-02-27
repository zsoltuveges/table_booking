import connection
import util


def booking_code_generator(new_booking):
    return util.generate_code(new_booking)


@connection.connection_handler
def add_new_user_to_database(cursor, new_user):
    cursor.execute("""
                    INSERT INTO users (username, password)
                    VALUES (%(username)s, %(password)s);
                    """, new_user)


@connection.connection_handler
def get_user_data(cursor, login_data):
    cursor.execute("""
                    SELECT * FROM users
                    WHERE username = %(username)s
                    """, login_data)
    return cursor.fetchone()


@connection.connection_handler
def add_to_individuals(cursor, new_booking):
    cursor.execute("""
                    INSERT INTO individuals (booking_id, name, email, phone_number, booked_tables, date_time)
                    VALUES (%(booking_id)s, %(name)s, %(email)s, %(phone_number)s, %(table_number)s, now());
                    """, new_booking)


@connection.connection_handler
def return_booking_data(cursor, booking_data):
    try:
        cursor.execute("""
                        SELECT * FROM individuals
                        WHERE booking_id = %(booking_number)s AND email = %(booking_email)s;
                        """, booking_data)
    except:
        cursor.execute("""
                        SELECT * FROM company
                        WHERE booking_id = %(booking_number)s AND email = %(booking_email)s;
                        """)
    return cursor.fetchone()


@connection.connection_handler
def modify_delete_individual_booking(cursor, booking_data):
    if "delete" in booking_data:
        cursor.execute("""
                        DELETE FROM individuals
                        WHERE booking_id = %(booking_number)s AND email = %(email)s
                        """, booking_data)
    else:
        cursor.execute("""
                        UPDATE individuals
                        SET name = %(name)s, email = %(email)s, phone_number = %(phone_number)s
                        WHERE booking_id = %(booking_number)s AND email = %(email)s
                        """, booking_data)
