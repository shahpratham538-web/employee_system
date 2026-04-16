import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/layout/TopBar";
import StatCard from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { dashboardApi } from "../api/dashboardApi";
import Skeleton from "../components/ui/Skeleton";
import { Users, Clock, CalendarDays, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { user, isAdminOrHR } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayAttendance: 0,
    pendingLeaves: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await dashboardApi.getSummary();
      const data = res.data;
      
      setStats(data.stats);
      setRecentAttendance(data.recentAttendance);
      setRecentLeaves(data.recentLeaves);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  const attendanceCols = [
    { key: "employee", label: "Employee", render: (row) => row.employee_id || row.employee || "—" },
    { key: "date", label: "Date" },
    {
      key: "check_in",
      label: "Check In",
      render: (row) => row.check_in ? new Date(row.check_in).toLocaleTimeString() : "—",
    },
    {
      key: "check_out",
      label: "Check Out",
      render: (row) => row.check_out ? new Date(row.check_out).toLocaleTimeString() : "—",
    },
    {
      key: "working_hours",
      label: "Hours",
      render: (row) => row.working_hours ? `${row.working_hours.toFixed(1)}h` : "—",
    },
    {
      key: "is_late",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.is_late ? "LATE" : "PRESENT"} />
      ),
    },
  ];

  const leaveCols = [
    { key: "employee", label: "Employee", render: (row) => row.employee_id || row.employee || "—" },
    { key: "start_date", label: "Start" },
    { key: "end_date", label: "End" },
    { key: "reason", label: "Reason", render: (row) => (
      <span className="max-w-[200px] truncate block">{row.reason}</span>
    )},
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  if (loading) {
    return (
      <div>
        <TopBar title="Dashboard" subtitle={`Welcome back, ${user?.username}`} />
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back, ${user?.username}`}
      />

      <div className="p-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAdminOrHR && (
            <StatCard
              icon={Users}
              label="Total Employees"
              value={stats.totalEmployees}
              color="primary"
            />
          )}
          <StatCard
            icon={Clock}
            label="Today's Attendance"
            value={stats.todayAttendance}
            trend={isAdminOrHR ? "Present today" : undefined}
            color="tertiary"
          />
          <StatCard
            icon={CalendarDays}
            label="Pending Leaves"
            value={stats.pendingLeaves}
            trend={isAdminOrHR ? "Awaiting review" : undefined}
            color="warning"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Session"
            value="●"
            trend="Connected"
            color="primary"
          />
        </div>

        {/* Dashboard Chart rendering Recent Attendance Working Hours */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
           <div className="mb-4 flex items-center justify-between">
              <h3 className="text-title-sm text-on-surface">Weekly Attendance Trend</h3>
              <span className="text-label-sm text-on-surface-variant">Hours Worked</span>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={recentAttendance.map(a => ({ date: a.date, hours: a.working_hours || 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} contentStyle={{ backgroundColor: '#1E1E1E', borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="hours" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Recent Attendance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-title-sm text-on-surface">Recent Attendance</h3>
            <span className="text-label-sm text-on-surface-variant">Last 5 records</span>
          </div>
          <DataTable
            columns={attendanceCols}
            data={recentAttendance}
            emptyMessage="No attendance records yet"
          />
        </div>

        {/* Recent Leaves */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-title-sm text-on-surface">Recent Leave Requests</h3>
            <span className="text-label-sm text-on-surface-variant">Last 5 requests</span>
          </div>
          <DataTable
            columns={leaveCols}
            data={recentLeaves}
            emptyMessage="No leave requests yet"
          />
        </div>
      </div>
    </div>
  );
}
