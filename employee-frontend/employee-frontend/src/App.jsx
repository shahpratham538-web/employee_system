import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/Employees/EmployeeList";
import EmployeeDetail from "./pages/Employees/EmployeeDetail";
import AttendancePage from "./pages/Attendance/AttendancePage";
import LeavePage from "./pages/Leave/LeavePage";
import PayrollPage from "./pages/Payroll/PayrollPage";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";
import TeamPage from "./pages/Teams/TeamPage";
import PerformancePage from "./pages/Performance/PerformancePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333333",
              color: "#ffffff",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#8BC34A",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#f95630",
                secondary: "#ffffff",
              },
            },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected — wrapped in sidebar layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/teams" element={<TeamPage />} />
            <Route path="/performance" element={<PerformancePage />} />

            <Route
              path="/employees"
              element={
                <ProtectedRoute roles={["ADMIN", "HR"]}>
                  <EmployeeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <ProtectedRoute roles={["ADMIN", "HR", "EMPLOYEE"]}>
                  <EmployeeDetail />
                </ProtectedRoute>
              }
            />

            <Route path="/attendance" element={<AttendancePage />} />

            <Route path="/leave" element={<LeavePage />} />

            <Route
              path="/payroll"
              element={
                <ProtectedRoute roles={["ADMIN", "HR", "EMPLOYEE"]}>
                  <PayrollPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
