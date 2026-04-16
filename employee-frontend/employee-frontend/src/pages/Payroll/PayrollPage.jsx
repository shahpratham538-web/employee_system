import { useState } from "react";
import TopBar from "../../components/layout/TopBar";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { payrollApi } from "../../api/payrollApi";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function PayrollPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPayroll = async () => {
    if (!employeeId) {
      toast.error("Please enter an employee ID");
      return;
    }
    setLoading(true);
    try {
      const res = await payrollApi.getSalary(employeeId, month, year);
      setPayroll(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to generate payroll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar title="Payroll" subtitle="Generate and view salary breakdowns" />

      <div className="p-8 space-y-6">
        {/* Query section */}
        <div className="bg-white rounded-xl p-6 shadow-ambient">
          <h4 className="text-title-sm text-on-surface mb-4">Generate Payslip</h4>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">
                Employee ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter employee ID"
                className="px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring w-48"
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
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
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-4 py-2.5 bg-surface-container-low rounded-xl border-none text-body-md input-focus-ring"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={fetchPayroll}
              disabled={loading}
              className="btn-gradient px-6 py-2.5 rounded-xl text-body-md disabled:opacity-50
                         flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner message="Generating payslip..." />}

        {/* Payslip */}
        {payroll && !loading && (
          <div className="bg-white rounded-2xl shadow-ambient overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-sidebar to-primary-dark/60 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Payslip</p>
                  <h3 className="text-2xl font-bold">
                    {new Date(2000, month - 1).toLocaleString("default", { month: "long" })} {year}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">Employee</p>
                  <p className="text-lg font-semibold">{payroll.employee_id || employeeId}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Earnings */}
                <div>
                  <h4 className="text-title-sm text-on-surface flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-primary-dark" />
                    Earnings
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(payroll)
                      .filter(([key]) =>
                        !["deductions", "net_salary", "employee_id", "employee_name", "month", "year", "total_deductions"].includes(key) &&
                        !key.toLowerCase().includes("deduct") &&
                        !key.toLowerCase().includes("tax") &&
                        !key.toLowerCase().includes("absent")
                      )
                      .map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                          <span className="text-body-md text-on-surface-variant capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-body-md text-on-surface font-medium">
                            {typeof val === "number" ? `₹${val.toLocaleString()}` : String(val)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="text-title-sm text-on-surface flex items-center gap-2 mb-4">
                    <TrendingDown className="w-4 h-4 text-error" />
                    Deductions
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(payroll)
                      .filter(([key]) =>
                        key.toLowerCase().includes("deduct") ||
                        key.toLowerCase().includes("tax") ||
                        key.toLowerCase().includes("absent")
                      )
                      .map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                          <span className="text-body-md text-on-surface-variant capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-body-md text-error font-medium">
                            {typeof val === "number" ? `- ₹${val.toLocaleString()}` : String(val)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              {payroll.net_salary !== undefined && (
                <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary-container/20 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-headline-md text-on-surface">Net Salary</span>
                    <span className="text-display-lg text-primary-dark">
                      ₹{parseFloat(payroll.net_salary).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
