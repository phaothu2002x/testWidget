"use strict";
document.getElementById("btnLogin").addEventListener("click", function () {
  var _usr = document.getElementById("tbUsername").value;
  var _pwd = document.getElementById("tbPassword").value;
  if (_usr === "" || _pwd === "") {
    ErrorToast("Username and password must be entered.");
    return false;
  }

  var _cre = {
    username: _usr,
    password: _pwd,
  };

  _userServices.Login(_cre).then((_res) => {
    if (_res.respCode !== "success")
      ErrorToast("Username or password is not correct.");
    else {
      var _token = _res.respObj;
      localStorage.setItem("usr", JSON.stringify(_token));
      location.href = "dashboard.html";
    }
  });
});
