admin = {
    _allIndieBooking: "",
    _allCompanyBookings: "",
    _indiOrderDirection: "",
    _companyOrderDirection: "",

    init: function () {
        this.getAllCompanyBookingsFromDatabase();
        this.getAllIndividualBookingsFromDatabase();
        this.sortIndiBookings();
        this.sortCompanyBookings();
        this.addingEventListenerToMenuDropDown();
    },
    getAllIndividualBookingsFromDatabase: function () {
        $.getJSON('/get-individual-bookings', function (response) {
            admin._allIndieBooking = response;
            admin.displayAllIndividualBookings();
        })
    },

    displayAllIndividualBookings: function () {
        let tableBody = document.getElementById("indi_body");
        tableBody.innerHTML = "";
        for (let row = 0; row < admin._allIndieBooking.length; row++) {
            var tableRow = document.createElement("tr");
            //tableRow.className = "residents-info";
            let columns = ["name", "email", "phone_number", "booked_tables", "date_time"];
            for (let i = 0; i < columns.length; i++) {
                var tableData = document.createElement("td");
                var tempItem = document.createTextNode(admin._allIndieBooking[row][columns[i]]);
                tableData.appendChild(tempItem);
                tableRow.appendChild(tableData);
            }
            tableBody.appendChild(tableRow);
        }
        let individualTable = document.getElementById("individual_table");
        individualTable.appendChild(tableBody);

    },

    getAllCompanyBookingsFromDatabase: function () {
        $.getJSON('/get-company-bookings', function (response) {
            admin._allCompanyBookings = response;
            admin.displayAllCompanyBookings();
        })
    },

    displayAllCompanyBookings: function () {
        let tableBody = document.getElementById("company_body");
        tableBody.innerHTML = "";
        for (let row = 0; row < admin._allCompanyBookings.length; row++) {
            var tableRow = document.createElement("tr");
            //tableRow.className = "residents-info";
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
                var tempItem = document.createTextNode(admin._allCompanyBookings[row][columns[i]]);
                tableData.appendChild(tempItem);
                tableRow.appendChild(tableData);
            }
            tableBody.appendChild(tableRow);
        }
        let companyTable = document.getElementById("company_table");
        companyTable.appendChild(tableBody);

    },

    sortIndiBookings: function () {
        let orderingColumns = [];
        let category = "individuals";
        orderingColumns.push(document.getElementById("indi_name"), document.getElementById("indi_table"), document.getElementById("indi_time"));
        for (column of orderingColumns) {
            column.style.cursor = "pointer";
            let orderBy = column.dataset.name;
            column.addEventListener('click', function () {
                if (admin._indiOrderDirection == "" || admin._indiOrderDirection == "DESC") {
                    admin._indiOrderDirection = "ASC";
                } else if (admin._indiOrderDirection == "ASC") {
                    admin._indiOrderDirection = "DESC"
                }
                let jsonURL = '/order/' + orderBy + '/' + admin._indiOrderDirection + '/' + category;
                $.getJSON(jsonURL, function (response) {
                    admin._allIndieBooking = response;
                    admin.displayAllIndividualBookings();
                });
            })
        }
    },

    sortCompanyBookings: function () {
        let orderingColumns = [];
        let category = "company";
        orderingColumns.push(document.getElementById("company_name"), document.getElementById("comp_table"), document.getElementById("company_time"));
        for (column of orderingColumns) {
            column.style.cursor = "pointer";
            let orderBy = column.dataset.name;
            column.addEventListener('click', function () {
                if (admin._companyOrderDirection == "" || admin._companyOrderDirection == "DESC") {
                    admin._companyOrderDirection = "ASC";
                } else if (admin._companyOrderDirection == "ASC") {
                    admin._companyOrderDirection = "DESC"
                }
                let jsonURL = '/order/' + orderBy + '/' + admin._companyOrderDirection + '/' + category;
                $.getJSON(jsonURL, function (response) {
                    admin._allCompanyBookings = response;
                    admin.displayAllCompanyBookings();
                });
            })
        }
    },

    addingEventListenerToMenuDropDown: function () {
        let menuInvite = document.getElementById("menu-invite");
        menuInvite.style.cursor = "pointer";
        let menuSaveBookings = document.getElementById("menu-save-bookings");
        menuSaveBookings.style.cursor = "not-allowed";
    }
};

admin.init();