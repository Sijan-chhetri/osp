import { Navigate } from "react-router-dom";
import type { FC, ReactNode } from "react";

interface AdminRouteProps {
    children: ReactNode;
}

const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userRaw);

    if (user.role !== "admin") {
        // Logged in but not admin
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
