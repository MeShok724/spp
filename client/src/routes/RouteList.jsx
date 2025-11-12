import { Route } from 'react-router-dom'
import { MainPage } from '../pages/MainPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { UserProfilePage } from '../pages/UserProfilePage'
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage'
import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'

export const RouteList = () => {
	return (
		<>
			<Route path='/' element={<MainPage />} />
			<Route path='/projects' element={<ProjectsPage />} />
            <Route path='/projects/:id' element={<ProjectDetailsPage />} />
			<Route path='/profile' element={<UserProfilePage />} />
			<Route path='/registration' element={<RegistrationPage />} />
			<Route path='/login' element={<LoginPage />} />
		</>
	)
}