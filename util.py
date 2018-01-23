import random


def generate_code(new_booking):
    source = "abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    characters = 6
    code = "".join(random.sample(source, characters))
    new_booking.update({"booking_id": code})
    return new_booking
