import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Очистка токена авторизации
        navigate('/'); // Перенаправление на страницу логина
    };

    return (
        <div className='logout_button section_button ' onClick={handleLogout}><div className='logout_button_text'>Выйти</div></div>
    );
};

export default LogoutButton;