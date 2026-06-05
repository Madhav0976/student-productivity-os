import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const status = useAuthStore((state) => state.status);
  const validateSession = useAuthStore((state) => state.validateSession);
  const location = useLocation();

  useEffect(() => {
    if (token && status === "idle") {
      void validateSession();
    }
  }, [status, token, validateSession]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (status === "idle" || status === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-mist text-sm font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        Verifying session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
