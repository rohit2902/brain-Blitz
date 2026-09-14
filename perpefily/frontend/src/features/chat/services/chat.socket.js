import { io } from "socket.io-client";


export const initializeSocketConnection = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const socket = io(backendUrl || undefined, {
        withCredentials: true,
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO server")
    })

}