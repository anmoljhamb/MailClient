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
    }, []);

    // handlers.

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        console.log(password);
    };

    return (
        <>
            <LoginForm
                {...{ handleOnSubmit, email, setEmail, password, setPassword }}
            />
        </>
    );
}

export default App;
