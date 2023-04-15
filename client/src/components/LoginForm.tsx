import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";

interface PropsInterface {
    handleOnSubmit(e: FormEvent<HTMLFormElement>): void;
    email: string;
    setEmail(arg0: string): void;
    password: string;
    setPassword(arg0: string): void;
    processing: boolean;
}

function LoginForm({
    handleOnSubmit,
    email,
    setEmail,
    password,
    setPassword,
    processing,
}: PropsInterface) {
    const isDisabled = email.length === 0 && password.length === 0;

    return (
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
                            autoComplete="current-password"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </Form.Group>
                    <Button
                        type="submit"
                        variant="secondary w-100"
                        disabled={isDisabled || processing}
                    >
                        Login
                    </Button>
                </Form>
            </Row>
        </Container>
    );
}

export default LoginForm;
