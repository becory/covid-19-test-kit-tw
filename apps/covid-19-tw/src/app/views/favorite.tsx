import { Dispatch, FC, SetStateAction } from "react";
import { setColor, SidePanel } from "@covid-19-tw/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faHeart, faInfoCircle, faMapLocation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {useTranslation} from "react-i18next";
import dayjs  from "dayjs";
import { Link } from "react-router-dom";

interface FavoriteProps{
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

  return (<div className={[`bg-${color}-100`,"flex p-3 border border-solid rounded-md shadow-sm divide-black text-black"].join(" ")}>
  <div className="flex text-xl w-10 items-center align-middle">
    <p className='text-center'>{item?.[`快篩試劑截至目前結餘存貨數量`] || '0'}</p>
  </div>
  <div className={"flex grow flex-col p-2 text-ellipsis border-l-2 border-solid border-black"}>
    <p className="text-base font-bold">{item?.[`醫事機構名稱`] && <Link
                    to={`?keyword=${item?.[`醫事機構名稱`].trim()}`} className="flex" key={`keyword_${item?.[`醫事機構名稱`]}`}>{item?.[`醫事機構名稱`].trim()}</Link>}</p>
    <p className="gap-2">{item?.[`醫事機構地址`]} <button onClick={onOpenGoogleMap} className="btn btn-info gap-2 btn-xs"><FontAwesomeIcon icon={faMapLocation}/> 導航 </button>  </p>
    <a href={`tel:${item?.[`醫事機構電話`]}`}>{item?.[`醫事機構電話`]}</a>
    <p className="gap-2"><FontAwesomeIcon icon={faClock} className="text-info"/> 
             {item?.['來源資料時間']?(t('daysAgo', {day:dayjs().to(item?.['來源資料時間']), count: item?.[`快篩試劑截至目前結餘存貨數量`]})): t('soldOut')}</p>
  </div>
  <div>
  <button className="btn btn-error btn-outline gap-2" onClick={()=>onHeartClick(item['醫事機構代碼'])}><FontAwesomeIcon icon={faHeart} size="2x" className="text-red"/></button>
  </div>
  </div>)
}

export const Favorite:FC<FavoriteProps> = (props)=>{
    const {setShowDialog, favoriteState, favoriteList} = props;
    const [favorite, setFavorite] = favoriteState;
    const {t, i18n} = useTranslation();

    const onHeartClick = (id:string)=>{
      setFavorite(favorite.filter(item => {
        console.log(item !== id)
        return item !== id
      }));
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
            <div className="flex gap-2">
              <div className="py-2">{t('legend')}</div>
              <div className="bg-green-100 text-green-800 p-2"> &gt;= 50 </div>
              <div className="bg-yellow-100 text-yellow-800 p-2"> &gt;= 15 </div>
              <div className="bg-red-100 text-red-800  p-2"> &lt;  15</div>
              <div className="bg-gray-100 text-gray-800  p-2"> 0 </div>
            </div>
            {favoriteList.length>0? favoriteList.map(item=>(<FavoriteItem item={item} onHeartClick={onHeartClick} />)): <div className="text-base">{t('noPinned')}</div>}
            <div className="text-base md:p-5">
              提醒：
              <ul className='px-5'>
                <li>本地圖載入時，會載入所有販售地點再做搜尋，執行速度視您的裝置設備效能而定。</li>
              </ul>
            </div>
            <div className="flex md:p-5 gap-3">
              <button className="btn btn-black gap-2" onClick={()=>{
                window.open("https://github.com/becory/covid-19-test-kit-tw", "_blank")
              }}><FontAwesomeIcon icon={faGithub}/>Github</button>
            </div>
          </div>
        </SidePanel>
    )
}
