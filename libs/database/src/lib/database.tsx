/* eslint-disable-next-line */
import useGoogleSheets from 'use-google-sheets'
import { useCallback, useState } from 'react';

export const useCityData = (sheetName?:string[])=> {
  return useGoogleSheets({
    apiKey: "AIzaSyD9CfgJJYHIR-biMjC4KsE3iO9XNBYGbFQ", 
    sheetId: '12WHdGds6jnmo2yQsO1MyaHHYDgoITYuJI3KtF3Co2mM',
    sheetsNames: sheetName
  });
}

export const useFetch = (api:any)=>{
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const run = useCallback(()=>{
    const fetchingData = async ()=>{
      setLoading(true);
      try{
        const res = await api();
        setError(null)
        setData(res.data)
      }catch(e){
        setError(e)
        setData(null)
      }
      setLoading(false)
    }
    fetchingData()
  }, [])

  return {data,error,loading, run}
}
