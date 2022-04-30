import {useEffect, useMemo, useState, useTransition} from 'react';
import {useCityData, useFetch} from '@covid-19-tw/database'
import {LayersControl, MapContainer, TileLayer, useMapEvents, ZoomControl} from 'react-leaflet'
import {Loading, Header, Legend, LocationMarker, MapMarker} from '@covid-19-tw/ui'
import dayjs from 'dayjs'
import {Detail, Favorite} from './views';
import Fuse from 'fuse.js'
import {useSearchParams} from 'react-router-dom'
import {useTranslation} from "react-i18next";
import axios from 'axios';
import * as locale from 'dayjs/locale/zh-tw';
import { LatLng } from 'leaflet';

export const Main = () => {
  const {data, loading} = useCityData(["city"])
  const getNHI = useFetch(()=>axios.get('https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv'))
  const getAllStore = useFetch(()=>axios.get('https://becory.github.io/covid-19-test-kit-tw-data/all.csv'))
  const [searchParams] = useSearchParams()
  const [positionData, setPositionData] = useState<any[]>([])
  const [getData, setGetData] = useState<any[]>([])
  const [emptyData, setEmptyData] = useState<any[]>([])
  const [updateTime, setUpdateTime] = useState<string>('')
  const [detail, setDetail] = useState<any>();

  const [showDialog, setShowDialog] = useState(true);

  const [cityList, setCityList] = useState<any[]>([]);

  const keywordState = useState<string>('');
  const [keyword, setKeyword] = keywordState;
  const cityState = useState<string>('');
  const [city, setCity] = cityState;
  const stockState = useState<string>('');
  const [stock, setStock] = stockState;

  const showEmptyState = useState<boolean>(false)
  const [showEmpty,] = showEmptyState;

  const {t, i18n} = useTranslation()

  const [isPending, startTransition] = useTransition()

  const favoriteState = useState<string[]>([])
  const [favorite, setFavorite]= favoriteState;
  const [favoriteList, setFavoriteList]= useState<any[]>([]);

  const [init, setInit] = useState(false);
  const [refresh, setRefresh] = useState(0)

  useEffect(()=>{
    const getFavorite = localStorage.getItem('favorite')
    if(getFavorite){
      setFavorite(JSON.parse(getFavorite))
    }
    getAllStore.run()
    setInit(true)
  },[])
  
  useEffect(()=>{
    getNHI.run()
    const getDataInterval = setInterval(()=>{
      getNHI.run()
    }, 120000)
    return ()=>clearInterval(getDataInterval)
  },[refresh])

  useEffect(()=>{
    if(init){
      localStorage.setItem('favorite', JSON.stringify(favorite))
    }
  },[JSON.stringify(favorite)])

  useEffect(()=>{
    const dataFormat = getNHI.data.map((detail:any)=>{
      detail['position'] = new LatLng(detail['緯度'], detail['經度'])
      detail['來源資料時間']= dayjs(detail['來源資料時間'])
      detail[`快篩試劑截至目前結餘存貨數量`] = parseInt(detail[`快篩試劑截至目前結餘存貨數量`])
      return detail
    })
    setGetData(dataFormat) 
    setUpdateTime(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  },[getNHI.data])


  const emptyStore = useMemo(()=>{
    const sellID = getData.map((item)=>item['醫事機構代碼'])
    return getAllStore.data.filter((item:any)=> !sellID.includes(item['醫事機構代碼'])).map((detail:any)=>{
      detail['position'] = new LatLng(detail['緯度'], detail['經度'])
      return detail
    })
  }, [getData, getAllStore.data])

  const options = {
    useExtendedSearch: true,
    keys: [
      "醫事機構名稱",
      "醫事機構地址",
      "醫事機構電話"
    ]
  };    

  const fuse = useMemo(() => {
    return new Fuse(getData, options);
  }, [getData])

  const fuseEmpty = useMemo(() => {
    return new Fuse(emptyStore, options);
  }, [emptyStore])

  useEffect(()=>{
    setFavoriteList([...getData.filter((item:any)=>favorite.includes(item['醫事機構代碼'])), ...emptyStore.filter((item:any)=>favorite.includes(item['醫事機構代碼']))])
  },[getData, emptyStore, favorite])

  useEffect(() => {
    if(i18n.language==='zh-TW'||i18n.language==='zh'){
      dayjs.locale(locale)
    }else{
      dayjs.locale('en')
    }
  }, [i18n.language])

  useEffect(() => {
    const getKeyword = searchParams.get('keyword') || ''
    const getCity = searchParams.get('city') || ''
    const getStock = searchParams.get('stock') || ''
    setKeyword(getKeyword)
    setCity(getCity)
    setStock(getStock)
  }, [searchParams])

  useEffect(() => {
    if (data[0]?.data) {
      setCityList([{"city": null}, ...data[0].data])
    }
  }, [data])

  useEffect(() => {
    if (getData&& emptyStore) {

      startTransition(()=>{
        let searchData;
        let searchEmptyData;
        if (keyword) {
          searchData = fuse.search(`'${keyword} | ${keyword}$`).map((item) => item.item)
          searchEmptyData = fuseEmpty.search(`'${keyword} | ${keyword}$`).map((item) => item.item)
        } else {
          searchData = getData;
          searchEmptyData = emptyStore;
        }
        const inputStock = parseInt(stock)
        const filterData = searchData.filter((item:any)=>{
          if(inputStock>=0){
            return item['快篩試劑截至目前結餘存貨數量'] >= inputStock
          }
          return item
        })

        setPositionData(filterData)
        if(!inputStock){
          setEmptyData(searchEmptyData)
        }else{
          setEmptyData([])
        }
      })
    }
  }, [getData, keyword, city, stock])

  return (
    <div className="relative select-none">
     {(loading||isPending) && <Loading/>}
      <MapContainer center={{lat: 25.08116092384666, lng: 121.38473295606676}} zoom={11}
                    style={{height: '100vh', position: 'relative'}} zoomControl={false}>
        <Header
          filter={{
            city: cityState,
            keyword: keywordState,
            showEmpty: showEmptyState,
            stock: stockState
          }}
          dataLength={positionData.length}
          cityList={cityList}
          emptyStoreLength={emptyData.length}
          setShowDialog={setShowDialog}
          setDetail={setDetail}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://github.com/becory/covid-19-test-kit-tw" target="_blank" rel="noreferrer">becory</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker/>
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="販售店家 / Sell Store">
            <MapMarker sellingStore={positionData} setDetail={setDetail} setShowDialog={setShowDialog} showEmpty={showEmpty} emptyStore={emptyData}/>
          </LayersControl.Overlay>
        </LayersControl>
        <ZoomControl position='bottomleft'/>
        <Legend updateTime={updateTime}/>
        {showDialog &&
          (detail ? (
            <Detail detail={detail} sellingStore={positionData} emptyStore={emptyStore} setShowDialog={setShowDialog} favoriteState={favoriteState}/>
          ) : (
            <Favorite setRefresh={setRefresh} setShowDialog={setShowDialog} favoriteList={favoriteList} favoriteState={favoriteState}/>
          ))
        }
      </MapContainer>
    </div>
  )
}
