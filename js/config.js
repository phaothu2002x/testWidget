const _url = {
  api: "https://stg.api.ce.fortytwo-ai.com",
};

var _dvcId = localStorage.getItem("deviceId");
if (_dvcId === null) {
  _dvcId = uuidv4();
  localStorage.setItem("deviceId", _dvcId);
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}
