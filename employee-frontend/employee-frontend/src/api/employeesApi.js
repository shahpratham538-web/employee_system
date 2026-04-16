import API from "./axios";

export const employeesApi = {
  list: (params = {}) =>
    API.get("/employees/", { params }),

  getById: (employeeId) =>
    API.get(`/employees/${employeeId}/`),

  create: (data) =>
    API.post("/employees/create/", data),

  update: (employeeId, data) =>
    API.put(`/employees/${employeeId}/`, data),

  deactivate: (employeeId) =>
    API.delete(`/employees/${employeeId}/`),
};
