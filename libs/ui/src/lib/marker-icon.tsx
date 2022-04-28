import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { divIcon } from "leaflet";
import {renderToString} from 'react-dom/server'

export const defaultIcon = divIcon({
    html: renderToString(<FontAwesomeIcon icon={faLocationDot} className="text-blue-400 drop-shadow-2xl w-full h-auto" />),
    className: 'icon',
    iconSize: [25, 33.33],
    iconAnchor: [11, 39],
    popupAnchor: [-2, -25],
})

export const useColorIcon = ()=>{
    const colorIcon:any = {}
    colorIcon['text-green-600'] =  divIcon({
        html: renderToString(<FontAwesomeIcon icon={faLocationDot} className={[`text-green-600`,"drop-shadow-lg w-full h-auto"].join(" ")} />),
        className: 'icon',
        iconSize: [25, 33.33],
        iconAnchor: [11, 39],
        popupAnchor: [-2, -25],
    })
    colorIcon['text-yellow-600'] =  divIcon({
        html: renderToString(<FontAwesomeIcon icon={faLocationDot} className={[`text-yellow-600`,"drop-shadow-lg w-full h-auto"].join(" ")} />),
        className: 'icon',
        iconSize: [25, 33.33],
        iconAnchor: [11, 39],
        popupAnchor: [-2, -25],
    })
    colorIcon['text-red-600'] =  divIcon({
        html: renderToString(<FontAwesomeIcon icon={faLocationDot} className={[`text-red-700`,"drop-shadow-lg w-full h-auto"].join(" ")} />),
        className: 'icon',
        iconSize: [25, 33.33],
        iconAnchor: [11, 39],
        popupAnchor: [-2, -25],
    })
    colorIcon['text-gray-600'] =  divIcon({
        html: renderToString(<FontAwesomeIcon icon={faLocationDot} className={[`text-gray-500`,"drop-shadow-lg w-full h-auto"].join(" ")} />),
        className: 'icon',
        iconSize: [25, 33.33],
        iconAnchor: [11, 39],
        popupAnchor: [-2, -25],
    })
    return colorIcon
}