import {FC, Dispatch, SetStateAction, useEffect, useRef, useState, ReactNode} from "react";
import L from 'leaflet';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faCrosshairs, faEraser, faEye} from "@fortawesome/free-solid-svg-icons";
import {useMap} from "react-leaflet";
import {useSearchParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

interface FilterProps {
  keyword: [string, Dispatch<SetStateAction<string>>];
  city: [string, Dispatch<SetStateAction<string>>];
  showEmpty: [boolean, Dispatch<SetStateAction<boolean>>];
}

interface HeaderProps {
  filter: FilterProps;
  cityList: any[];
  dataLength: number;
  emptyStoreLength: number;
  children?: ReactNode;
}



export const Header: FC<HeaderProps> = (props) => {
  const {filter, cityList, dataLength, emptyStoreLength, children} = props;
  const {
    keyword: keywordState,
    city: cityState,
    showEmpty: showEmptyState
  } = filter;
  const [keyword, setKeyword] = keywordState;
  const [city, setCity] = cityState;
  const [showEmpty, setShowEmpty] = showEmptyState;
  const [, setSearchParams] = useSearchParams();
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const divRef = useRef<HTMLDivElement>(null)
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (divRef && divRef.current) {
      L.DomEvent.disableClickPropagation(divRef.current)
      L.DomEvent.disableScrollPropagation(divRef.current)
    }
  }, [divRef])

  const changeLanguage = (lang:string)=>{
    i18n.changeLanguage(lang)
  }

  const GetCurrentLocationBtn = () => {
    const map = useMap()
    const handleLocate = (event: any) => {
      event.stopPropagation()
      map.locate()
    }
    return <button className='btn btn-xs btn-primary gap-2' onClick={handleLocate}>
      <FontAwesomeIcon icon={faCrosshairs}/>{t('myLocation')}
    </button>
  }

  return (
    <div ref={divRef}
         className="absolute z-[600] top-0 bg-base-100 border-base-300 border border-solid rounded-md m-3 py-2 px-4 shadow-md flex flex-col gap-1">
      <h1 className="text-xl font-bold select-none text-base-content py-1">{t('title')}</h1>
      <div className="btn-group">
        <button className={["btn btn-xs", (i18n.language==='zh'||i18n.language==='zh-TW')&&'btn-active'].join(' ')} onClick={()=>changeLanguage('zh')}>中文</button>
        <button className={["btn btn-xs", i18n.language==='en'&&'btn-active'].join(' ')} onClick={()=>changeLanguage('en')}>English</button>
      </div>
      <div className="gap-1 flex text-base">
        <div><FontAwesomeIcon icon={faEye}/></div>
        <div>
          {t('nowDisplay', {dataLength: dataLength, soldOut: emptyStoreLength})}
        </div>
      </div>
      <div className="gap-1 flex text-base">
        <div><input type="checkbox" checked={showEmpty} onChange={(e)=>setShowEmpty(e.target.checked)} className="checkbox checkbox-primary checkbox-sm" /></div>
        <div>
          {t('displaySoldOut')}
        </div>
      </div>
      <div className="w-full flex justify-between text-xs">
        <button className="btn btn-xs btn-info gap-2" onClick={() => {
          setOpenFilter((prev) => !prev)
        }}><FontAwesomeIcon icon={faFilter}/>{t('filter')}
        </button>
        <GetCurrentLocationBtn/>
      </div>
      {openFilter ? (<div className="flex flex-col gap-2">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">{t("keyword")}</span>
          </label>
          <input className="input input-primary input-sm" value={keyword} onChange={(e: any) => {
            setKeyword(e.target.value)
          }}/>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">{t('city')}</span>
          </label>
          {(<select value={city} onChange={(e: any) => {
            setKeyword(e.target.value)
            setCity(e.target.value)
          }} className="select select-primary select-sm max-w-xs">
            {cityList?.map((item, index) => <option value={item['city']} key={index}>{item['city']}{item['city_en']&&` - ${item['city_en']}`}</option>)}
          </select>)}
        </div>
        <div className="form-control">
          <button className='btn btn-error btn-sm' onClick={() => {
            setKeyword('')
            setSearchParams({}, {replace: true})
          }}><FontAwesomeIcon icon={faEraser}/> {t('resetFilter')}
          </button>
        </div>
      </div>) : ((keyword || city ) && (<div className="alert alert-warning alert-sm">
        <div>
          <FontAwesomeIcon icon={faFilter}/>
          <b>{t('filter')}</b>
          <div>
            <div>{keyword && `${t('keyword')}${keyword}`}</div>
            <div>{city && `${t('city')}${city}`}</div>
          </div>
        </div>
        <button className='btn btn-error btn-xs' onClick={() => {
          setKeyword('')
          setCity('')
          setSearchParams({}, {replace: true})
        }}><FontAwesomeIcon icon={faEraser}/>{t('resetFilter')}
        </button>
      </div>))}
      {children}
    </div>)
}
