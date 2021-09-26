import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
 return (
  <div className="h-screen flex flex-col items-center justify-center">
   <h2 className="font-semibold text-2xl mb-3">Page Not Found.</h2>
   <h4 className="font-medium text-base mb-5">The page you're looking for does not exist for has moved.</h4>
   <Link to="" className="hover:underline text-lime-500">
    Go back home &rarr;
   </Link>
  </div>
 )
}

export default NotFound
