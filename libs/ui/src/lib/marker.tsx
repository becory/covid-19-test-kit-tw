import { LatLngExpression } from "leaflet"
import {Dispatch, FC, SetStateAction, useEffect, useState} from "react"
import {Marker, Popup, useMapEvents} from "react-leaflet"
import {defaultIcon, useColorIcon} from "./marker-icon"
import MarkerClusterGroup from "./MarkerClusterGroup";
import { useTranslation } from "react-i18next"

export const LocationMarker = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null)
  const { t }= useTranslation()
  const map = useMapEvents({
    locationfound(e: L.LocationEvent) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, 12)
    },
    locationerror(e){
      if(e.code===1){
        alert(t('openPermission'))
      }else{
        alert(e.message)
      }
    }
  })
  
  useEffect(() => {
    map.locate()
  }, []);


  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}>
      <Popup>{t('locate')}</Popup>
    </Marker>
  )
}

export const setColor = (stock:number)=>{
  if(stock>50){
    return 'green' ;
  }
  if(stock>=15){
    return 'yellow';
  }
  if(stock<15&&stock > 0){
    return 'red';
  }
  return 'gray'
}

export const PositionMarker = (props: any) => {
  const colorIcon = useColorIcon();
  const {t} = useTranslation();
  const {item, setDetail, setShowDialog, keyIndex} = props;
  if (!item || !item['緯度']|| !item['經度']) return null
  const stock = item[`快篩試劑截至目前結餘存貨數量`]
  const iconColor = setColor(stock);

  const click = () => {
    // e.stopPropagation()
    if (item) {
      setShowDialog(true)
      setDetail(item['醫事機構代碼'])
    }
  }

  return (
    <Marker position={item['position']} icon={colorIcon[`text-${iconColor.toString()}-600`]} eventHandlers={{click: click}} key={`m_${keyIndex}`}>
      <Popup>
        <p>{t('show')}</p>
      </Popup>
    </Marker>
    )
}

export const MapMarker: FC<{ emptyStore: any[]; sellingStore:any; showEmpty: boolean; setDetail: Dispatch<SetStateAction<any>>; setShowDialog:Dispatch<SetStateAction<boolean>>;}> = (props) => {
  const {emptyStore, showEmpty, sellingStore, setDetail, setShowDialog} = props;

  return (<MarkerClusterGroup>
    {showEmpty&&emptyStore.map((item:any) => <PositionMarker item={item} key={`marker_${item['醫事機構代碼']}`} keyIndex={`marker_${item['醫事機構代碼']}`} setDetail={setDetail} setShowDialog={setShowDialog}/>)}
    {sellingStore.map((item:any) => <PositionMarker item={item} key={`marker_${item['醫事機構代碼']}`}  keyIndex={`marker_${item['醫事機構代碼']}`} setDetail={setDetail} setShowDialog={setShowDialog}/>)}
  </MarkerClusterGroup>)
}
