import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {SidePanel} from "@covid-19-tw/ui";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBug,
  faClock,
  faDatabase,
  faMapLocation,
  faQuestionCircle,
  faTriangleExclamation,
  faXmark,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Line} from 'react-chartjs-2'
import dayjs from "dayjs";

interface DetailProps {
  detail: any;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  cityList: any[];
}

export const Detail: FC<DetailProps> = (props) => {
  const {detail, setShowDialog, cityList} = props;
  const [lang, setLang] = useState<string | null>(null);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (i18n.language === "zh" || i18n.language === "zh-TW") {
      setLang("")
    } else {
      setLang("_en")
    }
  }, [i18n.language])

  //(?<zipcode>(^\d{5}|^\d{3})?)(?<city>\D+[縣市])(?<district>\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)
  const address = detail['醫事機構地址'].trim().split(/(?<zipcode>(^\d{5}|^\d{3})?)(?<city>\D+[縣市])(?<district>\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)/).filter((item:any)=>item)
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
          <div className="text-base font-bold p-3">
            <FontAwesomeIcon icon={faClock}
                             className="text-color-info"/> {t('daysAgo', {day:dayjs().to(detail['來源資料時間'])})}
          </div>
          <div className="flex flex-col p-5 gap-2">
            <div className="text-xs text-right">
              <FontAwesomeIcon icon={faDatabase}/> {t("source")}<a href="https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698"
                                                                   target="_blank" rel="noreferrer">{t('NHI')}</a>
            </div>
            <div className="text-base grid grid-cols-2 gap-2">
              <div><b>{t('storeName')}</b>
                <div className='break-words ml-4'>
                  {detail[`醫事機構名稱`] && <Link
                    to={`?keyword=${detail[`醫事機構名稱`].trim()}`} className="flex" key={`keyword_${detail[`醫事機構名稱`]}`}>{detail[`醫事機構名稱`].trim()}</Link>}</div>
              </div>
              <div><b>{t("telephone")}</b>
                <div className='break-words ml-4'>
                <a href={`tel:${detail[`醫事機構電話`]}`}>{detail[`醫事機構電話`]}</a></div>
              </div>
              <div><b>{t('storeNo')}</b>
                <div className='ml-4 flex flex-wrap gap-1'>
                  {detail['醫事機構代碼']}
                  </div>
              </div>
              <div className='col-span-2'><b>{t("address")}</b>
                <div className='break-words ml-4'>
                  {detail[`醫事機構地址`]&& (<Link 
                    to={`?keyword=${address[0].trim()}${address[1].trim()}`} key={`address`}>{address[0].trim()}{address[1].trim()}</Link>)}{address[3].trim()}</div>
              </div>
              
              <div className='col-span-2'><b>{t("brands")}</b>
                <div className='break-words ml-4'>{detail[`廠牌項目`]}</div>
              </div>
              <div className='col-span-2'><b>{t("quantity")}</b>
                <div className='break-words ml-4'>{detail[`快篩試劑截至目前結餘存貨數量`]}</div>
              </div>
              {detail[`備註`] && <div className='col-span-2'><b>{t("remark")}</b>
                <div className='break-words ml-4'>{detail[`備註`]}</div>
              </div>}
              <div className='col-span-2'><b>{t("updateTime")}</b>
                <div className='break-words ml-4'>{detail['來源資料時間'].format('YYYY-MM-DD HH:mm')}</div>
              </div>
              <div><b>{t("latitude")}</b>
                <div className='break-words ml-4'>{detail['緯度']}</div>
              </div>
              <div><b>{t("longitude")}</b>
                <div className='break-words ml-4'>{detail['經度']}</div>
              </div>
              {detail.announce && (<div><b>{t('announceDate')}</b>
                <div className='break-words ml-4'><Link
                  to={`?announce=${detail?.announce.trim().replaceAll('/', '-')}`}>{detail?.announce.trim()}</Link>
                </div>
              </div>)}
              {detail.city && detail.city_en && (<div><b>{t('city')}</b>
                <div className='break-words ml-4'><Link
                  to={`?city=${lang ? (detail?.city_en.trim()) : (detail?.city.trim())}`}>
                  {lang ? (detail?.city_en.trim()) : (detail?.city.trim())}</Link></div>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </SidePanel>
  )
}
