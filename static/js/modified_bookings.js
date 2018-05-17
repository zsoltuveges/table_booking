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
        this.sortIndiBookings();
        this.sortCompanyBookings();
        this.addingEventListenerToMenuButtons();
    },

    getAllIndividualBookingsFromDatabase: function () {
        $.getJSON('/admin/get-modified-bookings', function (response) {
            admin._allIndiBookings = response;
            admin._backupIndiBookings = response;
            admin.displayAllIndividualBookings();
        })
    },

    displayAllIndividualBookings: function () {
        try {
            let tableBody = document.getElementById("modified_indi_body");
            tableBody.innerHTML = "";
            for (let row = 0; row < admin._allIndiBookings.length; row++) {
                var tableRow = document.createElement("tr");
                let columns = ["name", "email", "phone_number", "booked_tables", "date_time"];
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
                            let bookingId = document.getElementById("booking_id");
                            bookingId.value = admin._allIndiBookings[row].id;
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
        $.getJSON('/admin/get-modified-bookings', function (response) {
            admin._allCompanyBookings = response;
            admin._backupCompanyBookings = response;
            admin.displayAllCompanyBookings();
        })
    },

    displayAllCompanyBookings: function () {
        try {
            let tableBody = document.getElementById("modified_company_body");
            tableBody.innerHTML = "";
            for (let row = 0; row < admin._allCompanyBookings.length; row++) {
                var tableRow = document.createElement("tr");
                let columns = [
                    "name",
                    "email",
                    "phone_number",
                    "booked_tables",
                    "zip_code",
                    "city",
                    "street_address",
                    "street_type",
                    "street_num",
                    "floor_door",
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
                            let streetNumModify = document.getElementById("comp_street_num");
                            streetNumModify.value = admin._allCompanyBookings[row].street_num;
                            let floorDoorModify = document.getElementById("comp_floor_door");
                            floorDoorModify.value = admin._allCompanyBookings[row].floor_door;
                            let vatNumberModify = document.getElementById("comp_vat_number");
                            vatNumberModify.value = admin._allCompanyBookings[row].vat_number;
                            let bookingId = document.getElementById("comp_booking_id");
                            bookingId.value = admin._allCompanyBookings[row].id;
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

    showAllData: function () {
        admin.getAllIndividualBookingsFromDatabase();
        admin.getAllCompanyBookingsFromDatabase();
    }
};

admin.init();
