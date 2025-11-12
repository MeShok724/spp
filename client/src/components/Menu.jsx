import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function Menu(){
    const navigate = useNavigate();
    const { currentUser, logout } = useAppContext();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <header className="header fixed-top bg-light p-3 shadow-sm" style={{ height: '60px' }}>
            <div className="container d-flex justify-content-between align-items-center">
                <nav>
                    <ul className="d-flex list-unstyled mb-0 gap-5">
                        <li className="mx-2"><Link to={'/'}>Главная</Link></li>
                        <li className="mx-2"><Link to={'/projects'}>Проекты</Link></li>
                        <li className="mx-2"><Link to={'/profile'}>Профиль</Link></li>
                    </ul>
                </nav>
                <div className="d-flex align-items-center gap-3">
                    {currentUser && (
                        <span className="text-muted small mb-0">{currentUser.login}</span>
                    )}
                    {currentUser ? (
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                            Выйти
                        </button>
                    ) : (
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleLogin}>
                            Войти
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}