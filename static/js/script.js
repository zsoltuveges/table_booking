dom = {
    init: function () {
        dom.getIndividualBooking();
        dom.getCompanyBooking();
        dom.displayNumberOfRemainingTables();
        dom.handleRemainingTableOnIndex();
        dom.autofillCity();
    },
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
    },
    getCompanyBooking: function() {
        let addNewCompanyBookingButton = document.getElementById('submitCompanyBooking');
        addNewCompanyBookingButton.addEventListener('click', function() {
            let newName = document.getElementById('newCompanyName').value;
            let newEmail = document.getElementById('newCompanyEmail').value;
            let newPhoneNumber = document.getElementById('newCompanyPhoneNumber').value;

            let zipCode = document.getElementById('zip_code').value;
            let city = document.getElementById('city').value;
            let streetAddress = document.getElementById('street_address').value;
            let streetType = document.getElementById('street_type').value;
            let streetNumber = document.getElementById('street_num').value;
            let floorDoor = document.getElementById('floor_door').value;
            let vatNumber = document.getElementById('vat_number').value;

            let newNumberOfCompanyTables = document.getElementById('company_table_number').value;
            $.post('/new-booking', {
                name: newName,
                email: newEmail,
                phoneNumber: newPhoneNumber,
                zipCode: zipCode,
                city: city,
                streetAddress: streetAddress,
                streetType: streetType,
                streetNumber: streetNumber,
                floorDoor: floorDoor,
                vatNumber: vatNumber,
                tableNumber: newNumberOfCompanyTables
            });
            let allCompanyInput = document.getElementsByClassName('CompanyInput');
            for (let input of allCompanyInput) {
                input.value = ""
            }
        });
    },

    displayNumberOfRemainingTables: function() {
        let bookingButtons = document.getElementsByClassName("submitButton");
        for (let button of bookingButtons) {
            button.addEventListener('click', function() {
                let remainingTablesDiv = document.getElementById("numberOfRemainingTablesDiv");
                remainingTablesDiv.innerHTML = null;
                let paragraph = document.createElement("p");
                fetch('/get-max-tables-data')
                .then(response => response.json())
                .then(function(result) {
                    let tempItem = document.createTextNode(result["remaining_tables"]);
                    paragraph.appendChild(tempItem);
                    remainingTablesDiv.appendChild(paragraph);
                })
            })
        }
    },

    handleRemainingTableOnIndex: function () {
        let numberOfTables = parseInt(document.getElementById("numberOfRemainingTablesDiv").innerText);
        if (numberOfTables < 1) {
            let indexTableBookingFormBody = document.getElementById("indexTableBookingFormBody");
            indexTableBookingFormBody.innerHTML = "";
            document.getElementById("booking-form").remove();
            let sadDeadPool = document.createElement("img");
            sadDeadPool.src = "http://i0.kym-cdn.com/photos/images/original/000/652/022/3d9.png";
            sadDeadPool.classList.add("sad-DeadPool");
            sadDeadPool.classList.add("mt-5");
            let sadMessage = document.createElement("h3");
            sadMessage.classList.add("mt-5");
            sadMessage.classList.add("sad-message-no-tables");
            sadMessage.innerText = "Sajnáljuk elfogytak az asztalok a következő eseményre.";
            indexTableBookingFormBody.appendChild(sadMessage);
            indexTableBookingFormBody.appendChild(sadDeadPool);
        }
    },

    autofillCity: function() {
        let zipCodeInput = document.getElementById("zip_code");
        let cityInput = document.getElementById("city");
        zipCodeInput.addEventListener('keyup', function() {
            let zipCode = document.getElementById("zip_code").value;
            if (zipCode.length === 4) {
                let url = '/get-city/' + zipCode;
                fetch(url)
                    .then(response => response.json())
                    .then(function(result) {
                        try {
                            cityInput.value = result["city"];
                        } catch (TypeError) {
                            cityInput.value = "Nincs ilyen irányítószámú település";
                        }
                })
            }
        })
    }
};

dom.init();

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
