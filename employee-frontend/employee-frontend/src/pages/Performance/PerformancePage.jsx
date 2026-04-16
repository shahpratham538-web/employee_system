import { useState, useEffect } from "react";
import TopBar from "../../components/layout/TopBar";
import { performanceApi } from "../../api/performanceApi";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Target, TrendingUp, Award, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";

export default function PerformancePage() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState({
    title: "",
    description: "",
    quarter: "Q1",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchObjectives();
  }, []);

  const fetchObjectives = async () => {
    setLoading(true);
    try {
      const res = await performanceApi.getObjectives();
      setObjectives(res.data.results || res.data || []);
    } catch (err) {
      toast.error("Failed to load OKRs.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await performanceApi.createObjective(createData);
      toast.success("OKR created successfully");
      setShowCreate(false);
      setCreateData({ title: "", description: "", quarter: "Q1", year: new Date().getFullYear() });
      fetchObjectives();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.detail[0] || "Failed to create OKR");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <TopBar title="Performance & OKRs" subtitle="Track your quarterly objectives and reviews" />

      <div className="p-8 space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-body-md text-on-surface-variant">Active Objectives</p>
              <h3 className="text-headline-md font-semibold">{objectives.length}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-body-md text-on-surface-variant">Avg. Progress</p>
              <h3 className="text-headline-md font-semibold">
                {objectives.length > 0 
                  ? Math.round(objectives.reduce((acc, obj) => acc + obj.progress, 0) / objectives.length) 
                  : 0}%
              </h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-body-md text-on-surface-variant">Latest Review</p>
              <h3 className="text-headline-md font-semibold">Pending</h3>
            </div>
          </div>
        </div>

        {/* OKRs Section */}
        <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/15 flex justify-between items-center">
            <h3 className="text-title-lg font-semibold text-on-surface">Quarterly Objectives</h3>
            <button 
              onClick={() => setShowCreate(true)}
              className="btn-gradient px-4 py-2 rounded-xl text-body-md shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New OKR
            </button>
          </div>
          
          <div className="p-8">
            {loading ? (
              <LoadingSpinner message="Loading OKRs..." />
            ) : objectives.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-outline mx-auto mb-4" />
                <h4 className="text-title-md font-medium text-on-surface mb-2">No Objectives Yet</h4>
                <p className="text-body-md text-on-surface-variant">Set your first quarterly objective to start tracking your performance.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {objectives.map(obj => (
                  <div key={obj.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-title-md font-medium text-on-surface mb-1">{obj.title}</h4>
                        <p className="text-body-sm text-on-surface-variant">{obj.description || "No description provided."}</p>
                      </div>
                      <span className="px-3 py-1 bg-surface-container rounded-lg text-label-sm font-medium">
                        {obj.quarter} {obj.year}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-label-sm font-medium text-on-surface-variant">Progress</span>
                        <span className="text-label-sm font-bold text-primary">{obj.progress}%</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary-container h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${obj.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create OKR Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add New Objective"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-body-md font-medium mb-1.5">Title</label>
            <input
              type="text"
              value={createData.title}
              onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none text-body-md input-focus-ring"
              placeholder="e.g. Reduce bundle size by 20%"
            />
          </div>
          <div>
            <label className="block text-body-md font-medium mb-1.5">Description (Optional)</label>
            <textarea
              value={createData.description}
              onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none text-body-md input-focus-ring min-h-[100px]"
              placeholder="Detail your plan..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-md font-medium mb-1.5">Quarter</label>
              <select
                value={createData.quarter}
                onChange={(e) => setCreateData({ ...createData, quarter: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none text-body-md input-focus-ring appearance-none"
              >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
            <div>
              <label className="block text-body-md font-medium mb-1.5">Year</label>
              <input
                type="number"
                value={createData.year}
                onChange={(e) => setCreateData({ ...createData, year: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border-none text-body-md input-focus-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/15">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-5 py-2.5 rounded-xl text-body-md text-on-surface-variant hover:bg-surface-container transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn-gradient px-5 py-2.5 rounded-xl text-body-md disabled:opacity-50"
            >
              {creating ? "Creating..." : "Save Objective"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
