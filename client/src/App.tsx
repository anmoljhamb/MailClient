import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { SocketContextInterface } from "./types";
import { Button, Container, Form, Row } from "react-bootstrap";

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
            <Container id="loginForm">
                <Row>
                    <h1 className="text-center">MailClient</h1>
                    <hr />
                </Row>
                <Row className="m-3">
                    <Form>
                        <Form.Group className="my-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                            />
                        </Form.Group>
                        <Form.Group className="my-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                            />
                        </Form.Group>
                        <Button variant="secondary w-100">Login</Button>
                    </Form>
                </Row>
            </Container>
        </>
    );
}

export default App;
