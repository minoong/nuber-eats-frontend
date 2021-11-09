import React, { useEffect, useRef, useState } from 'react'

interface ICoords {
 lat: number
 lng: number
}

let map: naver.maps.Map

const Dashboard = () => {
 const ref = useRef<HTMLDivElement | null>(null)
 const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 })

 const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
  console.log(123)
  setDriverCoords({ lat: latitude, lng: longitude })
 }
 const onError = (error: GeolocationPositionError) => {
  console.log(error)
 }

 useEffect(() => {
  navigator.geolocation.watchPosition(onSuccess, onError, {
   enableHighAccuracy: true,
  })
  const initMaps = () => {
   if (ref.current === null) return
   map = new naver.maps.Map(ref.current, {
    center: new naver.maps.LatLng(36, 127.012084),
    zoom: 13,
   })
  }

  initMaps()
 }, [])

 return (
  <div>
   <div ref={ref} style={{ width: window.innerWidth, height: '95vh' }} />
  </div>
 )
}

export default Dashboard
