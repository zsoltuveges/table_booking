import connection
import util


def booking_code_generator(new_booking):
    return util.generate_code(new_booking)


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
def add_to_company(cursor, new_booking):
    pass
