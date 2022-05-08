import { useTranslation } from "react-i18next"

export const Status = ({status, statusTime}:{status:boolean, statusTime?: any})=>{
    const {t} = useTranslation()
    if(status){
        return <div className="flex flex-col items-center border-2 border-solid border-green-600 bg-white p-1 px-2 gap-1 rounded-md w-fit whitespace-normal">
            <div className="flex items-center gap-1">
                <div className="rounded-full bg-green-600 h-3 w-3" />
                <div className="font-bold">{t('selling')}</div>
            </div>
                {statusTime&&<div>{t('update', {day:statusTime})}
                </div>}
            </div>
    }
    return <div className="flex flex-col items-center border-2 border-solid border-gray-600 bg-white p-1 px-2 gap-1 rounded-md w-fit whitespace-normal">
            <div className="flex items-center gap-1">
                <div className="rounded-full bg-gray-600 h-3 w-3" /> 
                <div className="font-bold">{t('noSale')}</div>
            </div>
                {statusTime&&<div>{t('update', {day:statusTime})}</div>}
            </div>
}