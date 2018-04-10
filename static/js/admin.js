admin = {
    _allIndieBooking: "",
    _allCompanyBookings: "",
    _indiOrderDirection: "",
    _companyOrderDirection: "",
    _searchedIndiBooking: [],
    _searchedCompBooking: [],
    _maxTablesData: {},

    init: function () {
        this.getAllCompanyBookingsFromDatabase();
        this.getAllIndividualBookingsFromDatabase();
        this.getMaxAndRemainingTables();
        this.setMaxTables();
        this.sortIndiBookings();
        this.sortCompanyBookings();
        this.addingEventListenerToMenuDropDown();
        this.search();
        this.showAllData();
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
                let tableData = document.createElement("td");
                let tempItem;
                if (columns[i] === "date_time") {
                    tempItem = document.createTextNode(admin._allIndieBooking[row][columns[i]]);
                } else {
                    tempItem = document.createTextNode(admin._allIndieBooking[row][columns[i]]);
                }
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
    },

    search: function() {
        admin._searchedIndiBooking = [];
        admin._searchedCompBooking = [];
        admin.getAllIndividualBookingsFromDatabase();
        admin.getAllCompanyBookingsFromDatabase();
        let searchButton = document.getElementById("searchButton");
        let indiColumns = ["name", "email"];
        let compColumns = ["name", "email", "city", "street_address", "street_type"];
        searchButton.addEventListener('click', function() {
            let searchedInfo = document.getElementById("searchInput").value;
            document.getElementById("searchInput").value = "";
            for (let i = 0; i < admin._allIndieBooking.length; i++) {
                for (let column of indiColumns) {
                    if (admin._allIndieBooking[i][column].toLowerCase().includes(searchedInfo.toLowerCase())) {
                        admin._searchedIndiBooking.push(admin._allIndieBooking[i]);
                        break;
                    }
                }
            }
            admin._allIndieBooking = admin._searchedIndiBooking;
            admin._searchedIndiBooking = [];
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
            admin._searchedCompBooking = [];
            admin.displayAllCompanyBookings();

        })
    },

    showAllData: function() {
        let showAllButton = document.getElementById("show_all");
        showAllButton.addEventListener('click', function() {
            admin.getAllIndividualBookingsFromDatabase();
            admin.getAllCompanyBookingsFromDatabase();
            admin.displayAllIndividualBookings();
            admin.displayAllCompanyBookings();
        })
    },

    getMaxAndRemainingTables: function() {
        $.getJSON('/get-max-tables-data', function(response) {
            admin._maxTablesData = response;
            admin.displayMaxTablesData();
        });
        return admin._maxTablesData;
    },

    displayMaxTablesData: function() {
        let tableBody = document.getElementById("maxTablesTableBody");
        if (tableBody.hasChildNodes()) {
            tableBody.removeChild(tableBody.firstChild);
        }
        let tableRow = document.createElement("tr");
        let columns = ["max_tables", "remaining_tables"];
        for (let i = 0; i < columns.length; i++) {
            let tableData = document.createElement("td");
            let tempItem = document.createTextNode(admin._maxTablesData[columns[i]]);
            tableData.appendChild(tempItem);
            tableRow.appendChild(tableData);
        }
        tableBody.appendChild(tableRow);
    },

    setMaxTables: function() {
        let maxTablesButton = document.getElementById("maxTablesButton");
        maxTablesButton.addEventListener('click', function() {
            let maxNumberOfTables = document.getElementById("maxNumberOfTables").value;
                $.post('/set-max-tables', {
                    maxTables: maxNumberOfTables
                });
            document.getElementById("maxNumberOfTables").value = "";
            admin.getMaxAndRemainingTables();
        })
    }
};

admin.init();
