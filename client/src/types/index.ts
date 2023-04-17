import { useRef } from "react";
import { useSocket } from "../hooks";

export type SocketInterface = ReturnType<typeof useSocket>;
export type FileRefInterface = React.MutableRefObject<HTMLInputElement>;

export interface SocketContextInterface {
    socket: SocketInterface;
    connected: boolean;
    socketRef: ReturnType<typeof useRef<SocketInterface>>;
}
