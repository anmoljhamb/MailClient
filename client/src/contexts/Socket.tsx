import React, { useEffect, useState } from "react";
import { SocketContextInterface, SocketInterface } from "../types";
import { useSocket } from "../hooks";

const SocketContext = React.createContext<SocketContextInterface | null>(null);

interface PropsInterface {
    children: React.ReactNode;
}

const SocketProvider = ({ children }: PropsInterface) => {
    const socket = useSocket();
    const [connected, setConnected] = useState<boolean>(socket.connected);

    useEffect(() => {
        socket.on("disconnect", () => {
            setConnected(false);
            setTimeout(() => {
                console.log("Socket connecting again.");
                socket.connect();
            }, 1000);
        });

        socket.on("connect", () => {
            setConnected(true);
        });

        socket.onAny((event, ...args) => {
            console.log(event, ...args);
        });

        return () => {
            socket.off("disconnect");
            socket.off("connect");
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
export { SocketContext };
