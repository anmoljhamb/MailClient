import React, { ChangeEvent, FormEvent, useRef } from "react";
import {
    Container,
    Row,
    Col,
    CloseButton,
    Form,
    Button,
} from "react-bootstrap";
import { FileRefInterface } from "../types";

interface PropsInterface {
    setAddNew(arg0: boolean): void;
    handleOnSubmit(e: FormEvent<HTMLFormElement>): void;
    toEmail: string;
    setToEmail(arg0: string): void;
    text: string;
    setText(arg0: string): void;
    bcc: string;
    setBcc(arg0: string): void;
    cc: string;
    setCc(arg0: string): void;
    subject: string;
    setSubject(arg0: string): void;
    sending: boolean;
    fileRef: FileRefInterface;
}

function ComposeNew({
    setAddNew,
    handleOnSubmit,
    toEmail,
    setToEmail,
    cc,
    setCc,
    bcc,
    setBcc,
    subject,
    setSubject,
    text,
    setText,
    sending,
    fileRef,
}: PropsInterface) {
    return (
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
                        <Form.FloatingLabel label="CC" className="my-2">
                            <Form.Control
                                type="text"
                                placeholder="CC"
                                value={cc}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setCc(e.target.value);
                                }}
                            />
                        </Form.FloatingLabel>
                        <Form.FloatingLabel label="BCC" className="my-2">
                            <Form.Control
                                type="text"
                                placeholder="BCC"
                                value={bcc}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setBcc(e.target.value);
                                }}
                            />
                        </Form.FloatingLabel>
                        <Form.FloatingLabel label="Subject" className="my-2">
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
                                style={{
                                    height: "10rem",
                                }}
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
                                <Form.Control type="file" ref={fileRef} />
                            </Col>
                            <Col>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={sending}
                                >
                                    Send
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </Row>
        </Container>
    );
}

export default ComposeNew;
