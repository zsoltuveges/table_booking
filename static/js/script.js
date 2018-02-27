dom = {
    getIndividualBooking: function() {
        let addNewIndividualBookingButton = document.getElementById('submitIndividualBooking');
        addNewIndividualBookingButton.addEventListener('click', function() {
            let newName = document.getElementById('newIndividualName').value;
            let newEmail = document.getElementById('newIndividualEmail').value;
            let newPhoneNumber = document.getElementById('newIndividualPhoneNumber').value;
            let newNumberOfTables = document.getElementById('newIndividualTableNumber').value;
            $.post('/new-booking', {
                name: newName,
                email: newEmail,
                phone_number: newPhoneNumber,
                table_number: newNumberOfTables
            });
            let allIndividualInput = document.getElementsByClassName('individualInput');
            for (let input of allIndividualInput) {
                input.value = ""
            }
        });
    }
};

dom.getIndividualBooking();