import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import { employeesApi } from "../../api/employeesApi";
import { ArrowLeft, Edit3, Trash2, Save, X, User, Briefcase, DollarSign, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeesApi.getById(id);
      setEmployee(res.data);
      setEditData(res.data);
    } catch (err) {
      toast.error("Failed to load employee");
      navigate("/employees");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await employeesApi.update(id, {
        designation: editData.designation,
        salary: editData.salary,
        department: editData.department?.id || editData.department,
      });
      toast.success("Employee updated");
      setEditing(false);
      fetchEmployee();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await employeesApi.deactivate(id);
      toast.success("Employee deactivated");
      navigate("/employees");
    } catch (err) {
      toast.error("Failed to deactivate");
    }
  };

  if (loading) {
    return (
      <div>
        <TopBar title="Employee Detail" />
        <div className="p-8"><LoadingSpinner message="Loading profile..." /></div>
      </div>
    );
  }

  if (!employee) return null;

  const infoItems = [
    { icon: User, label: "Username", value: employee.user?.username || employee.user || "—" },
    { icon: Briefcase, label: "Department", value: employee.department?.name || employee.department || "—" },
    { icon: Briefcase, label: "Designation", value: employee.designation },
    { icon: DollarSign, label: "Salary", value: `₹${parseFloat(employee.salary || 0).toLocaleString()}` },
    { icon: Calendar, label: "Joining Date", value: employee.joining_date },
    { icon: Calendar, label: "Leave Balance", value: `${employee.leave_balance} days` },
  ];

  return (
    <div>
      <TopBar title="Employee Profile" subtitle={`Employee ID: ${employee.employee_id}`} />

      <div className="p-8 space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </button>

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-ambient overflow-hidden">
          {/* Header gradient */}
          <div className="h-32 bg-gradient-to-r from-sidebar via-sidebar to-primary-dark/40 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-2xl font-bold text-primary-dark shadow-lg">
                {(employee.user?.username || "U").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pt-14 pb-8 px-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-headline-md text-on-surface">
                  {employee.user?.username || employee.employee_id}
                </h3>
                <p className="text-body-md text-on-surface-variant mt-0.5">
                  {employee.designation} • {employee.employee_id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={employee.is_active ? "ACTIVE" : "INACTIVE"} />
                {!editing ? (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container
                               text-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => setShowDelete(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10
                               text-body-md text-error hover:bg-error/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Deactivate
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl btn-gradient text-body-md disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setEditData(employee); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container
                               text-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {infoItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{item.label}</p>
                    {editing && (item.label === "Designation" || item.label === "Salary") ? (
                      <input
                        type={item.label === "Salary" ? "number" : "text"}
                        value={item.label === "Designation" ? editData.designation : editData.salary}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [item.label === "Designation" ? "designation" : "salary"]: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3 py-1.5 bg-white rounded-lg border border-outline-variant/30
                                   text-body-md input-focus-ring"
                      />
                    ) : (
                      <p className="text-body-md text-on-surface font-medium mt-0.5">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate confirmation */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Deactivation" size="sm">
        <p className="text-body-md text-on-surface-variant mb-6">
          Are you sure you want to deactivate <strong>{employee.employee_id}</strong>?
          This action can be reversed by an administrator.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDelete(false)}
            className="px-5 py-2.5 rounded-xl text-body-md text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeactivate}
            className="px-5 py-2.5 rounded-xl bg-error text-white text-body-md hover:bg-error/90 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </Modal>
    </div>
  );
}
