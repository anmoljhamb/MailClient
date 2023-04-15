import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./index.scss";
import SocketProvider from "./contexts/Socket";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <>
        <SocketProvider>
            <App />
        </SocketProvider>
    </>
);
