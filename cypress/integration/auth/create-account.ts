describe('Create Account', () => {
 const user = cy
 it('Should see email / password validation errors', () => {
  user.visit('/')
  user.findByText(/Create an Account/i).click()
  user.findByPlaceholderText(/email/i).type('non@good')
  user.findByRole('alert').should('have.text', '이메일 형식으로 입력하세요')
  user.findByPlaceholderText(/email/i).clear()
  user.findByRole('alert').should('have.text', 'Email is required')
  user.findByPlaceholderText(/email/i).type('non@good.com')
  user
   .findByPlaceholderText(/password/i)
   .type('a')
   .clear()
  user.findByRole('alert').should('have.text', 'Password is required')
 })

 it('should be able to create account', () => {
  user.intercept('http://127.0.0.1:4000/graphql', (req) => {
   const { operationName } = req.body

   if (operationName && operationName === 'createAccountMutation') {
    req.reply((res) => {
     res.send({
      data: {
       createAccount: {
        ok: true,
        error: null,
        __typename: 'CreateAccountOutput',
       },
      },
     })
    })
   }
  })
  user.visit('/create-account')
  user.findByPlaceholderText(/email/i).type('real2@mail.com')
  user.findByPlaceholderText(/password/i).type('1234')
  user.findByRole('button').click()

  user.wait(1000)
  user.title().should('eq', 'Login | Nuber Eats')

  user.findByPlaceholderText(/email/i).type('real2@mail.com')
  user.findByPlaceholderText(/password/i).type('1234')
  user.findByRole('button').click()
  cy.window().its('localStorage.nuber-token').should('be.a', 'string')
 })
})
