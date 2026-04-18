// cypress/support/e2e.js
// Global hooks and custom commands

// Custom command: login programmatically (faster than UI login in each test)
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl') || 'http://localhost:8000'}/api/auth/login/`,
    body: { email, password },
  }).then(({ body }) => {
    const token = body.access || body.token
    if (token) {
      localStorage.setItem('access_token', token)
    }
  })
})

// Custom command: upload resume via API directly
Cypress.Commands.add('uploadResume', (filePath, jobTitle = 'Software Engineer') => {
  cy.fixture(filePath, 'binary').then(fileContent => {
    const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'application/pdf')
    const formData = new FormData()
    formData.append('file', blob, 'resume.pdf')
    formData.append('job_title', jobTitle)

    cy.request({
      method: 'POST',
      url: '/api/resume/analyze/',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
  })
})

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver') || err.message.includes('hydrat')) {
    return false
  }
})
