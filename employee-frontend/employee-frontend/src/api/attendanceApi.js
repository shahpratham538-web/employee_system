import API from "./axios";

export const attendanceApi = {
  checkIn: () =>
    API.post("/attendance/check-in/"),

  checkOut: () =>
    API.post("/attendance/check-out/"),

  list: () =>
    API.get("/attendance/"),

  report: (month, year) =>
    API.get("/attendance/report/", { params: { month, year } }),
};
