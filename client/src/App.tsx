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

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("verified", ({ verified }) => {
            console.log(verified);
        });

        return () => {
            socket.off("verified");
        };
    }, []);

    // handlers.

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(socket);
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
