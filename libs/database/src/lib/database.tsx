/* eslint-disable-next-line */
import useGoogleSheets from 'use-google-sheets'
import { useCallback, useState } from 'react';
import csv from 'csvtojson';

export const useCityData = (sheetName?:string[])=> {
  return useGoogleSheets({
    apiKey: "AIzaSyD9CfgJJYHIR-biMjC4KsE3iO9XNBYGbFQ", 
    sheetId: '12WHdGds6jnmo2yQsO1MyaHHYDgoITYuJI3KtF3Co2mM',
    sheetsNames: sheetName
  });
}

export const useFetch = (api:any)=>{
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const run = useCallback(()=>{
    const fetchingData = async ()=>{
      setLoading(true);
      try{
        const res = await api();
        const jsonRow = await csv({
          noheader:false
        })
        .fromString(res.data)
        setError(null)
        setData(jsonRow)
      }catch(e){
        setError(e)
        setData([])
      }
      setLoading(false)
    }
    fetchingData()
  }, [])

  return {data,error,loading, run}
}
