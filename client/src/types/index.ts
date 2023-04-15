import { useSocket } from "../hooks";

export type SocketInterface = ReturnType<typeof useSocket>;
export interface SocketContextInterface {
    socket: SocketInterface;
}
