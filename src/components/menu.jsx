import { Link } from 'react-router-dom'

export function Menu(){
    return (<nav>
        <ul className="d-flex list-unstyled p-3 fixed-top justify-content-center">
            <li className="mx-2"><Link to={'/'}>Главная</Link></li>
            <li className="mx-2"><Link to={'/projects'}>Проекты</Link></li>
            <li className="mx-2"><Link to={'/profile'}>Профиль</Link></li>
        </ul>
    </nav>)
}