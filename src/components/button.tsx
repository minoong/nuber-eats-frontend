import React from 'react'

interface IButtonProps {
 canClick: boolean
 loading: boolean
 actionText: string
}

const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
 return (
  <button
   type="submit"
   className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
    canClick ? 'bg-lime-600 hover:bg-lime-800' : 'bg-gray-300 pointer-events-none'
   }`}
  >
   {loading ? 'Loading...' : actionText}
  </button>
 )
}

export default Button
