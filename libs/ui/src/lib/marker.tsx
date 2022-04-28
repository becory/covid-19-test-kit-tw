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

const setColor = (count:number)=>{
  if(count>50){
    return 'text-green-600' ;
  }
  if(count>=15){
    return 'text-green-600';
  }
  if(count<15&&count > 0){
    return 'text-red-700';
  }
  return 'text-gray-500'
}

export const PositionMarker = (props: any) => {
  const colorIcon = useColorIcon();
  const {t} = useTranslation();
  const {item, setDetail, setShowDialog, keyIndex} = props;
  if (!item || !item['緯度']|| !item['經度']) return null
  const position = new LatLng(item['緯度'], item['經度'])
  const count = item[`快篩試劑截至目前結餘存貨數量`]
  const iconColor = setColor(count);

  const click = () => {
    // e.stopPropagation()
    if (item) {
      setShowDialog(true)
      setDetail({...item, color: iconColor })
    }
  }

  return (
    <Marker position={position} icon={colorIcon[iconColor.toString()]} eventHandlers={{click: click}} key={`m_${keyIndex}`}>
      <Popup>
        <p>{t('show')}</p>
      </Popup>
    </Marker>
    )
}

export const MapMarker: FC<{ emptyStore: any[]; sellingStore:any; showEmpty: boolean; setDetail: Dispatch<SetStateAction<any>>; setShowDialog:Dispatch<SetStateAction<boolean>>; }> = (props) => {
  const {emptyStore, showEmpty, sellingStore, setDetail, setShowDialog} = props;
  console.log(emptyStore)
  return (<MarkerClusterGroup>
    {showEmpty&&emptyStore.map((item:any) => <PositionMarker item={item} key={`marker_${item['醫事機構代碼']}`} keyIndex={`marker_${item['醫事機構代碼']}`} setDetail={setDetail} setShowDialog={setShowDialog}/>)}
    {sellingStore.map((item:any) => <PositionMarker item={item} key={`marker_${item['醫事機構代碼']}`}  keyIndex={`marker_${item['醫事機構代碼']}`} setDetail={setDetail} setShowDialog={setShowDialog}/>)}
  </MarkerClusterGroup>)
}
