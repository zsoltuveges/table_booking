import connection
import util


def booking_code_generator(new_booking):
    return util.booking_id_added_to_new_booking(new_booking)


@connection.connection_handler
def add_new_token_to_database(cursor):
    new_token = util.generate_code(15)
    cursor.execute("""
                    INSERT INTO tokens (token)
                    VALUES (%(token)s)
                    """, {"token": new_token})
    return new_token


@connection.connection_handler
def is_token_in_database(cursor, token):
    cursor.execute("""
                    SELECT * FROM tokens
                    WHERE token = %(token)s
                    """, {"token": token})
    if cursor.fetchone():
        return True
    else:
        return False


@connection.connection_handler
def delete_token(cursor, token):
    cursor.execute("""
                    DELETE FROM tokens
                    WHERE token = %(token)s
                    """, {"token": token})


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
def add_to_company(cursor, new_booking):
    cursor.execute("""
                        INSERT INTO company (booking_id, name, email, phone_number,
                        booked_tables, zip_code, city, street_address, street_type, street_num,
                        floor_door, vat_number, date_time)
                        VALUES (%(booking_id)s, %(name)s, %(email)s, %(phoneNumber)s,
                        %(tableNumber)s, %(zipCode)s, %(city)s, %(streetAddress)s, %(streetType)s,
                        %(streetNumber)s, %(floorDoor)s, %(vatNumber)s, now());
                        """, new_booking)


@connection.connection_handler
def return_booking_data(cursor, booking_data):
    cursor.execute("""
                    SELECT * FROM individuals
                    WHERE booking_id = %(booking_number)s AND email = %(booking_email)s;
                    """, booking_data)
    data = cursor.fetchone()
    if data:
        return data
    else:
        cursor.execute("""
                            SELECT * FROM company
                            WHERE booking_id = %(booking_number)s AND email = %(booking_email)s;
                            """, booking_data)
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


@connection.connection_handler
def modify_delete_company_booking(cursor, booking_data):
    if "delete" in booking_data:
        cursor.execute("""
                        DELETE FROM company
                        WHERE booking_id = %(booking_number)s AND email = %(newCompanyEmail)s
                        """, booking_data)
    else:
        cursor.execute("""
                        UPDATE company
                        SET name = %(newCompanyName)s, email = %(newCompanyEmail)s, phone_number = %(newCompanyPhoneNumber)s,
                            booked_tables = %(company_table_number)s, zip_code = %(zip_code)s, city = %(city)s,
                            street_address = %(street_address)s, street_type = %(street_type)s,
                            street_num = %(street_num)s, floor_door = %(floor_door)s, vat_number = %(vat_number)s
                        WHERE booking_id = %(booking_number)s AND email = %(newCompanyEmail)s
                        """, booking_data)


@connection.connection_handler
def get_all_booking_from_individuals(cursor):
    cursor.execute("""
                    SELECT * FROM individuals
                    """)
    return cursor.fetchall()


@connection.connection_handler
def get_all_booking_from_company(cursor):
    cursor.execute("""
                    SELECT * FROM company
                    """)
    return cursor.fetchall()
