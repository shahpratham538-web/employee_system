import API from "./axios";

export const leaveApi = {
  apply: (data) =>
    API.post("/leave/apply/", data),

  list: () =>
    API.get("/leave/"),

  approve: (leaveId) =>
    API.put(`/leave/${leaveId}/approve/`),

  reject: (leaveId) =>
    API.put(`/leave/${leaveId}/reject/`),
};
