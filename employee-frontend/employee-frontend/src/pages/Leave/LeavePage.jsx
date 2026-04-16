import { useState, useEffect } from "react";
import TopBar from "../../components/layout/TopBar";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { leaveApi } from "../../api/leaveApi";
import { useAuth } from "../../context/AuthContext";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function LeavePage() {
  const { isAdminOrHR } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [applyData, setApplyData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveApi.list();
      setLeaves(res.data.results || res.data || []);
    } catch (err) {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await leaveApi.apply(applyData);
      toast.success("Leave applied successfully!");
      setShowApply(false);
      setApplyData({ start_date: "", end_date: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply leave");
    } finally {
      setApplying(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await leaveApi.approve(leaveId);
      toast.success("Leave approved");
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve");
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await leaveApi.reject(leaveId);
      toast.success("Leave rejected");
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reject");
    }
  };

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (row) => row.employee_id || row.employee || "—",
    },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    {
      key: "reason",
      label: "Reason",
      render: (row) => (
        <span className="max-w-[250px] truncate block">{row.reason}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "applied_at",
      label: "Applied",
      render: (row) => row.applied_at
        ? new Date(row.applied_at).toLocaleDateString()
        : "—",
    },
    ...(isAdminOrHR
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (row) =>
              row.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(row.id);
                    }}
                    className="p-2 rounded-lg bg-primary/10 text-primary-dark hover:bg-primary/20 transition-colors"
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(row.id);
                    }}
                    className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-label-sm text-on-surface-variant">—</span>
              ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <TopBar title="Leave Management" subtitle="Apply and manage leave requests" />

      <div className="p-8 space-y-6">
        {/* Header action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 rounded-full bg-warning-light text-warning-dark text-label-sm font-medium">
              {leaves.filter((l) => l.status === "PENDING").length} Pending
            </span>
            <span className="px-4 py-1.5 rounded-full bg-primary-container text-primary-dark text-label-sm font-medium">
              {leaves.filter((l) => l.status === "APPROVED").length} Approved
            </span>
          </div>
          <button
            onClick={() => setShowApply(true)}
            className="btn-gradient px-5 py-2.5 rounded-xl text-body-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Apply Leave
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner message="Loading leave requests..." />
        ) : (
          <DataTable
            columns={columns}
            data={leaves}
            emptyMessage="No leave requests found"
          />
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal isOpen={showApply} onClose={() => setShowApply(false)} title="Apply for Leave" size="md">
        <form onSubmit={handleApply} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-md font-medium mb-1.5">Start Date</label>
              <input
                type="date"
                value={applyData.start_date}
                onChange={(e) => setApplyData({ ...applyData, start_date: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
              />
            </div>
            <div>
              <label className="block text-body-md font-medium mb-1.5">End Date</label>
              <input
                type="date"
                value={applyData.end_date}
                onChange={(e) => setApplyData({ ...applyData, end_date: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-md font-medium mb-1.5">Reason</label>
            <textarea
              rows={4}
              value={applyData.reason}
              onChange={(e) => setApplyData({ ...applyData, reason: e.target.value })}
              required
              placeholder="Describe the reason for leave..."
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none
                         text-body-md input-focus-ring resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/15">
            <button
              type="button"
              onClick={() => setShowApply(false)}
              className="px-5 py-2.5 rounded-xl text-body-md text-on-surface-variant
                         hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applying}
              className="btn-gradient px-5 py-2.5 rounded-xl text-body-md disabled:opacity-50"
            >
              {applying ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
