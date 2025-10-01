import 'bootstrap/dist/css/bootstrap.min.css'
import { Menu } from './components/menu'
import { MainPage } from './pages/mainPage'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/appRoutes'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App
