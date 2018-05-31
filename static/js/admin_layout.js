admin_layout = {

    init: function () {
        this.notificationDivEventListener();
        this.eventListenerToDocument();
    },

    notificationDivEventListener: function () {
        let notificationDiv = document.getElementById("notification_bell");
        notificationDiv.addEventListener('click', function () {
            let notificationDropdown = document.getElementById("notification_dropdown");
            let style = window.getComputedStyle(notificationDropdown);
            if (style.getPropertyValue("display") === "none") {
                notificationDropdown.style.display = "block";
            } else {
                const timer = ms => new Promise(resolve => setTimeout(resolve, ms));
                timer(200).then(() => {
                    notificationDropdown.style.display = "none";
                });
            }
            style.getPropertyValue("opacity") === "1" ? notificationDropdown.style.opacity = "0" : notificationDropdown.style.opacity = "1";
            style.getPropertyValue("top") === "30px" ? notificationDropdown.style.top = "55px" : notificationDropdown.style.top = "30px";
        });
    },

    eventListenerToDocument: function () {
        document.addEventListener("click", function () {
            let target = event.target;
            let notificationSign = document.getElementById("notification_dropdown_title");
            let notificationBell = document.getElementsByClassName("fa-bell")[0];
            let notificationDiv = document.getElementById("notification_bell");
            let notificationNumber = document.getElementById("notification_number");
            let notificationDropdown = document.getElementById("notification_dropdown");
            let notificationList = [notificationDiv, notificationDropdown, notificationBell, notificationNumber, notificationSign];
            for (let i = 0; i < notificationList.length; i++) {
                if (notificationList[i] === target) {
                    break;
                }
                if (i === notificationList.length - 1) {
                        notificationDropdown.style.opacity = "0";
                        notificationDropdown.style.top = "30px";
                    const timer = ms => new Promise(resolve => setTimeout(resolve, ms));
                    timer(200).then(() => {
                        notificationDropdown.style.display = "none";
                    })
                }
            }
        })
    }

};

admin_layout.init();