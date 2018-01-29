import connection
import util


def booking_code_generator(new_booking):
    return util.generate_code(new_booking)


@connection.connection_handler
def add_to_individuals(cursor, new_booking):
    cursor.execute("""
                    INSERT INTO individuals (booking_id, name, email, phone_number, booked_tables, date)
                    VALUES (%(booking_id)s, %(name)s, %(email)s, %(phone_number)s, %(booked_tables)s, now());
                    """, new_booking)


@connection.connection_handler
def add_to_company(cursor, new_booking):
    cursor.execute("""
                        INSERT INTO company (booking_id, company_name, email, phone_number,
                        booked_tables, zip_code, city, street_address, street_type, street_num,
                        floor_door, vat_number, date)
                        VALUES (%(booking_id)s, %(name)s, %(email)s, %(phone_number)s,
                        %(booked_tables)s, %(zip_code)s, %(city)s, %(street_address)s, %(street_type)s,
                        %(street_num)s, %(floor_door)s, %(vat_number)s, now());
                        """, new_booking)
    pass