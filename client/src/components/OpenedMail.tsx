import { ParsedMail } from "mailparser";
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Markup } from "interweave";

interface PropsInterface {
    show: boolean;
    onHide(): void;
    mail: ParsedMail;
}

const OpenedMail = (props: PropsInterface) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.mail?.subject}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.mail.from?.value.at(0)?.name}</h4>
                <Markup content={props.mail.textAsHtml} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OpenedMail;
