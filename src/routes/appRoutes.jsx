import { Route, Routes } from 'react-router-dom'
import { Menu } from '../components/menu.jsx'
import { RouteList } from './routeList.jsx'

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