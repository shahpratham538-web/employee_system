import API from "./axios";

export const dashboardApi = {
  getSummary: () => API.get("/dashboard/summary/"),
};
