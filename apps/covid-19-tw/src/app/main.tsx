import {useEffect, useMemo, useState, useTransition} from 'react';
import {useCityData, useFetch} from '@covid-19-tw/database'
import {LayersControl, MapContainer, TileLayer, ZoomControl} from 'react-leaflet'
import {Loading, Header, Legend, LocationMarker, MapMarker} from '@covid-19-tw/ui'
import dayjs from 'dayjs'
import {Detail, Favorite} from './views';
import Fuse from 'fuse.js'
import {useSearchParams} from 'react-router-dom'
import {useTranslation} from "react-i18next";
import axios from 'axios';
import * as locale from 'dayjs/locale/zh-tw';

export const Main = () => {
  const {data, loading} = useCityData(["city"])
  const getNHI = useFetch(()=>axios.get('https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv'))
  const getAllStore = useFetch(()=>axios.get('https://becory.github.io/covid-19-test-kit-tw-data/all.csv'))
  const [searchParams] = useSearchParams()
  const [positionData, setPositionData] = useState<any[]>([])
  const [getData, setGetData] = useState<any[]>([])
  const [updateTime, setUpdateTime] = useState<string>('')
  const [detail, setDetail] = useState<any>();

  const [showDialog, setShowDialog] = useState(true);

  const [cityList, setCityList] = useState<any[]>([]);

  const keywordState = useState<string>('');
  const [keyword, setKeyword] = keywordState;
  const cityState = useState<string>('');
  const [city, setCity] = cityState;

  const showEmptyState = useState<boolean>(false)
  const [showEmpty,] = showEmptyState;

  const {t, i18n} = useTranslation()

  const [isPending, startTransition] = useTransition()

  const favoriteState = useState<string[]>([])
  const [favorite, setFavorite]= favoriteState;
  const [favoriteList, setFavoriteList]= useState<any[]>([]);

  const [init, setInit] = useState(false);

  useEffect(()=>{
    const getFavorite = localStorage.getItem('favorite')
    if(getFavorite){
      setFavorite(JSON.parse(getFavorite))
    }
    getNHI.run()
    getAllStore.run()
    setInit(true)
    const getDataInterval = setInterval(()=>{
      getNHI.run()
    }, 120000)
    return ()=>clearInterval(getDataInterval)
  },[])

  useEffect(()=>{
    if(init){
      localStorage.setItem('favorite', JSON.stringify(favorite))
    }
  },[JSON.stringify(favorite)])

  useEffect(()=>{
    const data = getNHI.data.map((detail:any)=>{
      detail['來源資料時間']= dayjs(detail['來源資料時間'])
      detail[`快篩試劑截至目前結餘存貨數量`] = parseInt(detail[`快篩試劑截至目前結餘存貨數量`])
      return detail
    })
    setGetData(data) 
    setUpdateTime(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  },[getNHI.data])


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

  const emptyStore = useMemo(()=>{
    const sellID = getData.map((item)=>item['醫事機構代碼'])
    return getAllStore.data.filter((item:any)=> !sellID.includes(item['醫事機構代碼']))
  }, [getData, getAllStore.data])

  useEffect(()=>{
    setFavoriteList([...getData.filter((item:any)=>favorite.includes(item['醫事機構代碼'])), ...emptyStore.filter((item:any)=>favorite.includes(item['醫事機構代碼']))])
  },[getData, emptyStore, favorite])

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
            showEmpty: showEmptyState
          }}
          dataLength={positionData.length}
          cityList={cityList}
          emptyStoreLength={emptyStore.length}
          setShowDialog={setShowDialog}
          setDetail={setDetail}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker/>
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="販售店家 / Sell Store">
            <MapMarker sellingStore={positionData} setDetail={setDetail} setShowDialog={setShowDialog} showEmpty={showEmpty} emptyStore={emptyStore}/>
          </LayersControl.Overlay>
        </LayersControl>
        <ZoomControl position='bottomleft'/>
        <Legend updateTime={updateTime}/>
        {showDialog &&
          (detail ? (
            <Detail detail={detail} sellingStore={positionData} emptyStore={emptyStore} setShowDialog={setShowDialog} favoriteState={favoriteState}/>
          ) : (
            <Favorite setShowDialog={setShowDialog} favoriteList={favoriteList} favoriteState={favoriteState}/>
          ))
        }
      </MapContainer>
    </div>
  )
}
