import { gql, useApolloClient, useMutation } from '@apollo/client'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useHistory } from 'react-router'
import { useMe } from '../../hooks/useMe'
import { verifyEmail, verifyEmailVariables } from '../../__generated__/verifyEmail'

const VERIFY_EMAIL_MUTATION = gql`
 mutation verifyEmail($input: VerifyEmailInput!) {
  verifyEmail(input: $input) {
   ok
   error
  }
 }
`

const ConfirmEmail = () => {
 const { data: userData, refetch } = useMe()
 const history = useHistory()
 const client = useApolloClient()
 const onCompleted = (data: verifyEmail) => {
  const {
   verifyEmail: { ok },
  } = data

  if (ok && userData?.me.id) {
   client.writeFragment({
    id: `User:${userData.me.id}`,
    fragment: gql`
     fragment VerifyUser on User {
      verified
     }
    `,
    data: {
     verified: true,
    },
   })
   //    await refetch()
   history.push('/')
  }
 }
 const [verifyEmail, { loading: verifyingEmail }] = useMutation<verifyEmail, verifyEmailVariables>(
  VERIFY_EMAIL_MUTATION,
  {
   onCompleted,
  },
 )

 useEffect(() => {
  const [_, code] = window.location.href.split('code=')
  verifyEmail({
   variables: {
    input: {
     code,
    },
   },
  })
 }, [verifyEmail])

 return (
  <div className="mt-52 flex flex-col items-center justify-center">
   <Helmet>
    <title>Verify Email | Nuber Eats</title>
   </Helmet>
   <h2 className="text-lg mb-2 font-medium">Confirming email...</h2>
   <h4 className="text-gray-700 text-sm">Please wait, dont't close this page...</h4>
  </div>
 )
}

export default ConfirmEmail
