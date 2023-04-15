import { Dashboard, LoginForm } from "./components";
import { FormEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/Socket";
import { SocketContextInterface, SocketInterface } from "./types";

function App() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const { connected, socketRef } = useContext(
        SocketContext
    ) as SocketContextInterface;

    const socket = socketRef.current as SocketInterface;

    useEffect(() => {
        socket.on("verified", ({ verified }) => {
            setLoggedIn(verified as boolean);
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
    };

    if (!loggedIn)
        return (
            <>
                <LoginForm
                    {...{
                        handleOnSubmit,
                        email,
                        setEmail,
                        password,
                        setPassword,
                    }}
                />
                {connected ? "connected" : "not connected"}
            </>
        );
    return (
        <>
            <Dashboard />
        </>
    );
}

export default App;
