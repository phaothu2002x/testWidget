var _token = "";
if (localStorage.getItem("usr") !== null)
  _token = JSON.parse(localStorage.getItem("usr")).access_token;

var _chatbotServices =
  _chatbotServices ||
  (function ($) {
    return {
      GetAllRoom: async function (i, z) {
        var _response;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${_token}`);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        await fetch(
          `${_url.api}/c/Chatbot/all?pageIndex=${i}&pageSize=${z}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => (_response = result))
          .catch((error) => console.error("error", error));

        return _response;
      },
      GetConversation: async function (d, l, i, z) {
        var _response;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${_token}`);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        await fetch(
          `${_url.api}/c/Chatbot/${d}/conversation?lastId=${l}&pageIndex=${i}&pageSize=${z}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => (_response = result))
          .catch((error) => console.error("error", error));

        return _response;
      },
    };
  })();
