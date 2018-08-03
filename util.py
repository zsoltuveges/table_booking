import random
import data_manager


def generate_code(characters_of_code):
    source = "abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    code = "".join(random.sample(source, characters_of_code))
    return code


def booking_id_added_to_new_booking(new_booking):
    booking_id = generate_code(6)
    new_booking.update({"booking_id": booking_id})
    return new_booking


def read_public_spaces_from_file():
    with open("data/public_space_names.txt") as file:
        names = file.read().splitlines()
    return names

def modify_booking(edited_data):
    if "city" in edited_data:
        data_manager.modify_company_booking(edited_data)
        data_manager.get_previous_bookings_and_save_to_modified_table(edited_data["booking_number"], "company")
    else:
        data_manager.modify_individual_booking(edited_data)
        data_manager.get_previous_bookings_and_save_to_modified_table(edited_data["booking_number"], "indi")
    return "OK"

def delete_booking(deleted_data):
    if "city" in deleted_data:
        data_manager.delete_company_booking(deleted_data)
    else:
        data_manager.delete_individual_booking(deleted_data)
