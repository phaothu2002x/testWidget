var _userServices =
  _userServices ||
  (function ($) {
    return {
      Login: async function (obj) {
        var _response;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          username: obj.username,
          password: obj.password,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        await fetch(`${_url.api}/user/login`, requestOptions)
          .then((response) => response.json())
          .then((result) => (_response = result))
          .catch((error) => console.error("error", error));

        return _response;
      },
    };
  })();
