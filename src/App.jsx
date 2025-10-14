import 'bootstrap/dist/css/bootstrap.min.css'
import { Menu } from './components/menu'
import { MainPage } from './pages/mainPage'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/appRoutes'
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
