admin_layout = {

    init: function () {
        this.notificationDivEventListener();
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
                timer(500).then(() => {
                    notificationDropdown.style.display = "none";
                });
            }
            style.getPropertyValue("opacity") === "1" ? notificationDropdown.style.opacity = "0" : notificationDropdown.style.opacity = "1";
            style.getPropertyValue("top") === "30px" ? notificationDropdown.style.top = "55px" : notificationDropdown.style.top = "30px";
        });
    }

};

admin_layout.init();