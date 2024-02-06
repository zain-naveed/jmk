import { SocketURL } from "shared/utils/endpoints";
import * as io from "socket.io-client";
let socket = io.connect(SocketURL, { transports: ["websocket"] });
// let socket = io.connect(SocketURL)


const initSocket = () => {
  socket = socket.on('connect', () => {
    console.log("Socket Connected");
  });
};
export { socket, initSocket };
