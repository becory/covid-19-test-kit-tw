import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import {useTranslation} from "react-i18next";

interface LegendProps{
  updateTime?: string;
}

export const Legend:FC<LegendProps> = (props)=> {
  const {updateTime} = props;
  const {t, i18n} = useTranslation();
  return (
  <div className='absolute z-[500] w-fit rounded-md bg-base-200 border-gray-500 border border-solid left-none right-0 bottom-4 m-3 mb-6 md:left-10 md:right-none md:bottom-0 md:mb-3 py-2 px-4'>
    <h3 className='text-lg text-bold'>{t("legend")}</h3>
    <ul className="flex gap-2">
      <li>{t("quantity")}</li>
      <li className={`text-green-600`}><FontAwesomeIcon icon={faLocationDot} /> &gt;= 50</li>
      <li className={`text-yellow-600`}><FontAwesomeIcon icon={faLocationDot} /> &gt;= 15</li>
      <li className={`text-red-700`}><FontAwesomeIcon icon={faLocationDot} /> &lt; 15</li>
      <li className={`text-gray-500`}><FontAwesomeIcon icon={faLocationDot} /> 0</li>

    </ul>
    <div>{t("fetchTime")}{updateTime}</div>
  </div>
  );
}
