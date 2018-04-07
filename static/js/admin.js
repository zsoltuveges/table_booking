admin = {
    _allIndieBooking: "",
    _allCompanyBookings: "",
    _orderDirection: '',
    init: function () {
        this.getAllCompanyBookingsFromDatabase();
        this.getAllIndividualBookingsFromDatabase();
        this.sortIndiBookings();
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
        orderingColumns.push(document.getElementById("indi_name"), document.getElementById("indi_table"), document.getElementById("indi_time"));
        for (column of orderingColumns) {
            column.style.cursor = "pointer";
            let orderBy = column.dataset.name;
            column.addEventListener('click', function () {
                if (admin._orderDirection == "" || admin._orderDirection == "DESC") {
                    admin._orderDirection = "ASC";
                } else if (admin._orderDirection == "ASC") {
                    admin._orderDirection = "DESC"
                }
                let jsonURL = '/order/' + orderBy + '/' + admin._orderDirection;
                $.getJSON(jsonURL, function (response) {
                    admin._allIndieBooking = response;
                    admin.displayAllIndividualBookings();
                });
            })
        }
    }
};

admin.init();