import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function TopBar({ title, subtitle, action }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() !== "") {
        toast.success(`Searching for: ${searchQuery}`);
        navigate("/employees");
        setSearchQuery("");
      } else {
        toast.error("Please enter a search term.");
      }
    }
  };

  const handleNotificationClick = () => {
    toast("You have no new notifications right now.", {
      icon: '🔔',
      position: 'top-right'
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-glass border-b border-outline-variant/15">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h2 className="text-headline-md text-on-surface">{title}</h2>
          {subtitle && (
            <p className="text-body-md text-on-surface-variant mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-56 pl-10 pr-4 py-2 bg-surface-container-low rounded-lg text-body-md
                         border-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <button 
             onClick={handleNotificationClick}
             className="relative p-2.5 rounded-lg hover:bg-surface-container transition-colors duration-200"
          >
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Role badge */}
          <span className="px-3 py-1 bg-primary-container/60 text-primary-dark rounded-full text-label-sm font-medium">
            {user?.role}
          </span>

          {action && <div className="pl-4 border-l border-outline-variant/20">{action}</div>}
        </div>
      </div>
    </header>
  );
}
