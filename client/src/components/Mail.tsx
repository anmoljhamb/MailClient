import { ParsedMail } from "mailparser";
import React from "react";
import { Col, Row } from "react-bootstrap";

interface PropsInterface {
    mail: ParsedMail;
    handleOnClick(): void;
}

const Mail = ({ mail, handleOnClick }: PropsInterface) => {
    return (
        <React.Fragment>
            <Row id="mail" className="my-2" onClick={handleOnClick}>
                <Col xs={2}>{mail.from?.value.at(0)?.name}</Col>
                <Col>
                    {mail.subject} - {mail.text}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Mail;