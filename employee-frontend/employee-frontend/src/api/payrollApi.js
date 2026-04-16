import API from "./axios";

export const payrollApi = {
  getSalary: (employeeId, month, year) =>
    API.get(`/payroll/${employeeId}/`, { params: { month, year } }),
};
