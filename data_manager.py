import connection
import util


def booking_code_generator(new_booking):
    return util.generate_code(new_booking)


@connection.connection_handler
def add_to_individuals(cursor, new_booking):
    cursor.execute("""
                    INSERT INTO individuals (booking_id, name, email, phone_number, count_table)
                    VALUES (%(booking_id)s, %(name)s, %(email)s, %(phone_number)s, %(table_number)s);
                    """, new_booking)


@connection.connection_handler
def add_to_company(cursor, new_booking):
    pass
