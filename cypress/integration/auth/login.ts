describe('Log In', () => {
 it('should see login page', () => {
  cy.visit('/').title().should('eq', 'Login | Nuber Eats')
 })

 it('can see email / password validation errors', () => {
  cy.visit('/')
  cy.findByPlaceholderText(/email/i).type('test')
  cy.findByRole('alert').should('have.text', '이메일 형식으로 입력하세요')
  cy.findAllByPlaceholderText(/email/i).clear()
  cy.findByRole('alert').should('have.text', 'Email is required')
  cy.findByPlaceholderText(/email/i).type('testtest@test.com')
  cy
   .findByPlaceholderText(/password/i)
   .type('a')
   .clear()
  cy.findByRole('alert').should('have.text', 'Password is required')
 })

 it('can fill out the form and log in', () => {
  cy.login('real2@mail.com', '1234')
 })
})
