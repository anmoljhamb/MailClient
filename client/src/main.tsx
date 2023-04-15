import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import SocketProvider from "./contexts/Socket";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <>
        <SocketProvider>
            <App />
        </SocketProvider>
    </>
);
