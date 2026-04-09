import api from './axios'

export const uploadResume    = (formData)   => api.post('/resumes/upload/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const getResumes      = ()           => api.get('/resumes/')
export const getResumeStatus = (id)         => api.get(`/resumes/${id}/status/`)
export const deleteResume    = (id)         => api.delete(`/resumes/${id}/`)
export const getAnalysis     = (id)         => api.get(`/resumes/${id}/analysis/`)
export const regenerate      = (id)         => api.post(`/resumes/${id}/analysis/regenerate/`)
export const generateCoverLetter = (id, data) => api.post(`/resumes/${id}/cover-letter/`, data)
export const getCoverLetterStatus = (id)    => api.get(`/resumes/${id}/cover-letter/status/`)
export const generateInterview   = (id)     => api.post(`/resumes/${id}/interview/`)
export const getInterviewStatus  = (id)     => api.get(`/resumes/${id}/interview/status/`)