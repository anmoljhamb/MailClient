import React, { useEffect, useRef, useState } from "react";
import { SocketContextInterface, SocketInterface } from "../types";
import { useSocket } from "../hooks";

const SocketContext = React.createContext<SocketContextInterface | null>(null);

interface PropsInterface {
    children: React.ReactNode;
}

const SocketProvider = ({ children }: PropsInterface) => {
    const socketRef = useRef<SocketInterface>(useSocket());
    const socket = socketRef.current;

    const [connected, setConnected] = useState<boolean>(
        socketRef.current.connected
    );

    useEffect(() => {
        if (!connected) {
            socketRef.current.connect();
        }
    }, [connected]);

    useEffect(() => {
        socketRef.current.on("disconnect", () => {
            setConnected(false);
            setTimeout(() => {
                console.log("SocketRef.current connecting again.");
                socketRef.current.connect();
            }, 1000);
        });

        socketRef.current.on("connect", () => {
            setConnected(true);
        });

        socketRef.current.onAny((event, ...args) => {
            console.log(event, ...args);
        });

        return () => {
            socketRef.current.off("disconnect");
            socketRef.current.off("connect");
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected, socketRef }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
export { SocketContext };
