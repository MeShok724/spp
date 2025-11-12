import { useEffect, useMemo, useState } from "react";

const formatDate = (dateString) => {
  if (!dateString) {
    return "—";
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function UserProfilePage(){
  const [user, setUser] = useState(null);
  const formattedUser = useMemo(() => {
    if (!user) {
      return null;
    }
    return {
      ...user,
      createdAtFormatted: formatDate(user.createdAt),
    };
  }, [user]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Не удалось загрузить профиль:", error);
    }
  }, []);

  if (!formattedUser) {
    return (
      <div className="container mt-5 pt-4">
        <div className="alert alert-info">
          Вы не авторизованы. <a href="/login" className="alert-link">Войдите</a>, чтобы просмотреть профиль.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 mt-5 px-5 px-md-5 px-lg-5" style={{ minHeight: '90vh', paddingLeft: '6rem', paddingRight: '6rem' }}>
      <div className="card border-0 shadow-sm mx-auto h-100" style={{ maxWidth: '960px' }}>
        <div className="card-body p-4 " style={{ height: '100%', width: '100%' }}>
          <h4 className="card-title mb-4">Профиль пользователя</h4>
          <div className="d-flex flex-column gap-4 mb-4">
            <div className="col-12 col-md-6 d-flex flex-column">
              <span className="text-muted">Логин:</span>
              <span>{formattedUser.login ?? "—"}</span>
            </div>
            <div className="col-12 col-md-6 d-flex flex-column">
              <span className="text-muted">Роль:</span>
              <span>{formattedUser.role === "admin" ? "Администратор" : "Пользователь"}</span>
            </div>
            <div className="col-12 col-md-6 d-flex flex-column">
              <span className="text-muted">Дата регистрации:</span>
              <span>{formattedUser.createdAtFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}