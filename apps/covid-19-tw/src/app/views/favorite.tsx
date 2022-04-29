import { Dispatch, FC, SetStateAction } from "react";
import { setColor, SidePanel } from "@covid-19-tw/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faClock, faHeart, faInfoCircle, faMapLocation, faRotate, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {useTranslation} from "react-i18next";
import dayjs  from "dayjs";
import { Link } from "react-router-dom";

interface FavoriteProps{
    setRefresh: Dispatch<SetStateAction<number>>;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    favoriteList: any[];
    favoriteState: [string[], Dispatch<SetStateAction<string[]>>]
}

const FavoriteItem = (props:any)=>{
  const {item, onHeartClick} =props;
  const {t, i18n} = useTranslation();

  const color = setColor(item['快篩試劑截至目前結餘存貨數量'])

  const onOpenGoogleMap = ()=>{
    window.open(`https://www.google.com.tw/maps/search/${item?.[`醫事機構地址`]}`, "_blank")
  }

  return (<div className={[`bg-${color}-100`,"flex border border-solid rounded-md shadow-sm divide-black text-black"].join(" ")}>
  <h2 className="flex p-3 text-2xl font-bold w-[3.5rem] items-center align-middle text-center justify-center">
    {item?.[`快篩試劑截至目前結餘存貨數量`] || '1000'}
  </h2>
  <div className="flex flex-col grow border-l-2 border-solid border-black p-2">
    <h3 className="flex text-base font-bold gap-2 py-1">{item?.[`醫事機構名稱`] && <Link
                      to={`?keyword=${item?.[`醫事機構名稱`].trim()}`} className="flex" key={`keyword_${item?.[`醫事機構名稱`]}`}>{item?.[`醫事機構名稱`].trim()}</Link>} <button onClick={onOpenGoogleMap} className="btn btn-info gap-2 btn-xs"><FontAwesomeIcon icon={faMapLocation}/> 導航 </button> </h3>
    <div className="flex justify-between items-center">
      <div className={"flex grow flex-col text-ellipsis"}>
        <p className="gap-2">{item?.[`醫事機構地址`]}</p>
        <a href={`tel:${item?.[`醫事機構電話`]}`}>{item?.[`醫事機構電話`]}</a>
        <p className="gap-2"><FontAwesomeIcon icon={faClock} className="text-info"/> 
                {item?.['來源資料時間']?(t('daysAgo', {day:dayjs().to(item?.['來源資料時間']), stock: item?.[`快篩試劑截至目前結餘存貨數量`]})): t('soldOut')}</p>
      </div>
      <div className="flex justify-center items-center align-middle p-2">
        <button className="btn btn-error btn-outline gap-2" onClick={()=>onHeartClick(item['醫事機構代碼'])}><FontAwesomeIcon icon={faHeart} size="2x" className="text-red"/></button>
      </div>
    </div>
  </div>
  </div>)
}

export const Favorite:FC<FavoriteProps> = (props)=>{
    const {setRefresh, setShowDialog, favoriteState, favoriteList} = props;
    const [favorite, setFavorite] = favoriteState;
    const {t, i18n} = useTranslation();

    const ruleI18nURL = i18n.language==='en'? "https://www.cdc.gov.tw/En/Bulletin/Detail/rGeS26Buh0cqn8HqwyX_QQ?typeid=158" :"https://www.cdc.gov.tw/Bulletin/Detail/jgRik-rw93PUUhyZj_ut-g?typeid=9"

    const onHeartClick = (id:string)=>{
      setFavorite(favorite.filter(item => {
        console.log(item !== id)
        return item !== id
      }));
    }
    
    const onRefresh = ()=>{
      setRefresh(prev=>prev+1)
    }

    return (
        <SidePanel
              header={<div className='flex gap-1'><div><FontAwesomeIcon icon={faHeart} className="text-red-600"/></div><div>{t('favorite')}</div></div>}
              right={
                <button onClick={(e)=>{
                  e.stopPropagation();
                  setShowDialog(false)
                  }}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                }
          >
          <div className='flex flex-col gap-5'>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="py-2">{t('legend')}</div>
                <div className="bg-green-100 text-green-800 p-2"> &gt;= 50 </div>
                <div className="bg-yellow-100 text-yellow-800 p-2"> &gt;= 15 </div>
                <div className="bg-red-100 text-red-800  p-2"> &lt;  15</div>
                <div className="bg-gray-100 text-gray-800  p-2"> 0 </div>
              </div>
              <div className="flex flex-col text-right">
                <div><button className="btn btn-success btn-xs gap-2" onClick={onRefresh}><FontAwesomeIcon icon={faRotate} />{t('refresh')}</button></div>
                <div>{t('autoUpdate')}</div>
              </div>
            </div>
            {favoriteList.length>0? favoriteList.map(item=>(<FavoriteItem item={item} onHeartClick={onHeartClick} key={item['醫事機構代碼']}/>)): <div className="text-base border border-gray-300 border-solid bg-info bg-opacity-20 p-4 gap-3 flex items-center rounded-lg">
             <FontAwesomeIcon icon={faInfoCircle} />{t('noPinned')}</div>}
             <a className="gap-2 text-base flex items-center mx-5 my-2" href={ruleI18nURL} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faArrowUpRightFromSquare}/>{t('rule')}</a>
            <div className="text-base md:p-5">
              提醒：
              <ul className='px-5'>
                <li>本地圖載入時，會載入所有販售地點再做搜尋，執行速度視您的裝置設備效能而定。</li>
              </ul>
            </div>
            <div className="flex md:px-5 gap-3">
             <button className="btn btn-black gap-2" onClick={()=>{
                window.open("https://github.com/becory/covid-19-test-kit-tw", "_blank")
              }}><FontAwesomeIcon icon={faGithub}/>Github</button>
            </div>
            
          </div>
        </SidePanel>
    )
}
