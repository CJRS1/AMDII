import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import axios from 'axios';

import '../styles/Subheader.css';

export default function Subheader({ user, setUser }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(user);
    // console.log("hola::::",currentUser)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        // Al cargar el componente Subheader, verifica si hay datos de usuario en localStorage y si no, intenta recuperarlos.
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setCurrentUser(storedUser);
        }
        // console.log("holaaaaaa",storedUser);
    }, []);

    const handleLogout = async () => {
        try {
            // Realiza una solicitud POST para cerrar sesión
            await axios.post('http://localhost:5000/logout');
            sessionStorage.removeItem('user');
            // Después de cerrar sesión con éxito, redirige al usuario a la página de inicio de sesión
            localStorage.removeItem('user');
            setCurrentUser(null);
            setUser(null);
            navigate({ pathname: "/" });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    return (
        <section className="subheader_container">
            <div className="subheader-content">

                {!currentUser ? (
                    <>
                        <Link to="/login" className="zoom-header inicio">Iniciar sesión </Link>
                        <Link to="/registrarse" className="zoom-header">Registrarse </Link>
                    </>
                ) : (
                    <div className="dropdown dropdown_user">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {`${currentUser.nombre} ${currentUser.apePat}`}
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link to="/miconfiguracion" className="dropdown-item">Mi Información</Link></li>
                            <li><Link to="/miproyecto" className="dropdown-item">Mi Proyecto</Link></li>
                            <li><button onClick={handleLogout} className="dropdown-item">Cerrar Sesión</button></li>
                        </ul>
                    </div>
                )}


            </div>
        </section>

    );
}