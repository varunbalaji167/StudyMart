// contexts/SocketContext.jsx
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [_, forceUpdate] = useState(0); 

  useEffect(() => {
    if (!user?.token) return;

    const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
      auth: { token: user.token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socketRef.current = socket;
      forceUpdate((x) => x + 1); 
    });

    socket.on("disconnect", () => {
      console.warn("❌ Socket disconnected");
    });

    return () => {
      console.log("🧹 Disconnecting socket...");
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);