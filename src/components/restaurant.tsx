import React from 'react'

interface IRestaurantProps {
 id: string
 coverImage: string
 name: string
 categoryName?: string
}

const Restaurant: React.FC<IRestaurantProps> = ({ coverImage, name, categoryName }) => {
 return (
  <div className="flex flex-col">
   <div className="bg-cover bg-center mb-3 py-28" style={{ backgroundImage: `url(${coverImage})` }}></div>
   <h3 className="text-lg font-medium">{name}</h3>
   <span className="border-t mt-3 py-2 text-xs opacity-50 border-gray-400">{categoryName}</span>
  </div>
 )
}

export default Restaurant
