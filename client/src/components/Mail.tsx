import { ParsedMail } from "mailparser";
import React from "react";
import { Col, Row } from "react-bootstrap";

interface PropsInterface {
    mail: ParsedMail;
}

const Mail = ({ mail }: PropsInterface) => {
    return (
        <React.Fragment>
            <Row>
                <Col xs={2}>{mail.from?.text}</Col>
            </Row>
        </React.Fragment>
    );
};

export default Mail;
