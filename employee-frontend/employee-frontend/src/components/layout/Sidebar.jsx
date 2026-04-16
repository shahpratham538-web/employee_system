import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Wallet,
  LogOut,
  Building2,
  UserCircle,
  Network,
  Target,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    label: "My Profile",
    path: "/profile",
    icon: UserCircle,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    label: "Teams",
    path: "/teams",
    icon: Network,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    label: "Employees",
    path: "/employees",
    icon: Users,
    roles: ["ADMIN", "HR"],
  },
  {
    label: "Attendance",
    path: "/attendance",
    icon: Clock,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    label: "Leave",
    path: "/leave",
    icon: CalendarDays,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    label: "Payroll",
    path: "/payroll",
    icon: Wallet,
    roles: ["ADMIN", "HR", "EMPLOYEE"],
  },
  {
    label: "Performance",
    path: "/performance",
    icon: Target,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-68 h-screen bg-sidebar flex flex-col">
      {/* Logo area */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-dark" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-sm tracking-wide">
            Employee System
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Management Portal</p>
        </div>
      </div>

      {/* Profile card */}
      <NavLink
        to="/profile"
        className="mx-3 mt-5 mb-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group flex items-center gap-3"
      >
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/30 shadow-md">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-primary-dark font-bold text-lg">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate group-hover:text-primary transition-colors">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">{user?.role}</p>
        </div>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="text-gray-500 text-label-sm uppercase tracking-wider px-3 mb-4">
          Main Menu
        </p>
        {filteredNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-lg text-body-md transition-all duration-200 group ${
                isActive
                  ? "sidebar-active bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer with Sign Out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-body-md transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
