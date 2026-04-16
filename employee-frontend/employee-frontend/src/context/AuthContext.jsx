import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await authApi.login(username, password);

    // The backend returns: { access, refresh, user: { id, username, role, profile_picture, ... } }
    const { access, refresh, user: userPayload } = res.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    // Build the user data from the nested 'user' object in the response
    const userData = {
      id: userPayload?.id || res.data.user_id,
      username: userPayload?.username || username,
      email: userPayload?.email || "",
      first_name: userPayload?.first_name || "",
      last_name: userPayload?.last_name || "",
      role: userPayload?.role || res.data.role || "EMPLOYEE",
      phone: userPayload?.phone || "",
      bio: userPayload?.bio || "",
      profile_picture: userPayload?.profile_picture || null,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const updateUser = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = user?.role === "ADMIN";
  const isHR = user?.role === "HR";
  const isManager = user?.role === "MANAGER";
  const isEmployee = user?.role === "EMPLOYEE";
  const isAdminOrHR = isAdmin || isHR;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAdmin,
        isHR,
        isManager,
        isEmployee,
        isAdminOrHR,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
