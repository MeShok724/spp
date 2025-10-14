import { Route } from 'react-router-dom'
import { MainPage } from '../pages/mainPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { UserProfilePage } from '../pages/userProfilePage'
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage'

export const RouteList = () => {
	return (
		<>
			<Route path='/' element={<MainPage />} />
			<Route path='/projects' element={<ProjectsPage />} />
            <Route path='/projects/:id' element={<ProjectDetailsPage />} />
			<Route path='/profile' element={<UserProfilePage />} />
		</>
	)
}