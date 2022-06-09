import Echo from "laravel-echo";
import Cookie from "js-cookie";
let token = Cookie.get("authToken");

window.io = require("socket.io-client");
window.Echo = new Echo({
  broadcaster: "socket.io",
  host: process.env.echoHost,
  auth: {
    headers: {
      Authorization: "Bearer " + token,
    },
  },
});
