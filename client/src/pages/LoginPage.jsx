import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { syncAuthFromStorage } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    try {
      // Выполняем POST запрос на авторизацию
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Ошибка входа");

      // Сохраняем токены и данные пользователя
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      syncAuthFromStorage();

      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth:'200vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <form onSubmit={handleLogin} className='col-md-4 p-4 rounded shadow-md-4'
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
        />
        <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='btn btn-primary w-100'>Войти</button>
        <button type="button" onClick={()=>navigate('/registration')} className='btn btn-outline-secondary w-100'>Регистрация</button>
      </form>
    </div>
    
  );
}