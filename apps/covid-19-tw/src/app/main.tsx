import {useEffect, useMemo, useState, useTransition} from 'react';
import {useCityData} from '@covid-19-tw/database'
import { GeoJSON, LayersControl, MapContainer, TileLayer, ZoomControl} from 'react-leaflet'
import {Loading, Header, Legend, LocationMarker, MapMarker} from '@covid-19-tw/ui'
import dayjs from 'dayjs'
import {Detail, Announce} from './views';
import Fuse from 'fuse.js'
import {useSearchParams} from 'react-router-dom'
import {useTranslation} from "react-i18next";
import axios from 'axios';
import {GeoJsonObject} from 'geojson';
import csv from 'csvtojson';
import * as locale from 'dayjs/locale/zh-tw';

export const Main = () => {
  const {data, loading} = useCityData(["city"])
  const [searchParams] = useSearchParams()
  const [positionData, setPositionData] = useState<any[]>([])
  const [getData, setGetData] = useState<any[]>([])
  const [updateTime, setUpdateTime] = useState<string>()
  const [detail, setDetail] = useState<any>();

  const [showDialog, setShowDialog] = useState(true);

  const [cityList, setCityList] = useState<any[]>([]);

  const keywordState = useState<string>('');
  const [keyword, setKeyword] = keywordState;
  const cityState = useState<string>('');
  const [city, setCity] = cityState;

  const [cityGeoJSON, setCityGeoJSON] = useState<GeoJsonObject|null>(null);

  const {t, i18n} = useTranslation()

  const [isPending, startTransition] = useTransition()


  useEffect(() => {
    axios.get('https://g0v.github.io/twgeojson/twCounty2010.geo.json').then((res) => {
      setCityGeoJSON(res.data)
    })
  }, [])

  useEffect(()=>{
    axios.get('https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv').then((res)=>{
      csv({
        noheader:false
      })
      .fromString(res.data)
      .then((jsonRow)=>{ 
        const data = jsonRow.map((detail)=>{
          detail['來源資料時間']= dayjs(detail['來源資料時間'])
          detail[`快篩試劑截至目前結餘存貨數量`] = parseInt(detail[`快篩試劑截至目前結餘存貨數量`])
          return detail
        })
        setUpdateTime(dayjs().format('YYYY-MM-DD HH:mm:ss'))
        setGetData(data)
      })
    })
  },[])

  const fuse = useMemo(() => {
    const options = {
      useExtendedSearch: true,
      keys: [
        "醫事機構名稱",
        "醫事機構地址",
        "醫事機構電話"
      ]
    };
    return new Fuse(getData, options);
  }, [getData])

  useEffect(() => {
    document.title = t('title');
    if(i18n.language==='zh-TW'||i18n.language==='zh'){
      dayjs.locale(locale)
    }else{
      dayjs.locale('en')
    }
  }, [i18n.language])

  useEffect(() => {
    const getKeyword = searchParams.get('keyword') || ''
    const getCity = searchParams.get('city') || ''
    setKeyword(getKeyword)
    setCity(getCity)
  }, [searchParams])

  useEffect(() => {
    if (data[0]?.data) {
      setCityList([{"city": null}, ...data[0].data])
    }
  }, [data])

  useEffect(() => {
    if (getData) {
        const filter = {"keyword": keyword, "city": city}

      startTransition(()=>{
        let searchData;
        if (filter.keyword) {
          searchData = fuse.search(`'${filter.keyword} | ${filter.keyword}$`).map((item) => item.item)
        } else {
          searchData = getData
        }

        setPositionData(searchData)
      })
    }
  }, [getData, keyword, city])


  return (
    <div className="relative select-none">
     {(loading||isPending) && <Loading/>}
      <MapContainer center={{lat: 25.08116092384666, lng: 121.38473295606676}} zoom={11}
                    style={{height: '100vh', position: 'relative'}} zoomControl={false}>
        <Header
          filter={{
            city: cityState,
            keyword: keywordState,
          }}
          dataLength={positionData.length}
          cityList={cityList}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker/>
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="販售店家 / Sell Store">
            <MapMarker marker={positionData} setDetail={setDetail} setShowDialog={setShowDialog} geoJSON={cityGeoJSON}/>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="縣市邊界 / City limits">
           {cityGeoJSON&&<GeoJSON data={cityGeoJSON}/>}
          </LayersControl.Overlay>
        </LayersControl>
        <ZoomControl position='bottomleft'/>
        <Legend updateTime={updateTime}/>
        {showDialog &&
          (detail ? (
            <Detail detail={detail} setShowDialog={setShowDialog} cityList={cityList}/>
          ) : (
            <Announce setShowDialog={setShowDialog}/>
          ))
        }
      </MapContainer>
    </div>
  )
}
