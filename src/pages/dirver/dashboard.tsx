import { gql, useMutation, useSubscription } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FULL_ORDER_FRAGMENT } from '../../utils/fragments'
import { coockedOrders } from '../../__generated__/coockedOrders'
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder'

const COOCKED_ORDERS_SUBSCRIPTION = gql`
 subscription coockedOrders {
  cookedOrders {
   ...FullOrderParts
  }
 }
 ${FULL_ORDER_FRAGMENT}
`

const TAKE_ORDER_MUTATION = gql`
 mutation takeOrder($input: TakeOrderInput!) {
  takeOrder(input: $input) {
   ok
   error
  }
 }
`

interface ICoords {
 lat: number
 lng: number
}

let map: naver.maps.Map
let id: number

const Dashboard = () => {
 const ref = useRef<HTMLDivElement | null>(null)
 const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 })

 const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
  console.log({ latitude, longitude })
  //   navigator.geolocation.clearWatch(id)
  setDriverCoords({ lat: latitude, lng: longitude })
 }
 const onError = (error: GeolocationPositionError) => {
  console.log(error)
 }

 useEffect(() => {
  id = navigator.geolocation.watchPosition(onSuccess, onError, {
   enableHighAccuracy: true,
  })

  //   navigator.geolocation.clearWatch(id)
  const initMaps = () => {
   console.log('initMaps')
   if (ref.current === null) return
   map = new naver.maps.Map(ref.current, {
    center: new naver.maps.LatLng(37.3658036, 127.1222656),
    zoom: 13,
   })
   //    if (ref.current === null) return
   //    map = new naver.maps.Map(ref.current, {
   //     bounds: naver.maps.LatLngBounds.bounds(
   //      new naver.maps.LatLng(37.4713967, 126.9684889),
   //      new naver.maps.LatLng(37.3585229, 127.1010728),
   //     ),
   //    })

   //    var greenMarker = new naver.maps.Marker({
   //     position: new naver.maps.LatLng(37.4713967, 126.9684889),
   //     map: map,
   //     title: 'Green',
   //     icon: {
   //      content: `<div class='text-lg'>🏎</div>`,
   //      size: new naver.maps.Size(38, 58),
   //      anchor: new naver.maps.Point(19, 58),
   //     },
   //     draggable: true,
   //    })
  }

  initMaps()

  return () => console.log('end')
 }, [])

 useEffect(() => {
  if (ref.current === null) return

  setTimeout(() => {
   map.panTo(new naver.maps.LatLng(driverCoords.lat, driverCoords.lng), {
    duration: 500,
   })

   new naver.maps.Marker({
    position: new naver.maps.LatLng(driverCoords.lat, driverCoords.lng),
    map: map,
    title: 'Green',
    icon: {
     content: `<div class='text-lg'>🏎</div>`,
     size: new naver.maps.Size(38, 58),
     anchor: new naver.maps.Point(19, 58),
    },
    draggable: true,
   })
  }, 2000)
  //    map = new naver.maps.Map(ref.current, {
  //     center: new naver.maps.LatLng(driverCoords.lat, driverCoords.lng),
  //     zoom: 13,
  //    })

  //   var greenMarker = new naver.maps.Marker({
  //    position: new naver.maps.LatLng(driverCoords.lat, driverCoords.lng),
  //    map: map,
  //    title: 'Green',
  //    icon: {
  //     content: `<div class='text-lg'>🏎</div>`,
  //     size: new naver.maps.Size(38, 58),
  //     anchor: new naver.maps.Point(19, 58),
  //    },
  //    draggable: true,
  //   })
 }, [driverCoords])

 const { data: coockedOrdersData } = useSubscription<coockedOrders>(COOCKED_ORDERS_SUBSCRIPTION)

 useEffect(() => {
  if (coockedOrdersData?.cookedOrders.id) {
  }
 }, [coockedOrdersData])
 const history = useHistory()
 const onCompleted = (data: takeOrder) => {
  if (data.takeOrder.ok) {
   history.push(`/orders/${coockedOrdersData?.cookedOrders.id}`)
  }
 }
 const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER_MUTATION, {
  onCompleted,
 })

 const triggerMutation = (orderId: number) => {
  takeOrderMutation({
   variables: {
    input: {
     id: orderId,
    },
   },
  })
 }
 return (
  <div>
   <div ref={ref} style={{ width: window.innerWidth, height: '40vh' }} />
   <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
    {coockedOrdersData?.cookedOrders.restaurant ? (
     <>
      <h1 className="text-center text-3xl font-medium">New Coocked Order</h1>
      <h4 className="text-center my-3 text-2xl font-medium">Pick it up soon @</h4>
      <button
       onClick={() => triggerMutation(coockedOrdersData.cookedOrders.id)}
       className="btn w-full block text-center mt-5"
      >
       Accept Challenge &rarr;
      </button>
     </>
    ) : (
     <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
    )}
   </div>
  </div>
 )
}

export default Dashboard
