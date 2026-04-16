import API from "./axios";

export const authApi = {
  login: (username, password) =>
    API.post("/token/", { username, password }),

  register: (data) => API.post("/auth/register/", data),

  refresh: (refresh) =>
    API.post("/token/refresh/", { refresh }),

  // Profile endpoints
  getProfile: () =>
    API.get("/auth/profile/"),

  updateProfile: (data) =>
    API.patch("/auth/profile/", data),

  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    return API.post("/auth/profile/picture/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  removeProfilePicture: () =>
    API.delete("/auth/profile/picture/"),
};
