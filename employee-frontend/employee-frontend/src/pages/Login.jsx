import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden items-center justify-center">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-primary-dark/40" />

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 px-16 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
            <Building2 className="w-8 h-8 text-primary-dark" />
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Employee
            <br />
            Management
            <br />
            <span className="text-primary">System</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            A unified platform for managing your workforce — attendance,
            leaves, payroll, and more — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {["Attendance", "Leave", "Payroll", "Reports"].map((f) => (
              <span
                key={f}
                className="px-4 py-1.5 rounded-full bg-white/5 text-gray-300 text-sm border border-white/10"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-container-low">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-dark" />
            </div>
            <span className="text-xl font-semibold text-on-surface">
              Employee System
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-headline-md text-on-surface">Welcome back</h2>
            <p className="text-body-md text-on-surface-variant mt-1">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-username"
                className="block text-body-md text-on-surface font-medium mb-2"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white rounded-xl border border-outline-variant/30
                           text-body-md text-on-surface placeholder-outline
                           input-focus-ring transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-body-md text-on-surface font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 bg-white rounded-xl border border-outline-variant/30
                             text-body-md text-on-surface placeholder-outline
                             input-focus-ring transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-gradient rounded-xl text-body-md font-semibold
                         flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-label-sm text-on-surface-variant mt-8">
            Contact your administrator if you need access
          </p>
        </div>
      </div>
    </div>
  );
}
