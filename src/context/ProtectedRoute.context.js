import React, { useContext } from "react";
import NotAdmin from "../pages/NotFound/NotAdmin";
import { AuthContext } from "./auth.context";
import Login from "../pages/Login";

export function ProtectedRoute({ Component, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    window.location.href = '/';
  }
  else
    if (role === "ADMIN") {
      // 1 user thường 
      // 2 user hint 
      // 3 admin 
      if (user.role_id === 3 || user.role_id === 4 || user.role_id === 5) {
        return <Component />;
      } else return <NotAdmin />;
    } else return <Component />;
}
