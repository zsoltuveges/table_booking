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

$(function() {

    $('#individual-form').click(function(e) {
		$("#left").delay(100).fadeIn(100);
 		$("#right").fadeOut(100);
		$('#company-form').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#company-form').click(function(e) {
		$("#right").delay(100).fadeIn(100);
 		$("#left").fadeOut(100);
		$('#individual-form').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});
