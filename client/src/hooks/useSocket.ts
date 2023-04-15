import io from "socket.io-client";
import { BACKEND_URI } from "../constants";

const useSocket = () => {
    console.log("useSocket hook.");

    return io(BACKEND_URI, {
        auth: {
            username: "sampleUsername",
        },
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 500,
    });
};

export default useSocket;
