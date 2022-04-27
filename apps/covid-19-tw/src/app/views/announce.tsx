import { Dispatch, FC, SetStateAction } from "react";
import { SidePanel } from "@covid-19-tw/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {useTranslation} from "react-i18next";

interface AnnounceProps{
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export const Announce:FC<AnnounceProps> = (props)=>{
    const {setShowDialog} = props;
    const {t, i18n} = useTranslation();

    return (
        <SidePanel
              header={<div className='flex gap-1'><div><FontAwesomeIcon icon={faInfoCircle} /></div><div>{t('announcement')}</div></div>}
              right={
                <button onClick={(e)=>{
                  e.stopPropagation();
                  setShowDialog(false)
                  }}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                }
          >
          <div className='flex flex-col gap-5 md:divide-y-2'>
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
