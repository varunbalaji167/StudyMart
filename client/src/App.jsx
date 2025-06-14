// App.jsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import { SocketProvider } from "./components/contexts/SocketContext";
import { Toaster } from "react-hot-toast";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import ItemList from "./components/Items/ItemList";
import ItemForm from "./components/Items/ItemForm";
import ItemDetail from "./components/Items/ItemDetail";
import Inbox from "./components/Chats/Inbox";
import HomePage from "./components/HomePage";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="text-center mt-10">Checking auth...</p>;
return user && user.token ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: { fontSize: "14px" },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <PrivateRoute>
                  <Inbox />
                </PrivateRoute>
              }
            />

            {/* Items */}
            <Route
              path="/browse"
              element={
                <PrivateRoute>
                  <ItemList />
                </PrivateRoute>
              }
            />
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <ItemForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/items/:id"
              element={
                <PrivateRoute>
                  <ItemDetail />
                </PrivateRoute>
              }
            />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;