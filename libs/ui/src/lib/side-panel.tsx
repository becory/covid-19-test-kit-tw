import { FC, ReactNode, useEffect, useRef } from "react";
import L from 'leaflet'

/* eslint-disable-next-line */
interface SidePanelProps {
  header: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}

export const SidePanel:FC<SidePanelProps> = (props)=>{
  const {header, children, right} = props;
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(divRef&& divRef.current){
      L.DomEvent.disableClickPropagation(divRef.current)
      L.DomEvent.disableScrollPropagation(divRef.current)
    }
  },[divRef])

  return (
  <div ref={divRef} className="absolute z-[2000] m-3 bottom-0 w-[calc(100%-1.5rem)] h-full max-h-[50%] md:right-0 md:top-16 md:bottom-none md:h-[calc(100%-5.5rem)] md:max-h-full md:w-fit md:min-w-[35%] md:max-w-[40%] bg-base-100 border-gray-300 border border-solid rounded-md shadow-md overflow-hidden">
    <div className="text-xl font-bold select-none text-info-content bg-info p-3">
      <div className="flex justify-between">
        {header}
        {right && <div>{right}</div>}
      </div>
    </div>
    <div onScroll={(e)=>{e.stopPropagation()}} className="p-5 overflow-y-auto h-[calc(100%-3.5rem)]">
      {children}
    </div>
  </div>
)}
