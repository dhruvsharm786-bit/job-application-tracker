const API = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  applications: () => request('/applications'),
  application: id => request(`/applications/${id}`),
  createApplication: data => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplication: (id, data) => request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteApplication: id => request(`/applications/${id}`, { method: 'DELETE' }),
  dashboard: () => request('/dashboard'),
  addInterview: (id, data) => request(`/applications/${id}/interviews`, { method: 'POST', body: JSON.stringify(data) }),
  deleteInterview: id => request(`/interviews/${id}`, { method: 'DELETE' }),
  followups: () => request('/followups'),
  addFollowup: (id, data) => request(`/applications/${id}/followups`, { method: 'POST', body: JSON.stringify(data) }),
  completeFollowup: id => request(`/followups/${id}/complete`, { method: 'PATCH' }),
  deleteFollowup: id => request(`/followups/${id}`, { method: 'DELETE' })
}
