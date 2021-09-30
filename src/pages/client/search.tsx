import React, { useEffect } from 'react'
import { useLocation } from 'react-router'

const Search = () => {
 const location = useLocation()
 useEffect(() => {
  console.log(location)
 }, [])
 return <div>Search page</div>
}

export default Search
