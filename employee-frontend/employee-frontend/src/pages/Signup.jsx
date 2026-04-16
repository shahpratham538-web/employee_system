import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { ArrowRight, Lock, Mail, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register({ username, email, password });
      toast.success("Account created successfully! Please login.", { icon: "🎉" });
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object" && !data.detail) {
        // DRF returns field-level errors like { username: ["This field already exists."] }
        const firstError = Object.values(data).flat()[0];
        toast.error(firstError || "Signup failed.");
      } else {
        toast.error(data?.detail || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-surface font-sans">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 bg-surface">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Context */}
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="grid grid-cols-3 gap-0.5 w-4 h-4 text-primary transition-transform group-hover:scale-110">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-current rounded-sm opacity-80" />
              ))}
            </div>
            <span className="text-xl font-bold tracking-tight text-sidebar">ev</span>
          </Link>

          {/* Heading */}
          <h1 className="text-display-sm font-bold text-sidebar mb-3 tracking-tight">Create Account</h1>
          <p className="text-on-surface-variant text-body-md mb-10">
            Join the Kinetic Enterprise to access operational data.
          </p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-label-md font-semibold text-sidebar ml-1">Username</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-4 w-5 h-5 text-outline-variant" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sidebar placeholder:text-on-surface-variant/50 shadow-sm"
                  placeholder="Enter a username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-label-md font-semibold text-sidebar ml-1">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-outline-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sidebar placeholder:text-on-surface-variant/50 shadow-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-label-md font-semibold text-sidebar ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-outline-variant" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sidebar placeholder:text-on-surface-variant/50 shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-sidebar hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl mt-4"
            >
              {loading ? "Creating account..." : "Sign Up"}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-sidebar relative overflow-hidden text-surface items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-sidebar to-sidebar"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://lh3.googleusercontent.com/aida/ADBb0uh9IeI3gvqSGldG339F7UL2TUCzN0S9MafAt-JZc5Txln6BKxp1RI0u0clyJKndQUGUJ39KVgc30WCmxFNMESFdUt7mYQhEKzO_4v-BvMGWSVptSskTkhBYS1OV3QKXsykp_jgRbpmIw0oIR7rVED3dCmENKN5wXYYXz3OKG6oYgnXOEnMAldGn1xVSOM_QRh8Q13XUA2WWGd04jGR2fCV6nD09WPiOtjIiK1OsUWz2r9L6thcfhubBD5s')] bg-cover opacity-10 blur-[2px] mix-blend-screen" />
        
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 border border-primary/30">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-display-sm font-bold mb-6 leading-tight">
            Secure.<br/>Scalable.<br/>Kinetic.
          </h2>
          <p className="text-surface-variant/80 text-lg leading-relaxed mb-10">
            By registering, you gain access to the military-grade encryption and automated archival protocols that form our core enterprise engine.
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-sidebar flex items-center justify-center text-xs font-bold text-on-surface-variant">ev</div>
              <div className="w-10 h-10 rounded-full border-2 border-sidebar border-dashed flex items-center justify-center bg-transparent backdrop-blur-md">
                <span className="text-xs font-bold">+</span>
              </div>
            </div>
            <span className="text-sm font-medium text-surface-variant/80 tracking-wide uppercase">Join 200+ Enterprises</span>
          </div>
        </div>
      </div>
    </div>
  );
}
