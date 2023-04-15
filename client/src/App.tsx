import { useContext, useEffect, useState } from "react";
import "./App.css";
import { SocketContext } from "./contexts/Socket";
import { SocketContextInterface } from "./types";
import { Button, Container } from "react-bootstrap";

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
            <Container>
                <Button variant="primary">button 1</Button>
                <div className="deveve">hello world!</div>
                <div className="status">
                    {connected ? "connected" : "not connected"}
                </div>
            </Container>
        </>
    );
}

export default App;
