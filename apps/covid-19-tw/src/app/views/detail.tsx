import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {SidePanel} from "@covid-19-tw/ui";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faClock,
  faDatabase,
  faHeart as faHeartSolid,
  faMapLocation,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart
} from "@fortawesome/free-regular-svg-icons";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

interface DetailProps {
  detail: any;
  emptyStore: any[];
  sellingStore:any;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  favoriteState: [string[], Dispatch<SetStateAction<string[]>>]
}

export const Detail: FC<DetailProps> = (props) => {
  const {detail:id, emptyStore, sellingStore, setShowDialog, favoriteState} = props;
  const [favorite, setFavorite] = favoriteState;

  const {t, i18n} = useTranslation();

  const detail = sellingStore.find((item:any)=> item['醫事機構代碼']===id) || emptyStore.find((item:any)=> item['醫事機構代碼']===id)

  if(!detail){
    return null
  }
  
  const isPined = Boolean(favorite.find(item=>item===detail['醫事機構代碼']))

  const onHeartClick = ()=>{
    if(isPined){
      setFavorite(favorite.filter(item => item !== detail?.['醫事機構代碼']));
    }else{
      setFavorite(prev => [...prev, detail?.['醫事機構代碼']]);
    }
  }

  const onOpenGoogleMap = ()=>{
    window.open(`https://www.google.com.tw/maps/search/${detail?.[`醫事機構地址`]}`, "_blank")
  }

  //(?<zipcode>(^\d{5}|^\d{3})?)(?<city>\D+[縣市])(?<district>\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)
  const address = detail?.['醫事機構地址'].trim().split(/(?<zipcode>(^\d{5}|^\d{3})?)(?<city>\D+[縣市])(?<district>\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)/).filter((item:any)=>item)
  return (
    <SidePanel
      header={<div className='flex gap-1'>
        <div><FontAwesomeIcon icon={faMapLocation}/></div>
        <div>{t('detailTitle')}</div>
      </div>}
      right={
        <button onClick={(e) => {
          e.stopPropagation();
          setShowDialog(false);
        }}>
          <FontAwesomeIcon icon={faXmark}/>
        </button>
      }
    >
      <div className="flex justify-between flex-col gap-5 align-end">
        <div className="border-gray-200 border border-solid rounded-md shadow-lg divide-gray-200 divide-y divide-solid overflow-hidden">
          <div className="flex justify-between  items-center">
            <div className="text-base font-bold p-3 gap-2 flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-info"/> 
              <div>{detail?.['來源資料時間']?(t('daysAgo', {day:dayjs().to(detail?.['來源資料時間']), count: detail?.[`快篩試劑截至目前結餘存貨數量`]})): t('soldOut')}</div>
            </div>
            <button className="btn btn-error btn-outline gap-2" onClick={onHeartClick}><FontAwesomeIcon icon={isPined? faHeartSolid:faHeart} size="2x" className="text-red"/> {t(isPined? 'unpin':'pin')}</button>
          </div>
          <div className="flex flex-col p-5 gap-2">
            <div className="text-xs text-right">
              <FontAwesomeIcon icon={faDatabase}/> {t("source")}<a href="https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698"
                                                                   target="_blank" rel="noreferrer">{t('NHI')}</a>
            </div>
            <div className="text-base grid grid-cols-2 gap-2">
              <div><b>{t('storeName')}</b>
                <div className='break-words ml-4'>
                  {detail?.[`醫事機構名稱`] && <Link
                    to={`?keyword=${detail?.[`醫事機構名稱`].trim()}`} className="flex" key={`keyword_${detail?.[`醫事機構名稱`]}`}>{detail?.[`醫事機構名稱`].trim()}</Link>}</div>
              </div>
              <div><b>{t("telephone")}</b>
                <div className='break-words ml-4'>
                <a href={`tel:${detail?.[`醫事機構電話`]}`}>{detail?.[`醫事機構電話`]}</a></div>
              </div>
              <div><b>{t('storeNo')}</b>
                <div className='ml-4 flex flex-wrap gap-1'>
                  {detail?.['醫事機構代碼']}
                  </div>
              </div>
              <div className='col-span-2'><b>{t("address")}</b>
              {detail?.[`醫事機構地址`]&&(
                <>
                  <div className='break-words ml-4'>
                    <Link 
                      to={`?keyword=${address[0].trim()}${address[1].trim()}`} key={`address`}>{address?.[0].trim()}{address?.[1].trim()}</Link>{address?.[3].trim()}
                  </div>
                  <div>
                    <button onClick={onOpenGoogleMap} className="btn btn-info gap-2 btn-sm"><FontAwesomeIcon icon={faMapLocation}/> 從Google Map開啟 </button>  
                  </div>
                </>)}
              </div>
              
              {detail?.[`廠牌項目`] && <div className='col-span-2'><b>{t("brands")}</b>
                <div className='break-words ml-4'>{detail?.[`廠牌項目`]}</div>
              </div>}
              {detail?.[`快篩試劑截至目前結餘存貨數量`] && <div className='col-span-2'><b>{t("quantity")}</b>
                <div className='break-words ml-4'>{detail?.[`快篩試劑截至目前結餘存貨數量`]}</div>
              </div>}
              {detail?.[`備註`] && <div className='col-span-2'><b>{t("remark")}</b>
                <div className='break-words ml-4'>{detail?.[`備註`]}</div>
              </div>}
              {detail?.['來源資料時間'] &&<div className='col-span-2'><b>{t("updateTime")}</b>
                <div className='break-words ml-4'>{detail?.['來源資料時間'].format('YYYY-MM-DD HH:mm')}</div>
              </div>}
              <div><b>{t("latitude")}</b>
                <div className='break-words ml-4'>{detail?.['緯度']}</div>
              </div>
              <div><b>{t("longitude")}</b>
                <div className='break-words ml-4'>{detail?.['經度']}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidePanel>
  )
}
