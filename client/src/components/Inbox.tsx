import { ParsedMail } from "mailparser";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

interface PropsInterface {
    mails: ParsedMail[];
    mailsNumber: number;
    lowerRange: number;
    setLowerRange(arg0: number): void;
    upperRange: number;
    setUpperRange(arg0: number): void;
}

const Inbox = ({
    mails,
    mailsNumber,
    lowerRange,
    setLowerRange,
    upperRange,
    setUpperRange,
}: PropsInterface) => {
    return (
        <>
            <Container>
                <Row className="d-flex justify-content-between align-items-center">
                    <Col>
                        <Button variant="primary">Refresh</Button>
                    </Col>
                    <Col
                        xs={2}
                        // className="d-flex flex-column justify-content-center align-items-end"
                    >
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <b>
                                    {lowerRange} - {upperRange} of {mailsNumber}
                                </b>
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-center">
                            <Col className="d-flex justify-content-center">
                                <Button variant="outline-secondary">
                                    <GrFormPrevious />
                                </Button>
                            </Col>

                            <Col className="d-flex justify-content-center">
                                <Button variant="outline-secondary">
                                    <GrFormNext />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
            </Container>
        </>
    );
};

export default Inbox;
