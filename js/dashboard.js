var _activeDvcId = "";
function fn_LoadConversation() {
  startServer().then((res) => {
    _chatbotServices.GetAllRoom(0, 300).then((r) => {
      if (r.respCode !== "success")
        ErrorToast("Error while fetching chat group.");
      else {
        var html = "";
        r.respObj.forEach((item) => {
          console.log(item);
          var _isOnline = "<span class='c-openchat__box__status'></span>";
          if (item.isConnecting === "N")
            _isOnline = "<span class='c-openchat__box__status__off'></span>";

          html += `<li onclick="handleOpenChat('${item.deviceId}', this)" class="c-chats__list" data-id="${item.deviceId}"><a class="c-chats__link" href="" title="">`;
          html += `<a class="c-chats__link" href="#" title="">`;
          html += `<div class="c-chats__image-container">`;
          html += `   ${_isOnline}`;
          html += `</div>`;
          html += `<div class="c-chats__info">`;
          html += `   <p class="c-chats__title">${item.clientName} (${item.channel})</span></p><span>${item.lastActiveAt}</span>`;
          html += `   <p class="c-chats__excerpt">${item.content}</p>`;
          html += `</div>`;
          html += `</a>`;
          html += `</li>`;

          connection.invoke("AddToGroup", item.deviceId).then((r) => {
            console.log("AddToGroup", item.deviceId);
          });
        });
        document.getElementById("chatRoom").innerHTML = html;
      }

      const _stItem = document.getElementById("chatRoom").firstElementChild;
      _stItem.classList.add("active");
      const _stDvcId = _stItem.dataset.id;
      _activeDvcId = _stDvcId;

      bindConversation(_activeDvcId);
    });
  });
}

function bindConversation(dvcId) {
  _chatbotServices.GetConversation(dvcId, 0, 0, 100).then((r) => {
    if (r.respCode !== "success")
      ErrorToast("Error while fetching conversation.");
    else {
      var html = "";
      var _isMine = "";
      r.respObj.forEach((item) => {
        html = ``;
        _isMine = ``;
        //if (item.msgType === "MESSAGE") {
        if (item.userId > 0 || item.msgType === "BOT") _isMine = `mine`;

        html += `<li class="c-bubble ${_isMine}"><img class="c-bubble__image" src="https://s.cdpn.io/profiles/user/739421/80.jpg?1557442808" alt="">`;
        html += `<p class="c-bubble__msg">${item.content}`;
        html += `<span class="c-bubble__timestamp">${item.createdAt}</span>`;
        html += `</p>`;
        html += `</li>`;

        document.getElementById("chatConversation").innerHTML =
          html + document.getElementById("chatConversation").innerHTML;
        //}
      });

      document.getElementById("chatConversation").scrollIntoView(false);
    }
  });
}

connection.on("ReceiveMessage", (msg) => {
  var _isMine = ``;
  var item = JSON.parse(msg);
  console.log(item);
  if (_activeDvcId === item.deviceId) {
    if (item.userId > 0 || item.msgType === "BOT") _isMine = `mine`;

    var html = ``;
    html += `<li class="c-bubble ${_isMine}""><img class="c-bubble__image" src="https://s.cdpn.io/profiles/user/739421/80.jpg?1557442808" alt="">`;
    html += `<p class="c-bubble__msg">${item.content}`;
    html += `<span class="c-bubble__timestamp">${item.createdAt}</span>`;
    html += `</p>`;
    html += `</li>`;

    document.getElementById("chatConversation").innerHTML += html;
    document.getElementById("chatConversation").scrollIntoView(false);
  } else {
    var _grId = $("ul").find(`[data-id='${item.deviceId}']`);
    _grId.find("p:last-child").text(item.content);
  }
});

document.getElementById("message").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send();
  }
});

function send() {
  var msg = document.getElementById("message").value;
  if (msg == "") return;
  addMsg(msg);
  //DELEAY MESSAGE RESPOSE Echo
  //window.setTimeout(addResponseMsg, 1000, msg);
  var _msgToServer = {
    deviceId: _activeDvcId,
    content: msg,
  };

  connection.invoke("SendMessage", JSON.stringify(_msgToServer)).then((r) => {
    console.log("SendMessage", _msgToServer);
    var _grId = $("ul").find(`[data-id='${_activeDvcId}']`);
    _grId.find("p:last-child").text(msg);
  });
}
function addMsg(msg) {
  var html = ``;
  html += `<li class="c-bubble mine"><img class="c-bubble__image" src="https://s.cdpn.io/profiles/user/739421/80.jpg?1557442808" alt="">`;
  html += `<p class="c-bubble__msg">${msg}`;
  html += `<span class="c-bubble__timestamp">${new Date()}</span>`;
  html += `</p>`;
  html += `</li>`;

  document.getElementById("message").value = "";
  document.getElementById("chatConversation").innerHTML += html;
  document.getElementById("chatConversation").scrollIntoView(false);
}

function handleOpenChat(dvcId, el) {
  _activeDvcId = dvcId;
  var _li = document.getElementById("chatRoom").querySelectorAll("li");
  _li.forEach((_el) => _el.classList.remove("active"));

  el.classList.add("active");

  document.getElementById("chatConversation").innerHTML = "";
  bindConversation(dvcId);
}
