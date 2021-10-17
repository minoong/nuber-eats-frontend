import React from 'react'

interface IButtonProps {
 canClick: boolean
 loading: boolean
 actionText: string
}

const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
 return (
  // eslint-disable-next-line jsx-a11y/no-redundant-roles
  <button
   type="submit"
   className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
    canClick ? 'bg-lime-600 hover:bg-lime-700' : 'bg-gray-300 pointer-events-none'
   }`}
   role="button"
  >
   {loading ? 'Loading...' : actionText}
  </button>
 )
}

export default Button
