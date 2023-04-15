import { useContext, useEffect, useState } from "react";
import "./App.css";
import { SocketContext } from "./contexts/Socket";
import { SocketContextInterface } from "./types";

function App() {
    const { socket, connected } = useContext(
        SocketContext
    ) as SocketContextInterface;

    console.log(connected);

    useEffect(() => {
        console.log(socket);
        socket.connect();
    }, []);

    return (
        <>
            <div className="container">hello world!</div>
            <div className="status">
                {connected ? "connected" : "not connected"}
            </div>
        </>
    );
}

export default App;
