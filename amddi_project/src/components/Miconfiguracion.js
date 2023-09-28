import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Miconfiguracion.css';

export default function Miconfiguracion() {
    const location = useLocation();
    const [servicio, setServicio] = useState("");
    const [currentUser, setCurrentUser] = useState({});
    // const [localUser, setLocalUser] = useState(loadUserFromLocalStorage() || user);
    // console.log("holaxdd::::", currentUser)

    useEffect(() => {
        window.scrollTo(0, 0);

        // Obtener el token del localStorage
        const token = localStorage.getItem('token_user');

        // Verificar si el token existe
        if (token) {
            // Si el token existe, realiza una solicitud al servidor para obtener los datos del usuario
            axios.get('http://localhost:5000/usuario', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    // console.log("hola")
                    // console.log("hola",response.data.content);
                    setCurrentUser(response.data.content); // Almacena los datos del usuario en el estado
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [location]);

    // useEffect(() => {
    //     // Al cargar el componente Subheader, verifica si hay datos de usuario en localStorage y si no, intenta recuperarlos.
    //     const storedUser = JSON.parse(localStorage.getItem('user'));
    //     if (storedUser) {
    //         setCurrentUser(storedUser);
    //     }
    //     // console.log("holaaaaaaxd", storedUser);
    // }, []);

    const email = currentUser.email;
    // console.log("email", email);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseUsuario = await axios.get(`http://localhost:5000/servicio_por_email/${email}`);

                if (responseUsuario.status === 200) {
                    // console.log(responseUsuario.data.content);
                    setServicio(responseUsuario.data.content);
                }
            } catch (error) {
                // console.error("Error al buscar el usuario:", error.response?.data?.message || "Error desconocido");
            }
        }

        fetchData(); // Llama a la función asíncrona
    }, [email])

    const [formData, setFormData] = useState({
        nombre: "",
        apePat: "",
        apeMat: "",
        dni: "",
        carrera: "",
        pais: "",
        departamento: "",
        pwd_hash: "",
    });

    useEffect(() => {
        setFormData({
            nombre: currentUser?.nombre || "",
            apePat: currentUser?.apePat || "",
            apeMat: currentUser?.apeMat || "",
            dni: currentUser?.dni || "",
            carrera: currentUser?.carrera || "",
            pais: currentUser?.pais || "",
            departamento: currentUser?.departamento || "",
            pwd_hash: "",
        });
    }, [currentUser]);

    // console.log(formData);

    const [isEditable, setIsEditable] = useState(false);
    // console.log(isEditable);

    const handleActualizarClick = () => {
        setIsEditable(true);
    };

    const handleVolverClick = () => {
        setIsEditable(false);
        window.location.reload();
    };

    const handleInputChange = (e) => {
        if (isEditable) {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("entro aquì", formData);
        console.log(currentUser.id);
        try {
            const response = await axios.put(`http://localhost:5000/usuarios/${currentUser.id}`, formData);

            if (response.status === 201) {
                // Actualizar currentUser con los nuevos datos
                console.log("hola", formData);
                localStorage.setItem('user', JSON.stringify({ ...currentUser, ...formData }));
                setCurrentUser({ ...currentUser, ...formData });
                console.log("entro aquì");
                // Actualizar el usuario en el localStorage
                window.location.reload();
                setIsEditable(false); // Desactivar la edición
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error.response?.data?.message || "Error desconocido");
        }
    };

    return (
        <section className="miconfiguracion_container">
            <h3>CONFIGURACIÓN</h3>
            <h4>Información <span><strong>Personal</strong></span></h4>
            <p>Actualiza tus datos personales:</p>
            <form className="form_info" onSubmit={handleSubmit}>
                <input
                    className="input_config"
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                />
                <input
                    className="input_config"
                    type="text"
                    name="apePat"
                    placeholder="Apellido Paterno"
                    value={formData.apePat}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                />
                <input
                    className="input_config"
                    type="text"
                    name="apeMat"
                    placeholder="Apellido Materno"
                    value={formData.apeMat}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                />
                <input
                    className="input_config"
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={formData.dni}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                />
                <input
                    className="input_config"
                    type="text"
                    name="carrera"
                    placeholder="Carrera"
                    value={formData.carrera}
                    onChange={handleInputChange}
                    readOnly={true}
                />
                <input
                    className="input_config"
                    type="text"
                    name="pais"
                    placeholder="País"
                    value={formData.pais}
                    onChange={handleInputChange}
                    readOnly={true}
                />
                <input
                    className="input_config"
                    type="text"
                    name="departamento"
                    placeholder="Departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    readOnly={true}
                />
                <input className="input_config"
                    type="text"
                    placeholder="Mi Servicio"
                    value={servicio.nombre_servicio}
                    onChange={handleInputChange}
                    readOnly={true}
                />
                <input
                    className="input_config"
                    type="password"
                    name="pwd_hash"
                    placeholder="Contraseña"
                    value={formData.pwd_hash}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                />
                {!isEditable && ( // Mostrar el botón "Editar datos" si no se está editando
                    <button onClick={handleActualizarClick} className="button_config">
                        Editar datos
                    </button>
                )}
                {isEditable && ( // Mostrar el botón "Guardar cambios" si se está editando
                    <div className="btn_container_config">
                        <button className="button_config" type="button" onClick={handleVolverClick}>
                            Cancelar
                        </button>
                        <button className="button_config" type="submit">
                            Guardar cambios
                        </button>
                    </div>
                )}
            </form>
        </section>

    );
}