import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { SocketContextInterface } from "./types";
import { Button, Container, Form, Row } from "react-bootstrap";

function App() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { socket, connected } = useContext(
        SocketContext
    ) as SocketContextInterface;

    const isDisabled = email.length === 0 && password.length === 0;

    useEffect(() => {
        socket.connect();
    }, []);

    // handlers.

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        console.log(password);
    };

    return (
        <>
            <Container id="loginForm">
                <Row>
                    <h1 className="text-center">MailClient</h1>
                    <hr />
                </Row>
                <Row className="m-3">
                    <Form onSubmit={handleOnSubmit}>
                        <Form.Group className="my-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="my-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            variant="secondary w-100"
                            disabled={isDisabled}
                        >
                            Login
                        </Button>
                    </Form>
                </Row>
            </Container>
        </>
    );
}

export default App;
