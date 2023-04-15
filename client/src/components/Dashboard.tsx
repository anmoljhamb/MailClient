import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import {
    Container,
    Row,
    Col,
    CloseButton,
    Form,
    Button,
    FloatingLabel,
} from "react-bootstrap";
import { GrAdd } from "react-icons/gr";
import { SocketContext } from "../contexts/Socket";
import { SocketContextInterface, SocketInterface } from "../types";

const Dashboard = () => {
    const [toEmail, setToEmail] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [addNew, setAddNew] = useState<boolean>(false);
    const { socketRef } = useContext(SocketContext) as SocketContextInterface;
    const socket = socketRef.current as SocketInterface;

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("sendMail", { to: toEmail, subject, text });
    };

    return (
        <>
            <button
                id="addNewMail"
                onClick={() => {
                    setAddNew(true);
                }}
                disabled={addNew}
            >
                <GrAdd />
            </button>
            {addNew && (
                <Container id="composeNew">
                    <Row>
                        <Col>
                            <h2>New Message</h2>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <CloseButton
                                onClick={() => {
                                    setAddNew(false);
                                }}
                            />
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Row>
                            <Form onSubmit={handleOnSubmit}>
                                <Form.FloatingLabel label="To" className="my-2">
                                    <Form.Control
                                        type="email"
                                        placeholder="To"
                                        value={toEmail}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setToEmail(e.target.value);
                                        }}
                                    />
                                </Form.FloatingLabel>
                                <Form.FloatingLabel
                                    label="Subject"
                                    className="my-2"
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="Subject"
                                        value={subject}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setSubject(e.target.value);
                                        }}
                                    />
                                </Form.FloatingLabel>
                                <Form.FloatingLabel
                                    controlId="floatingTextarea2"
                                    label="Text"
                                >
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: "10rem" }}
                                        value={text}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setText(e.target.value);
                                        }}
                                    />
                                </Form.FloatingLabel>
                                <Row className="my-2">
                                    <Col>
                                        <Button type="submit" variant="primary">
                                            Send
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Row>
                    </Row>
                </Container>
            )}
        </>
    );
};

export default Dashboard;
