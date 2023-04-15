import React, { useState } from "react";
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

const Dashboard = () => {
    const [addNew, setAddNew] = useState<boolean>(false);

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
                            <Form>
                                <Form.FloatingLabel label="To" className="my-2">
                                    <Form.Control
                                        type="email"
                                        placeholder="To"
                                    />
                                </Form.FloatingLabel>
                                <Form.FloatingLabel
                                    label="Subject"
                                    className="my-2"
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="Subject"
                                    />
                                </Form.FloatingLabel>
                                <Form.FloatingLabel
                                    controlId="floatingTextarea2"
                                    label="Body"
                                >
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: "10rem" }}
                                    />
                                </Form.FloatingLabel>
                                <Row className="my-2">
                                    <Col>
                                        <Button variant="primary">Send</Button>
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
