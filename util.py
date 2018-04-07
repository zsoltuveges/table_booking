import random


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
