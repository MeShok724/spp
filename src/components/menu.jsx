import { Link } from 'react-router-dom'

export function Menu(){
    return (<header className="header fixed-top bg-light p-3" style={{ height: '60px' }}>
        <ul className="d-flex list-unstyled mb-0 justify-content-center">
            <li className="mx-2"><Link to={'/'}>Главная</Link></li>
            <li className="mx-2"><Link to={'/projects'}>Проекты</Link></li>
            <li className="mx-2"><Link to={'/profile'}>Профиль</Link></li>
        </ul>
    </header>)
}