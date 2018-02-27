function registrationPasswordCheck() {
    var registerButton = document.getElementById("submit");
    registerButton.addEventListener('click', function() {
        var password = document.getElementById("password").value;
        var passwordConfirm = document.getElementById("password2").value;
        if (password != passwordConfirm) {
            alert("The passwords are not matching!");
        }})}

registrationPasswordCheck();
