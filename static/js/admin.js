admin = {
    _allIndiBookings: "",
    _allCompanyBookings: "",
    _indiOrderDirection: "",
    _companyOrderDirection: "",
    _searchedIndiBooking: [],
    _searchedCompBooking: [],
    _backupIndiBookings: "",
    _backupCompanyBookings: "",
    _maxTablesData: {},

    init: function () {
        this.showAllData();
        this.getMaxAndRemainingTables();
        this.setMaxTables();
        this.sortIndiBookings();
        this.sortCompanyBookings();
        this.addingEventListenerToMenuButtons();
        this.search();
        this.deleteModifyIndiButtons();
        this.deleteModifyCompButtons();
    },

    getAllIndividualBookingsFromDatabase: function () {
        $.getJSON('/get-individual-bookings', function (response) {
            admin._allIndiBookings = response;
            admin._backupIndiBookings = response;
            admin.displayAllIndividualBookings();
        })
    },

    displayAllIndividualBookings: function () {
        try {
            let tableBody = document.getElementById("indi_body");
            tableBody.innerHTML = "";
            for (let row = 0; row < admin._allIndiBookings.length; row++) {
                var tableRow = document.createElement("tr");
                let columns = ["booking_id", "name", "email", "phone_number", "booked_tables", "date_time"];
                for (let i = 0; i < columns.length; i++) {
                    let tableData = document.createElement("td");
                    let tempItem;
                    if (columns[i] === "date_time") {
                        let dateTime = new Date(admin._allIndiBookings[row][columns[i]]);
                        let correctMonth = dateTime.getMonth() + 1;
                        tempItem = document.createTextNode(dateTime.getUTCFullYear() + "-" + correctMonth + "-" + dateTime.getDate()
                            + " | " + dateTime.getUTCHours() + ":" + dateTime.getMinutes());
                        tableData.appendChild(tempItem);
                    } else if (columns[i] === "booked_tables") {
                        let button = document.createElement("button");
                        button.classList.add("btn");
                        button.classList.add("btn-info");
                        button.classList.add("modify-booking-button");
                        button.setAttribute("data-toggle", "modal");
                        button.setAttribute("data-target", "#admin-modification-modal");
                        button.addEventListener('click', function () {
                            let nameModify = document.getElementById("name");
                            nameModify.value = admin._allIndiBookings[row].name;
                            let phoneModify = document.getElementById("phone_number");
                            phoneModify.value = admin._allIndiBookings[row].phone_number;
                            let emailModify = document.getElementById("email");
                            emailModify.value = admin._allIndiBookings[row].email;
                            let tableNumbersModify = document.getElementById("table_number");
                            tableNumbersModify.value = admin._allIndiBookings[row].booked_tables;
                            let bookingNumber = document.getElementById("booking_number");
                            bookingNumber.value = admin._allIndiBookings[row].booking_id;
                            admin.setModifyDeleteIndiButtonsVisibility();
                        });

                        let buttonContent = document.createTextNode(admin._allIndiBookings[row][columns[i]]);
                        button.appendChild(buttonContent);
                        tableData.appendChild(button);
                    } else {
                        tempItem = document.createTextNode(admin._allIndiBookings[row][columns[i]]);
                        tableData.appendChild(tempItem);
                    }
                    tableRow.appendChild(tableData);
                    tableBody.appendChild(tableRow);
                }
            }
            let individualTable = document.getElementById("individual_table");
            individualTable.appendChild(tableBody);
        } catch (err) {
            return;
        }
    },

    getAllCompanyBookingsFromDatabase: function () {
        $.getJSON('/get-company-bookings', function (response) {
            admin._allCompanyBookings = response;
            admin._backupCompanyBookings = response;
            admin.displayAllCompanyBookings();
        })
    },

    displayAllCompanyBookings: function () {
        try {
            let tableBody = document.getElementById("company_body");
            tableBody.innerHTML = "";
            for (let row = 0; row < admin._allCompanyBookings.length; row++) {
                var tableRow = document.createElement("tr");
                let columns = [
                    "booking_id",
                    "name",
                    "email",
                    "phone_number",
                    "booked_tables",
                    "city",
                    "vat_number",
                    "date_time"
                ];
                for (let i = 0; i < columns.length; i++) {
                    var tableData = document.createElement("td");
                    let tempItem;
                    if (columns[i] === "date_time") {
                        let dateTime = new Date(admin._allIndiBookings[row][columns[i]]);
                        admin._time = dateTime;
                        let correctMonth = dateTime.getMonth() + 1;
                        tempItem = document.createTextNode(dateTime.getUTCFullYear() + "-" + correctMonth + "-" + dateTime.getDate()
                            + " | " + dateTime.getUTCHours() + ":" + dateTime.getMinutes());
                        tableData.appendChild(tempItem);
                    } else if (columns[i] === "city") {
                        let addressDetails = ["city", "street_address", "street_type", "street_num", "floor_door", "zip_code"];
                        for (let j = 0; j < addressDetails.length; j++) {
                            let addressRow = document.createElement("tr");
                            let content = document.createTextNode(admin._allCompanyBookings[row][addressDetails[j]]);
                            addressRow.appendChild(content);
                            tableData.appendChild(addressRow);
                        }
                    } else if (columns[i] === "booked_tables") {
                        let button = document.createElement("button");
                        button.classList.add("btn");
                        button.classList.add("btn-info");
                        button.classList.add("modify-booking-button");
                        button.setAttribute("data-toggle", "modal");
                        button.setAttribute("data-target", "#admin-comp-modification-modal");
                        button.addEventListener('click', function () {
                            let nameModify = document.getElementById("comp_name");
                            nameModify.value = admin._allCompanyBookings[row].name;
                            let phoneModify = document.getElementById("comp_phone_number");
                            phoneModify.value = admin._allCompanyBookings[row].phone_number;
                            let emailModify = document.getElementById("comp_email");
                            emailModify.value = admin._allCompanyBookings[row].email;
                            let tableNumbersModify = document.getElementById("comp_table_number");
                            tableNumbersModify.value = admin._allCompanyBookings[row].booked_tables;
                            let zipCodeModify = document.getElementById("comp_zip_code");
                            zipCodeModify.value = admin._allCompanyBookings[row].zip_code;
                            let cityModify = document.getElementById("comp_city");
                            cityModify.value = admin._allCompanyBookings[row].city;
                            let addressModify = document.getElementById("comp_street_address");
                            addressModify.value = admin._allCompanyBookings[row].street_address;
                            let streetTypeModify = document.getElementById("comp_street_type");
                            streetTypeModify.value = admin._allCompanyBookings[row].street_type;
                            let streetNumModify = document.getElementById("comp_street_num");
                            streetNumModify.value = admin._allCompanyBookings[row].street_num;
                            let floorDoorModify = document.getElementById("comp_floor_door");
                            floorDoorModify.value = admin._allCompanyBookings[row].floor_door;
                            let vatNumberModify = document.getElementById("comp_vat_number");
                            vatNumberModify.value = admin._allCompanyBookings[row].vat_number;
                            let bookingNumber = document.getElementById("comp_booking_number");
                            bookingNumber.value = admin._allCompanyBookings[row].booking_id;
                            admin.setModifyDeleteCompButtonsVisibility();
                        });

                        let buttonContent = document.createTextNode(admin._allCompanyBookings[row][columns[i]]);
                        button.appendChild(buttonContent);
                        tableData.appendChild(button);
                    } else {
                        tempItem = document.createTextNode(admin._allCompanyBookings[row][columns[i]]);
                        tableData.appendChild(tempItem);
                    }
                    tableRow.appendChild(tableData);
                    tableBody.appendChild(tableRow);
                }
                let companyTable = document.getElementById("company_table");
                companyTable.appendChild(tableBody);
            }
        } catch (err) {
            return;
        }
    },

    sortIndiBookings: function () {
        try {
            let orderingColumns = [];
            let category = "individuals";
            orderingColumns.push(document.getElementById("indi_name"), document.getElementById("indi_table"), document.getElementById("indi_time"));
            for (column of orderingColumns) {
                column.style.cursor = "pointer";
                let orderBy = column.dataset.name;
                column.addEventListener('click', function () {
                    if (admin._indiOrderDirection === "" || admin._indiOrderDirection === "DESC") {
                        admin._indiOrderDirection = "ASC";
                    } else if (admin._indiOrderDirection === "ASC") {
                        admin._indiOrderDirection = "DESC"
                    }
                    let jsonURL = '/order/' + orderBy + '/' + admin._indiOrderDirection + '/' + category;
                    $.getJSON(jsonURL, function (response) {
                        admin._allIndiBookings = response;
                        admin.displayAllIndividualBookings();
                    });
                })
            }
        } catch (err) {
            return
        }
    },

    sortCompanyBookings: function () {
        try {
            let orderingColumns = [];
            let category = "company";
            orderingColumns.push(document.getElementById("company_name"), document.getElementById("comp_table"), document.getElementById("company_time"));
            for (column of orderingColumns) {
                column.style.cursor = "pointer";
                let orderBy = column.dataset.name;
                column.addEventListener('click', function () {
                    if (admin._companyOrderDirection === "" || admin._companyOrderDirection === "DESC") {
                        admin._companyOrderDirection = "ASC";
                    } else if (admin._companyOrderDirection === "ASC") {
                        admin._companyOrderDirection = "DESC"
                    }
                    let jsonURL = '/order/' + orderBy + '/' + admin._companyOrderDirection + '/' + category;
                    $.getJSON(jsonURL, function (response) {
                        admin._allCompanyBookings = response;
                        admin.displayAllCompanyBookings();
                    });
                })
            }
        } catch (err) {
            return;
        }
    },

    addingEventListenerToMenuButtons: function () {
        $(document).ready(function () {
            $('li.active').removeClass('active');
            $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
        });
        let menuInvite = document.getElementById("menu-invite");
        menuInvite.style.cursor = "pointer";
        let menuSaveBookings = document.getElementById("menu-save-bookings");
        menuSaveBookings.style.cursor = "not-allowed";
    },

    search: function () {
        let searchArea = document.getElementById("searchInput");
        let indiColumns = ["name", "email"];
        let compColumns = ["name", "email", "city", "street_address", "street_type"];
        searchArea.addEventListener('keyup', function () {
            admin._searchedIndiBooking = [];
            admin._searchedCompBooking = [];
            let searchedInfo = document.getElementById("searchInput").value;
            if (searchedInfo === "") {
                admin.showAllData();
                return;
            }
            if (event.key === "Backspace") {
                admin._allIndiBookings = admin._backupIndiBookings;
                admin._allCompanyBookings = admin._backupCompanyBookings;
            }
            for (let i = 0; i < admin._allIndiBookings.length; i++) {
                for (let column of indiColumns) {
                    if (admin._allIndiBookings[i][column].toLowerCase().includes(searchedInfo.toLowerCase())) {
                        admin._searchedIndiBooking.push(admin._allIndiBookings[i]);
                        break;
                    }
                }
            }
            admin._allIndiBookings = admin._searchedIndiBooking;
            admin.displayAllIndividualBookings();
            for (let i = 0; i < admin._allCompanyBookings.length; i++) {
                for (let column of compColumns) {
                    if (admin._allCompanyBookings[i][column].toLowerCase().includes(searchedInfo.toLowerCase())) {
                        admin._searchedCompBooking.push(admin._allCompanyBookings[i]);
                        break;
                    }
                }
            }
            admin._allCompanyBookings = admin._searchedCompBooking;
            admin.displayAllCompanyBookings();

        })
    },

    showAllData: function () {
        admin.getAllIndividualBookingsFromDatabase();
        admin.getAllCompanyBookingsFromDatabase();
    },

    getMaxAndRemainingTables: function () {
        $.getJSON('/get-max-tables-data', function (response) {
            admin._maxTablesData = response;
            admin.displayMaxTablesData();
        });
        return admin._maxTablesData;
    },

    displayMaxTablesData: function () {
        try {
            document.getElementById("max-table-badge").innerHTML = admin._maxTablesData["max_tables"];
            document.getElementById("empty-table-badge").innerHTML = admin._maxTablesData["remaining_tables"];
            let bookedTables = admin._maxTablesData["max_tables"] - admin._maxTablesData["remaining_tables"];
            document.getElementById("booked-table-badge").innerHTML = bookedTables;
        } catch (err) {
            return;
        }
    },

    setMaxTables: function () {
        let maxTablesButton = document.getElementById("maxTablesButton");
        try {
            maxTablesButton.addEventListener('click', function () {
                let maxNumberOfTables = parseInt(document.getElementById("maxNumberOfTables").value);
                let currentNumberOfBookedTables = parseInt(admin._maxTablesData["max_tables"]) - parseInt(admin._maxTablesData["remaining_tables"]);
                if (maxNumberOfTables < currentNumberOfBookedTables) {
                    alert("Több foglalt asztal van jelenleg, mint amekkora maximumot be szeretnél állítani")
                } else {
                    $.post('/set-max-tables', {
                        maxTables: maxNumberOfTables
                    });
                }
                document.getElementById("maxNumberOfTables").value = "";
                admin.getMaxAndRemainingTables();
            })
        } catch (err) {
            return;
        }
    },

    deleteModifyIndiButtons: function () {
        let confirmDeleteButton = document.getElementById("confirm_delete_button");
        let confirmModifyButton = document.getElementById("confirm_modify_button");

        confirmDeleteButton.addEventListener('click', function () {
            let bookingNumber = document.getElementById("booking_number").value;
            let email = document.getElementById("email").value;
            $.post('/handle-modified-booking', {
                booking_number: bookingNumber,
                email: email,
                change: "delete"
            });
            admin.getAllIndividualBookingsFromDatabase();
        });
        confirmModifyButton.addEventListener('click', function () {
            let bookingNumber = document.getElementById("booking_number").value;
            let name = document.getElementById("name").value;
            let phoneNumber = document.getElementById("phone_number").value;
            let email = document.getElementById("email").value;
            let tableNumber = document.getElementById("table_number").value;
            $.post('/handle-modified-booking', {
                booking_number: bookingNumber,
                name: name,
                phone_number: phoneNumber,
                email: email,
                table_number: tableNumber,
                change: "modify"
            });
            admin.getAllIndividualBookingsFromDatabase();
        });
    },

    deleteModifyCompButtons: function () {
        let confirmDeleteButton = document.getElementById("confirm_comp_delete_button");
        let confirmModifyButton = document.getElementById("confirm_comp_modify_button");
        confirmDeleteButton.addEventListener('click', function () {
            let bookingNumber = document.getElementById("comp_booking_number").value;
            let email = document.getElementById("comp_email").value;
            let city = document.getElementById("comp_city").value;
            $.post('/handle-modified-booking', {
                booking_number: bookingNumber,
                newCompanyEmail: email,
                city: city,
                change: "delete"
            });
            admin.getAllCompanyBookingsFromDatabase();
        });
        confirmModifyButton.addEventListener('click', function () {
            let bookingNumber = document.getElementById("comp_booking_number").value;
            let name = document.getElementById("comp_name").value;
            let phoneNumber = document.getElementById("comp_phone_number").value;
            let email = document.getElementById("comp_email").value;
            let tableNumber = document.getElementById("comp_table_number").value;
            let city = document.getElementById("comp_city").value;
            let streetAddress = document.getElementById("comp_street_address").value;
            let streetType = document.getElementById("comp_street_type").value;
            let streetNum = document.getElementById("comp_street_num").value;
            let floorDoor = document.getElementById("comp_floor_door").value;
            let vatNumber = document.getElementById("comp_vat_number").value;
            let zipCode = document.getElementById("comp_zip_code").value;
            $.post('/handle-modified-booking', {
                booking_number: bookingNumber,
                newCompanyName: name,
                newCompanyPhoneNumber: phoneNumber,
                newCompanyEmail: email,
                company_table_number: tableNumber,
                city: city,
                street_address: streetAddress,
                street_type: streetType,
                street_num: streetNum,
                floor_door: floorDoor,
                vat_number: vatNumber,
                zip_code: zipCode,
                change: "modify"
            });
            admin.getAllCompanyBookingsFromDatabase();
        });
    },

    setModifyDeleteIndiButtonsVisibility: function () {
        let deleteButton = document.getElementById("delete_booking_button");
        let modifyButton = document.getElementById("modify_booking_button");
        let confirmModifyButton = document.getElementById("confirm_modify_button");
        let confirmDeleteButton = document.getElementById("confirm_delete_button");
        let modDelModalCloseButton = document.getElementById("mod-del-modal-close-button");
        modifyButton.addEventListener('click', function () {
            modifyButton.style.visibility = 'hidden';
            confirmModifyButton.style.visibility = "visible";
            confirmDeleteButton.style.visibility = "hidden";
            deleteButton.style.visibility = "visible";
        });
        deleteButton.addEventListener('click', function () {
            deleteButton.style.visibility = "hidden";
            confirmDeleteButton.style.visibility = "visible";
            confirmModifyButton.style.visibility = "hidden";
            modifyButton.style.visibility = "visible";
        });
        modDelModalCloseButton.addEventListener('click', function () {
            modifyButton.style.visibility = 'visible';
            confirmModifyButton.style.visibility = "hidden";
            confirmDeleteButton.style.visibility = "hidden";
            deleteButton.style.visibility = "visible";
        })
    },

    setModifyDeleteCompButtonsVisibility: function () {
        let compDeleteButton = document.getElementById("delete_comp_booking_button");
        let compModifyButton = document.getElementById("modify_comp_booking_button");
        let compConfirmModifyButton = document.getElementById("confirm_comp_modify_button");
        let compConfirmDeleteButton = document.getElementById("confirm_comp_delete_button");
        let modDelModalCloseButton = document.getElementById("mod-del-modal-close-button_comp");

        compModifyButton.addEventListener('click', function () {
            compModifyButton.style.visibility = 'hidden';
            compConfirmModifyButton.style.visibility = "visible";
            compConfirmDeleteButton.style.visibility = "hidden";
            compDeleteButton.style.visibility = "visible";
        });

        compDeleteButton.addEventListener('click', function () {
            compDeleteButton.style.visibility = "hidden";
            compConfirmDeleteButton.style.visibility = "visible";
            compConfirmModifyButton.style.visibility = "hidden";
            compModifyButton.style.visibility = "visible";
        });

        modDelModalCloseButton.addEventListener('click', function () {
            compModifyButton.style.visibility = 'visible';
            compConfirmModifyButton.style.visibility = "hidden";
            compConfirmDeleteButton.style.visibility = "hidden";
            compDeleteButton.style.visibility = "visible";
        })
    }
};

admin.init();
