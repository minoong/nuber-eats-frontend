import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import { useMe } from '../../hooks/useMe'
import nuberLogo from '../../images/logo.svg'

const Header: React.FC = () => {
 const { data } = useMe()
 return (
  <header className="py-4">
   <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center">
    <img src={nuberLogo} alt="Nuber Eats" className="w-24" />
    <span className="text-xs">
     <Link to="/my-profile">
      <FontAwesomeIcon icon={faUser} className="text-2xl" />
     </Link>
    </span>
   </div>
  </header>
 )
}

export default Header