import { ParsedMail } from "mailparser";
import React from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import Mail from "./Mail";

interface PropsInterface {
    mails: ParsedMail[];
    stepCount: number;
    mailsNumber: number;
    lowerRange: number;
    setLowerRange(arg0: number): void;
    upperRange: number;
    setUpperRange(arg0: number): void;
    processing: boolean;
}

const Inbox = ({
    mails,
    mailsNumber,
    stepCount,
    lowerRange,
    setLowerRange,
    upperRange,
    setUpperRange,
    processing,
}: PropsInterface) => {
    const handleOnClick = (index: number) => {
        const _util = () => {
            console.log(mails[index]);
        };
        return _util;
    };

    return (
        <>
            <Container id="mailsContainer">
                <Row className="d-flex justify-content-between align-items-center">
                    <Col>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setLowerRange(0);
                                setUpperRange(stepCount);
                            }}
                        >
                            Refresh
                        </Button>
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
                                    disabled={
                                        lowerRange - stepCount < 0 || processing
                                    }
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
                                        upperRange + stepCount > mailsNumber ||
                                        processing
                                    }
                                >
                                    <GrFormNext />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Container id="mails">
                    {processing && <Spinner id="spinner" animation="border" />}
                    {!processing &&
                        mails.reverse().map((mail, index) => {
                            return (
                                <Mail
                                    mail={mail}
                                    key={index}
                                    handleOnClick={handleOnClick(index)}
                                />
                            );
                        })}
                </Container>
            </Container>
        </>
    );
};

export default Inbox;
