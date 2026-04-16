import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { employeesApi } from "../../api/employeesApi";
import { UserPlus, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({
    user: "",
    employee_id: "",
    department: "",
    designation: "",
    salary: "",
    joining_date: "",
  });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (params = {}) => {
    setLoading(true);
    try {
      const res = await employeesApi.list(params);
      setEmployees(res.data.results || res.data || []);
    } catch (err) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEmployees({ search });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await employeesApi.create({
        ...createData,
        user: parseInt(createData.user),
        department: parseInt(createData.department),
        salary: parseFloat(createData.salary),
      });
      toast.success("Employee created successfully");
      setShowCreate(false);
      setCreateData({
        user: "",
        employee_id: "",
        department: "",
        designation: "",
        salary: "",
        joining_date: "",
      });
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create employee");
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    {
      key: "employee_id",
      label: "Employee ID",
      render: (row) => (
        <span className="font-medium text-primary-dark">{row.employee_id}</span>
      ),
    },
    {
      key: "user",
      label: "Name",
      render: (row) => row.user?.username || row.user || "—",
    },
    {
      key: "department",
      label: "Department",
      render: (row) => row.department?.name || row.department || "—",
    },
    { key: "designation", label: "Designation" },
    {
      key: "salary",
      label: "Salary",
      render: (row) => `₹${parseFloat(row.salary || 0).toLocaleString()}`,
    },
    { key: "joining_date", label: "Joined" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.is_active ? "ACTIVE" : "INACTIVE"} />
      ),
    },
  ];

  return (
    <div>
      <TopBar title="Employees" subtitle="Manage your workforce" />

      <div className="p-8 space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-outline-variant/30
                           text-body-md input-focus-ring transition-all duration-200"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-surface-container rounded-xl text-body-md text-on-surface-variant
                         hover:bg-surface-container-high transition-colors duration-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="btn-gradient px-5 py-2.5 rounded-xl text-body-md flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner message="Loading employees..." />
        ) : (
          <DataTable
            columns={columns}
            data={employees}
            onRowClick={(row) => navigate(`/employees/${row.employee_id}`)}
            emptyMessage="No employees found"
          />
        )}
      </div>

      {/* Create Employee Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add New Employee"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-md font-medium mb-1.5">User ID</label>
              <input
                type="number"
                value={createData.user}
                onChange={(e) =>
                  setCreateData({ ...createData, user: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
                placeholder="User account ID"
              />
            </div>
            <div>
              <label className="block text-body-md font-medium mb-1.5">Employee ID</label>
              <input
                type="text"
                value={createData.employee_id}
                onChange={(e) =>
                  setCreateData({ ...createData, employee_id: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
                placeholder="e.g. EMP001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-md font-medium mb-1.5">Department ID</label>
              <input
                type="number"
                value={createData.department}
                onChange={(e) =>
                  setCreateData({ ...createData, department: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
                placeholder="Department ID"
              />
            </div>
            <div>
              <label className="block text-body-md font-medium mb-1.5">Designation</label>
              <input
                type="text"
                value={createData.designation}
                onChange={(e) =>
                  setCreateData({ ...createData, designation: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-md font-medium mb-1.5">Salary</label>
              <input
                type="number"
                step="0.01"
                value={createData.salary}
                onChange={(e) =>
                  setCreateData({ ...createData, salary: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
                placeholder="Monthly salary"
              />
            </div>
            <div>
              <label className="block text-body-md font-medium mb-1.5">Joining Date</label>
              <input
                type="date"
                value={createData.joining_date}
                onChange={(e) =>
                  setCreateData({ ...createData, joining_date: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none
                           text-body-md input-focus-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/15">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-5 py-2.5 rounded-xl text-body-md text-on-surface-variant
                         hover:bg-surface-container transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn-gradient px-5 py-2.5 rounded-xl text-body-md disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
