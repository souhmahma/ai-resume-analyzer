/**
 * E2E Tests — ai-resume-analyzer
 * Full browser flow: login → upload resume → view results → logout
 *
 * Adapt selectors (data-cy attributes) to match your actual React components.
 * Run: npx cypress run
 */

describe('Resume Analyzer — Full Flow', () => {
  const testUser = {
    username: 'testuser_' + Math.random().toString(36).substring(7),
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!',
  }

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.viewport(1280, 800)
  })

  it('Exécute le cycle complet : Inscription -> Login -> Upload', () => {
    // 1. Inscription (Register)
    cy.visit('/register')
    cy.get('input[name="first_name"]').type('John')
    cy.get('input[name="last_name"]').type('Doe')
    cy.get('input[name="username"]').type(testUser.username)
    cy.get('input[name="email"]').type(testUser.email)
    cy.get('input[name="password"]').type(testUser.password)
    cy.get('input[name="password2"]').type(testUser.password)
    cy.get('button[type="submit"]').click()

    // Vérifie qu'on est redirigé vers login
    cy.url().should('include', '/login')

    // 2. Connexion (Login)
    // Attention : Ton Login.jsx utilise "username" comme label mais le state s'appelle "username"
    cy.get('input[name="username"]').type(testUser.username)
    cy.get('input[name="password"]').type(testUser.password)
    cy.get('button[type="submit"]').click()

    // 3. Dashboard & Navigation
    cy.url().should('include', '/dashboard')
    cy.contains('New analysis').click()

    // 4. Upload de CV (Analyze)
    cy.url().should('include', '/analyze')
    
    // Simule l'upload (nécessite un fichier resume.pdf dans cypress/fixtures)
    const filePath = 'resume.pdf'
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filePath}`, { force: true })
    
    // Remplit le titre du poste
    cy.get('input[placeholder*="e.g. Senior"]').type('Software Engineer')
    
    // Lance l'analyse
    cy.contains('Analyze my resume').click()

    // 5. Vérifie l'animation de chargement
    cy.contains('AI analyzing').should('be.visible')
    
    // Attend la redirection vers les résultats (timeout de 20s car l'IA est lente)
    cy.url({ timeout: 20000 }).should('include', '/results/')
  })
})