import { LoginForm } from "./components";
import { FormEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { SocketContextInterface } from "./types";

function App() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { socket, connected } = useContext(
        SocketContext
    ) as SocketContextInterface;

    useEffect(() => {
        socket.connect();
    }, [connected]);

    useEffect(() => {
        socket.on("verify", (...args) => {
            console.log(args);
        });

        return () => {
            socket.off("verify");
        };
    }, []);

    // handlers.

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("verify", { email, password });

        console.log("socket emitting.");
    };

    return (
        <>
            <LoginForm
                {...{ handleOnSubmit, email, setEmail, password, setPassword }}
            />
            {connected ? "connected" : "not connected"}
        </>
    );
}

export default App;
