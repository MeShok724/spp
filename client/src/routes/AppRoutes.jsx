import { Route, Routes } from 'react-router-dom'
import { Menu } from '../components/Menu.jsx'
import { RouteList } from './RouteList.jsx'

export const AppRoutes = () => {
    return(
        <>
            <Menu/>
            <Routes>
                <Route >{RouteList()}</Route>
            </Routes>
        </>
    )
}