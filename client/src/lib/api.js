const api = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
};
export const getHealth = () => api("/health");
export const getModels = () => api("/models");
export const calculate = body => api("/calculate", { method: "POST", body: JSON.stringify(body) });
export const getHistory = () => api("/history");
export const deleteHistory = () => api("/history", { method: "DELETE" });
export const simulate = body => api("/simulator", { method: "POST", body: JSON.stringify(body) });
