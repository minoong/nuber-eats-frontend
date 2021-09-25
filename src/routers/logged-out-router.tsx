import React from 'react'
import { useForm } from 'react-hook-form'
import { isLoggedInVar } from '../apollo'

interface IForm {
 email: string
 password: string
}

export const LoggedOutRouter = () => {
 const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
 } = useForm<IForm>()

 const onSubmit = () => {
  console.log(watch())
 }

 const onInvalid = () => {
  console.log(`can't create account.`)
 }

 return (
  <div>
   <h1>Logged Out</h1>
   <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
    <div>
     <input
      {...register('email', {
       required: 'This is required',
       pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
      })}
      type="email"
      name="email"
      //   required
      placeholder="email"
     />
     {errors.email?.message && <span className="font-bold text-red-600">{errors.email.message}</span>}
     {errors.email?.type === 'pattern' && <span className="font-bold text-red-600">Only gmail allowed</span>}
    </div>
    <div>
     <input
      {...register('password', { required: true })}
      type="password"
      name="password"
      required
      placeholder="password"
     />
    </div>
    <button className="bg-yellow-300 text-white">Submit</button>
   </form>
  </div>
 )
}
