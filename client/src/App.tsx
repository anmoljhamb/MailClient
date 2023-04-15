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
        socket.connect();
    }, []);

    return (
        <>
            <div className="container">hello world!</div>
            <div className="status"></div>
        </>
    );
}

export default App;
