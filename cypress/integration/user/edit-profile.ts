describe('Edit Profile', () => {
 const user = cy
 beforeEach(() => {
  user.login('updateTest3@real.com', '1234')
 })

 it('can go to /edit-profile using the header', () => {
  user.get('a[href="/edit-profile"]').click()
  user.wait(2000)
  user.title().should('eq', 'Edit Profile | Nuber Eats')
 })

 it('can change email', () => {
  user.intercept('POST', 'http://127.0.0.1:4000/graphql', (req) => {
   const { operationName } = req.body

   if (operationName && operationName === 'editProfile') {
    req.body.variables.input.email = 'updateTest3@real.com'
   }
  })
  user.get('a[href="/edit-profile"]').click()
  user.findByPlaceholderText(/email/i).clear().type('updateTest4@real.com')
  user.findByRole('button').click()
 })
})
