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
        $.getJSON('/admin/get-indi-modified-bookings', function (response) {
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
                tableRow.classList.add(admin._allIndiBookings[row]["id"]);
                let columns = ["name", "email", "phone_number", "booked_tables", "date_time", "modified_time", "seen"];
                for (let i = 0; i < columns.length; i++) {
                    let tableData = document.createElement("td");
                    let tempItem;
                    if (columns[i] === "date_time") {
                        let dateTime = new Date(admin._allIndiBookings[row][columns[i]]);
                        let correctMonth = dateTime.getMonth() + 1;
                        tempItem = document.createTextNode(dateTime.getUTCFullYear() + "-" + correctMonth + "-" + dateTime.getDate()
                            + " | " + dateTime.getUTCHours() + ":" + dateTime.getMinutes());
                        tableData.appendChild(tempItem);
                    } else if (columns[i] === "seen") {
                        tempItem = document.createElement("i");
                        tempItem.classList.add("far");
                        tempItem.classList.add("fa-check-circle");
                        tempItem.classList.add("fa-2x");
                        tempItem.classList.add("unseen");
                        this.addingUnSeenCircleEventListener(tempItem, "indi");
                        tableData.appendChild(tempItem)
                    } else if (columns[i] === "booked_tables") {
                        let button = document.createElement("button");
                        button.classList.add("btn");
                        button.classList.add("btn-info");
                        button.classList.add("modify-booking-button");

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
        $.getJSON('/admin/get-company-modified-bookings', function (response) {
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
                tableRow.classList.add(admin._allCompanyBookings[row]["id"]);
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
                    "date_time",
                    "modified_time",
                    "seen"
                ];
                for (let i = 0; i < columns.length; i++) {
                    var tableData = document.createElement("td");
                    let tempItem;
                    if (columns[i] === "date_time" || columns[i] === "modified_time") {
                        let dateTime = new Date(admin._allCompanyBookings[row][columns[i]]);
                        admin._time = dateTime;
                        let correctMonth = dateTime.getMonth() + 1;
                        tempItem = document.createTextNode(dateTime.getUTCFullYear() + "-" + correctMonth + "-" + dateTime.getDate()
                            + " | " + dateTime.getUTCHours() + ":" + dateTime.getMinutes());
                        tableData.appendChild(tempItem);
                    } else if (columns[i] === "seen") {
                        tempItem = document.createElement("i");
                        tempItem.classList.add("far");
                        tempItem.classList.add("fa-check-circle");
                        tempItem.classList.add("fa-2x");
                        tempItem.classList.add("unseen");
                        this.addingUnSeenCircleEventListener(tempItem, "company");
                        tableData.appendChild(tempItem)
                    } else if (columns[i] === "booked_tables") {
                        let button = document.createElement("button");
                        button.classList.add("btn");
                        button.classList.add("btn-info");
                        button.classList.add("modify-booking-button");

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
            console.log(err);
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
    },

    addingUnSeenCircleEventListener: function (tempItem, category) {
        tempItem.addEventListener("click", function () {
            tempItem.classList.remove("unseen");
            tempItem.classList.add("seen");
            if (category === "company") {
                let modifiedCompanyBody = document.getElementById("modified_company_body").children;
                for (let row of modifiedCompanyBody) {
                    if (row.getElementsByClassName("fa-check-circle")[0].classList.contains("seen")) {
                        let seenRowId = row.className;
                        $.post('/admin-change-modified-to-seen', {
                            seenRowId: seenRowId
                        });
                    }
                }
            } else {
                let modifiedIndiBody = document.getElementById("modified_indi_body").children;
                for (let row of modifiedIndiBody) {
                    if (row.getElementsByClassName("fa-check-circle")[0].classList.contains("seen")) {
                        let seenRowId = row.className;
                        $.post('/admin-change-modified-to-seen', {
                            seenRowId: seenRowId
                        });
                    }
                }
            }
        });
    }
};

admin.init();
