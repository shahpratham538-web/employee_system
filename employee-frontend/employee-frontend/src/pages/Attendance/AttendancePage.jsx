import { useState, useEffect } from "react";
import TopBar from "../../components/layout/TopBar";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { attendanceApi } from "../../api/attendanceApi";
import { useAuth } from "../../context/AuthContext";
import { LogIn, LogOut, BarChart3, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceApi.list();
      setRecords(res.data.results || res.data || []);
    } catch (err) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await attendanceApi.checkIn();
      toast.success("Checked in successfully!");
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.error || "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    try {
      await attendanceApi.checkOut();
      toast.success("Checked out successfully!");
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.error || "Check-out failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const fetchReport = async () => {
    setLoadingReport(true);
    try {
      const res = await attendanceApi.report(reportMonth, reportYear);
      setReport(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load report");
    } finally {
      setLoadingReport(false);
    }
  };

  const columns = [
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
      render: (row) => <StatusBadge status={row.is_late ? "LATE" : "PRESENT"} />,
    },
  ];

  return (
    <div>
      <TopBar title="Attendance" subtitle="Track daily check-in and check-out" />

      <div className="p-8 space-y-6">
        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Check In */}
          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="bg-white rounded-xl p-6 shadow-ambient hover:shadow-ambient-lg transition-all duration-300
                       text-left group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4
                          group-hover:bg-primary/25 transition-colors">
              <LogIn className="w-6 h-6 text-primary-dark" />
            </div>
            <h4 className="text-title-sm text-on-surface">Check In</h4>
            <p className="text-label-sm text-on-surface-variant mt-1">
              {checkingIn ? "Checking in..." : "Start your workday"}
            </p>
          </button>

          {/* Check Out */}
          <button
            onClick={handleCheckOut}
            disabled={checkingOut}
            className="bg-white rounded-xl p-6 shadow-ambient hover:shadow-ambient-lg transition-all duration-300
                       text-left group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-tertiary/15 flex items-center justify-center mb-4
                          group-hover:bg-tertiary/25 transition-colors">
              <LogOut className="w-6 h-6 text-tertiary" />
            </div>
            <h4 className="text-title-sm text-on-surface">Check Out</h4>
            <p className="text-label-sm text-on-surface-variant mt-1">
              {checkingOut ? "Checking out..." : "End your workday"}
            </p>
          </button>

          {/* Monthly Report */}
          <button
            onClick={() => setShowReport(!showReport)}
            className="bg-white rounded-xl p-6 shadow-ambient hover:shadow-ambient-lg transition-all duration-300
                       text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-warning/15 flex items-center justify-center mb-4
                          group-hover:bg-warning/25 transition-colors">
              <BarChart3 className="w-6 h-6 text-warning-dark" />
            </div>
            <h4 className="text-title-sm text-on-surface">Monthly Report</h4>
            <p className="text-label-sm text-on-surface-variant mt-1">View attendance summary</p>
          </button>
        </div>

        {/* Report section */}
        {showReport && (
          <div className="bg-white rounded-xl p-6 shadow-ambient animate-slide-up space-y-4">
            <h4 className="text-title-sm text-on-surface">Generate Report</h4>
            <div className="flex items-end gap-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Month</label>
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(parseInt(e.target.value))}
                  className="px-4 py-2.5 bg-surface-container-low rounded-xl border-none text-body-md input-focus-ring"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Year</label>
                <select
                  value={reportYear}
                  onChange={(e) => setReportYear(parseInt(e.target.value))}
                  className="px-4 py-2.5 bg-surface-container-low rounded-xl border-none text-body-md input-focus-ring"
                >
                  {[2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchReport}
                disabled={loadingReport}
                className="btn-gradient px-5 py-2.5 rounded-xl text-body-md disabled:opacity-50"
              >
                {loadingReport ? "Loading..." : "Generate"}
              </button>
            </div>

            {report && (
              <div className="mt-4 p-4 bg-surface-container-low rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(report).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-label-sm text-on-surface-variant capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-title-sm text-on-surface mt-0.5">
                        {typeof val === "number" ? val.toFixed?.(1) || val : String(val)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Records table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-title-sm text-on-surface flex items-center gap-2">
              <Clock className="w-4 h-4 text-on-surface-variant" />
              Attendance Records
            </h3>
            <span className="text-label-sm text-on-surface-variant">
              {records.length} records
            </span>
          </div>
          {loading ? (
            <LoadingSpinner message="Loading records..." />
          ) : (
            <DataTable
              columns={columns}
              data={records}
              emptyMessage="No attendance records found"
            />
          )}
        </div>
      </div>
    </div>
  );
}
