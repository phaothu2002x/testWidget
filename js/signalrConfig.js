var _tokenUsr = "";
if (localStorage.getItem("usr") !== null) {
  _tokenUsr = JSON.parse(localStorage.getItem("usr")).access_token;
}
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${_url.api}/chatbot?access_token=${_tokenUsr}`, {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
  })
  .build();

async function startServer() {
  try {
    if (connection.state === "Disconnected") {
      await connection.start();
      console.log("SignalR connected.");
    } else {
      console.log("SignalR currently connected.");
    }
  } catch (err) {
    console.log(err);
  }
}

connection.onclose = function (evt) {
  console.log(evt);
};
