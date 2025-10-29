import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export const RegistrationPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Ошибка регистрации");

      // сохраняем токены и данные пользователя
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Успешная регистрация!");
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
        <form onSubmit={handleLogin} className='col-md-4 p-4 rounded shadow'
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
            <button type="submit" className='btn btn-primary w-100'>Регистрация</button>
            <button type="button" onClick={()=>navigate('/login')} className='btn btn-outline-secondary w-100'>Вход</button>
        </form>
    </div>
  );
}