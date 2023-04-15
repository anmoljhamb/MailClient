import { ParsedMail } from "mailparser";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

interface PropsInterface {
    mails: ParsedMail[];
    stepCount: number;
    mailsNumber: number;
    lowerRange: number;
    setLowerRange(arg0: number): void;
    upperRange: number;
    setUpperRange(arg0: number): void;
}

const Inbox = ({
    mails,
    mailsNumber,
    stepCount,
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
                                <Button
                                    variant="secondary"
                                    disabled={lowerRange - stepCount < 0}
                                    onClick={() => {
                                        setUpperRange(upperRange - stepCount);
                                        setLowerRange(lowerRange - stepCount);
                                    }}
                                >
                                    <GrFormPrevious />
                                </Button>
                            </Col>

                            <Col className="d-flex justify-content-center">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setUpperRange(upperRange + stepCount);
                                        setLowerRange(lowerRange + stepCount);
                                    }}
                                    disabled={
                                        upperRange + stepCount > mailsNumber
                                    }
                                >
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
