import { LatLng, LatLngExpression } from "leaflet"
import {Dispatch, FC, SetStateAction, useEffect, useState} from "react"
import {Marker, Popup, useMap, useMapEvents} from "react-leaflet"
import {defaultIcon, useColorIcon} from "./marker-icon"
import MarkerClusterGroup from "./MarkerClusterGroup";
import {booleanPointInPolygon, featureCollection, geomReduce, point} from '@turf/turf'
import { useTranslation } from "react-i18next"

export const LocationMarker = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null)

  const map = useMapEvents({
    locationfound(e: L.LocationEvent) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, 12)
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

export const PositionMarker = (props: any) => {
  const colorIcon = useColorIcon();
  const {item, setDetail, setShowDialog, geoJSON, keyIndex} = props;
  if (!item || !item['緯度']|| !item['經度']) return null
  const position = new LatLng(item['緯度'], item['經度'])
  const count = item[`快篩試劑截至目前結餘存貨數量`]
  const iconColor = ( count >= 50) ? 'text-green-600' : ((count >=15)? 'text-yellow-600': 'text-red-700')
  const {t} = useTranslation()

  const click = () => {
    // e.stopPropagation()
    if (item) {
      const markerCity = geoJSON?.features.find((subItem:any)=>(booleanPointInPolygon(point([parseFloat(item['經度']), parseFloat(item['緯度'])]), subItem.geometry)))
      setShowDialog(true)
      setDetail({...item, color: iconColor, 
        markerCity: markerCity.properties.name
       })
    }
  }

  return (
    <Marker position={position} icon={colorIcon[iconColor.toString()]} eventHandlers={{click: click}} key={`m_${keyIndex}`}>
      <Popup>
        <p>{t('show')}</p>
      </Popup>
    </Marker>)
}

export const MapMarker: FC<{ marker: any[]; geoJSON:any; setDetail: Dispatch<SetStateAction<any>>; setShowDialog:Dispatch<SetStateAction<boolean>>; }> = (props) => {
  const {marker, geoJSON, setDetail, setShowDialog} = props;
// .filter((item) => (bounds.contains({lat: item.latitude, lng: item.longitude})))
  const map = useMap()
  return (<MarkerClusterGroup>
    {marker.filter(item =>
      map.getBounds().contains({lat: item['緯度'], lng: item['經度']})
   ).map((item, index) => <PositionMarker item={item} key={`marker_${index}`} keyIndex={index} setDetail={setDetail}
                                            setShowDialog={setShowDialog} geoJSON={geoJSON}/>)}
  </MarkerClusterGroup>)
}
