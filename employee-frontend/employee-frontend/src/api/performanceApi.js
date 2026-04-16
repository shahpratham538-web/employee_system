import API from "./axios";

export const performanceApi = {
  getObjectives: () => API.get("/performance/objectives/"),
  createObjective: (data) => API.post("/performance/objectives/", data),
  updateObjective: (id, data) => API.patch(`/performance/objectives/${id}/`, data),
  getReviews: () => API.get("/performance/reviews/"),
  createReview: (data) => API.post("/performance/reviews/", data),
};
