import { LoginForm } from "./components";
import { useContext, useEffect } from "react";
import { SocketContext } from "./contexts/Socket";
import { SocketContextInterface } from "./types";

function App() {
    const { socket, connected } = useContext(
        SocketContext
    ) as SocketContextInterface;

    useEffect(() => {
        socket.connect();
    }, []);

    return (
        <>
            <LoginForm />
        </>
    );
}

export default App;
