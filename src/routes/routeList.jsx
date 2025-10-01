import { Route } from 'react-router-dom'
import { MainPage } from '../pages/mainPage'
import { ProjectsPage } from '../pages/projectsPage'
import { UserProfilePage } from '../pages/userProfilePage'
import { ProjectDetailsPaje } from '../pages/projectDetailPage'

export const RouteList = () => {
	return (
		<>
			<Route path='/' element={<MainPage />} />
			<Route path='/projects' element={<ProjectsPage />} />
            <Route path='/projects/:id' element={<ProjectDetailsPaje />} />
			<Route path='/profile' element={<UserProfilePage />} />
		</>
	)
}