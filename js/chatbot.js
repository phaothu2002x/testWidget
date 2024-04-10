startServer().then((res) => {
  connection.invoke("AddToGroup", _dvcId).then((r) => {
    console.log("AddToGroup", _dvcId);
  });
});

//bindConversation(_dvcId);

var _prevCmd = "";
var _cmd = "";
var _nextCmd = "";
function send() {
  var msg = document.getElementById("message").value;
  if (msg == "") return;
  addMsg(msg);
  //DELEAY MESSAGE RESPOSE Echo
  //window.setTimeout(addResponseMsg, 1000, msg);
  var _msgToServer = {
    deviceId: _dvcId,
    content: msg,
  };

  if (_nextCmd !== "") {
    _msgToServer.msgType = "BOT";
    _msgToServer.prevCommand = _cmd;
    _msgToServer.command = _nextCmd;
  }

  connection.invoke("SendMessage", JSON.stringify(_msgToServer)).then((r) => {
    console.log("SendMessage", _msgToServer);
  });
}

function addMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML =
    "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
    msg +
    "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  //SEND MESSAGE TO API
  document.getElementById("message").value = "";
  document.getElementById("message-box").scrollTop =
    document.getElementById("message-box").scrollHeight;
}
function addResponseMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML = "<div class='chat-message-received'>" + msg + "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message-box").scrollTop =
    document.getElementById("message-box").scrollHeight;
}
document.getElementById("message").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send();
  }
});

document.getElementById("chatbot_toggle").onclick = function () {
  if (document.getElementById("chatbot").classList.contains("collapsed")) {
    document.getElementById("chatbot").classList.remove("collapsed");
    document.getElementById("chatbot_toggle").children[0].style.display =
      "none";
    document.getElementById("chatbot_toggle").children[1].style.display = "";
    //setTimeout(addResponseMsg, 1000, "Hi");
  } else {
    document.getElementById("chatbot").classList.add("collapsed");
    document.getElementById("chatbot_toggle").children[0].style.display = "";
    document.getElementById("chatbot_toggle").children[1].style.display =
      "none";
  }
};

connection.on("ReceiveMessage", (msg) => {
  var item = JSON.parse(msg);
  console.log(item);
  if (item.msgType === "BOT") {
    _prevCmd = item.prevCommand;
    _cmd = item.command;
    _nextCmd = item.nextCommand;
  }
  addResponseMsg(item.content);
});

function bindConversation(dvcId) {
  _chatbotServices.GetConversation(dvcId, 0, 0, 100).then((r) => {
    if (r.respCode !== "success")
      ErrorToast("Error while fetching conversation.");
    else {
      var html = "";
      r.respObj.forEach((item) => {
        html = ``;
        if (item.msgType === "MESSAGE" || item.msgType === "BOT") {
          if (item.userId === 0) {
            html += `<div class="chat-message-div">`;
            html += `<span style="flex-grow:1"></span>`;
            html += `<div class="chat-message-sent">${item.content}</div>`;
            html += `</div>`;
          } else {
            html += `<div class="chat-message-div">`;
            html += `<div class="chat-message-received">${item.content}</div>`;
            html += `</div>`;
          }

          document.getElementById("message-box").innerHTML =
            html + document.getElementById("message-box").innerHTML;
        }
      });

      //$.getElementById("message-box").scrollIntoView(false);
    }
  });
}

document.getElementById("chat-menu").onclick = function () {
  $("#chatbot-command").toggleClass("hide");
};

$(document).on("click", ".chatbot-command-item", function () {
  var _cmd = $(this).data("value");
  $("#message").val(_cmd);
  _prevCmd = _cmd;
  //console.log(_cmd);

  sendBot();
  $("#chatbot-command").addClass("hide");
});

function sendBot() {
  var msg = document.getElementById("message").value;
  if (msg == "") return;
  addMsg(msg);
  //DELEAY MESSAGE RESPOSE Echo
  //window.setTimeout(addResponseMsg, 1000, msg);
  var _msgToServer = {
    deviceId: _dvcId,
    content: msg,
    msgType: "BOT",
    prevCommand: _prevCmd,
    command: msg,
  };

  connection.invoke("SendMessage", JSON.stringify(_msgToServer)).then((r) => {
    console.log("SendMessage", _msgToServer);
    //_prevCmd = msg;
  });
}

$(document).on("click", ".bot-action", function () {
  var _vcmd = $(this).data("value");
  $("#message").val(_vcmd);

  sendBot();
});
