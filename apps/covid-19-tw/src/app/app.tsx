import { Main } from "./main";
import {Suspense} from "react";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const App = () => {
    return (<Suspense fallback="loading">
    <Main />
  </Suspense>)
}
export default App;
