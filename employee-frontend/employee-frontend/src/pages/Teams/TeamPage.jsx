import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { teamsApi } from "../../api/teamsApi";
import TopBar from "../../components/layout/TopBar";
import Modal from "../../components/ui/Modal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Plus, Users, Shield, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function TeamPage() {
  const { user, isAdmin, isHR, isManager } = useAuth();
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader: "",
    members: [],
    tasks: ""
  });

  const canManageTeams = true; // Always true to skip localStorage role delay or permission issues as requested

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, usersRes] = await Promise.all([
        teamsApi.getAll(),
        canManageTeams ? teamsApi.getAllUsers() : { data: [] }
      ]);
      // DRF returns paginated responses inside a 'results' array
      setTeams(teamsRes.data.results || teamsRes.data || []);
      if (canManageTeams) {
        setAllUsers(usersRes.data.results || usersRes.data || []);
      }
    } catch (error) {
      toast.error("Failed to load teams data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (mode = "create", team = null) => {
    setModalMode(mode);
    if (mode === "edit" && team) {
      setSelectedTeam(team);
      setFormData({
        name: team.name,
        description: team.description,
        leader: team.leader || "",
        members: team.members || [],
        tasks: team.tasks || ""
      });
    } else {
      setSelectedTeam(null);
      setFormData({ name: "", description: "", leader: user?.id || "", members: [], tasks: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await teamsApi.create(formData);
        toast.success("Team created successfully!");
      } else if (modalMode === "edit" && selectedTeam) {
        await teamsApi.update(selectedTeam.id, formData);
        toast.success("Team updated successfully!");
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await teamsApi.delete(id);
      toast.success("Team deleted.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete team.");
    }
  };

  if (loading) {
    return (
      <div>
        <TopBar title="Teams" />
        <div className="p-8">
          <LoadingSpinner message="Loading teams..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar 
        title="Teams" 
        subtitle="Manage and view organizational teams" 
        action={
          canManageTeams && (
            <button
              onClick={() => handleOpenModal("create")}
              className="btn-gradient px-4 py-2 rounded-xl text-body-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Team
            </button>
          )
        }
      />

      <div className="p-8">
        {teams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-ambient">
            <Users className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <h3 className="text-headline-sm text-on-surface">No Teams Found</h3>
            <p className="text-body-md text-on-surface-variant mt-2">
              {canManageTeams ? "Get started by creating your first team." : "You have not been assigned to any teams yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-2xl shadow-ambient overflow-hidden flex flex-col">
                <div className="p-6 border-b border-outline-variant/15 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-headline-sm text-on-surface">{team.name}</h3>
                    {canManageTeams && (
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenModal("edit", team)} className="text-primary-dark hover:bg-primary/10 p-2 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(team.id)} className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-body-md text-on-surface-variant mb-6 line-clamp-2">
                    {team.description || "No description provided."}
                  </p>
                  
                  {/* Tasks Preview */}
                  {team.tasks && (
                    <div className="mb-6 p-3 bg-primary/5 rounded-xl border border-primary/20">
                      <p className="text-label-sm text-primary-dark font-medium mb-1">Assigned Tasks / Goals</p>
                      <p className="text-body-md text-on-surface line-clamp-3 whitespace-pre-wrap">{team.tasks}</p>
                    </div>
                  )}

                  {/* Leader Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center border border-primary/30">
                      {team.leader_details?.profile_picture_url ? (
                        <img src={team.leader_details.profile_picture_url} alt="leader" className="w-full h-full rounded-full object-cover" />
                      ) : (
                         <Shield className="w-4 h-4 text-primary-dark" />
                      )}
                    </div>
                    <div>
                      <p className="text-label-sm text-on-surface-variant">Team Leader</p>
                      <p className="text-body-md font-medium text-on-surface">
                        {team.leader_details?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Members preview */}
                <div className="bg-surface-container-low p-4 px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {team.members_details?.slice(0, 5).map((member, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden" title={member.name}>
                           {member.profile_picture_url ? (
                            <img src={member.profile_picture_url} alt={member.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-600">
                               {member.name.charAt(0).toUpperCase()}
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                    {team.members_details?.length > 5 && (
                      <span className="text-label-sm text-on-surface-variant ml-2">
                        +{team.members_details.length - 5} more
                      </span>
                    )}
                    {team.members_details?.length === 0 && (
                      <span className="text-label-sm text-on-surface-variant">No members yet</span>
                    )}
                  </div>
                  <span className="text-label-sm font-medium bg-primary-container text-primary-dark px-3 py-1 rounded-full">
                    {team.members_details?.length || 0} Members
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalMode === "create" ? "Create New Team" : "Edit Team"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-label-sm text-on-surface-variant font-medium text-left block">Team Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-outline-variant/30 text-body-md"
              placeholder="e.g. Engineering, Ops"
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-sm text-on-surface-variant font-medium text-left block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-outline-variant/30 text-body-md resize-none"
              rows={3}
              placeholder="What does this team do?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-sm text-on-surface-variant font-medium text-left block">Team Tasks / Goals</label>
            <textarea
              value={formData.tasks}
              onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-outline-variant/30 text-body-md resize-none"
              rows={3}
              placeholder="List specific tasks or goals here..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-sm text-on-surface-variant font-medium text-left block">Team Leader</label>
            <select
              value={formData.leader}
              onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-outline-variant/30 text-body-md"
            >
              <option value="">Select a Leader</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.username})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-label-sm text-on-surface-variant font-medium text-left block">Members</label>
            <div className="max-h-48 overflow-y-auto bg-surface-container-low rounded-xl border border-outline-variant/30 p-2 space-y-1">
               {allUsers.map(u => (
                 <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer">
                   <input 
                     type="checkbox"
                     checked={formData.members.includes(u.id)}
                     onChange={(e) => {
                       const m = e.target.checked 
                        ? [...formData.members, u.id] 
                        : formData.members.filter(id => id !== u.id);
                       setFormData({ ...formData, members: m });
                     }}
                     className="w-4 h-4 text-primary rounded focus:ring-primary"
                   />
                   <span className="text-body-md">{u.first_name} {u.last_name} (@{u.username}) - {u.role}</span>
                 </label>
               ))}
               {allUsers.length === 0 && <p className="text-body-sm text-gray-500 p-2">No users available.</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/20 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2.5 rounded-xl text-body-md text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl btn-gradient text-white text-body-md"
            >
              {modalMode === "create" ? "Create Team" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
