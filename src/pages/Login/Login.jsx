
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { jwtDecode } from 'jwt-decode'

import "./Login.css"
import { useState } from "react";
import { auth } from "../../services/root";

import { loginUser } from "../../app/slices/userSlice";

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [errorMessage, setErrorMessage] = useState();

    const [credentialsUser, setCredentialsUser] = useState({
        email: "",
        password: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    const inputHeadler = (e) => {
        const {name, value} = e.target
        setCredentialsUser(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const LoginU = async () => {
        setErrorMessage("")

        if (!credentialsUser.email || !credentialsUser.password) {
            setErrorMessage("Debes completar todos los campos")
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentialsUser.email)) {
            setErrorMessage("Por favor, introduce un email válido.");
            return;
        }

        if (!navigator.onLine) {
            setErrorMessage("No tienes conexión a Internet. Verifica tu red e intenta de nuevo.");
            return;
        }

        try {
            setIsLoading(true)
            const response = await auth.rootLogin(credentialsUser);

            if (response.token) {
                const decodificado = jwtDecode(response.token)
                const passaport = {
                    token: response.token,
                    user: decodificado
                }

                dispatch(loginUser({ credentials: passaport }))
                if (decodificado.roleName === 'superAdmin') {
                    setTimeout(() => {
                        setIsLoading(false)
                        navigate("/dashboardSuperAdmin")
                    }, 3000);
                } else {
                    setTimeout(() => {
                        setIsLoading(false)
                        navigate("/")
                    }, 3000);
                }
            }

        } catch (error) {
            if (error.message === "Failed to execute 'json' on 'Response': body stream already read") {
                setErrorMessage("Credenciales incorrectas.");
            } else if (error.message === "Failed to fetch") {
                setErrorMessage("No se pudo conectar al servidor. Verifica tu conexión a Internet.");
            } else {
                setErrorMessage(error.message || "Ocurrió un error inesperado.");
            }
            setIsLoading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        LoginU()
    }
    return (
        <>
            <div className="designLogin">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div style={{ color: "#fff", marginLeft: "10px" }}>Bienvenido...</div>
                    </div>
                )}

                <div className="containerLogin">
                    <form onSubmit={handleSubmit}>
                        <input
                            className='form-control'
                            name="email"
                            type='email'
                            placeholder='Email'
                            value={credentialsUser.email || ""}
                            onChange={inputHeadler}
                        />
                        <input
                            className='form-control'
                            name="password"
                            type='password'
                            placeholder='Password'
                            value={credentialsUser.password || ""}
                            onChange={inputHeadler}
                        />

                        {errorMessage && <div className="alert alert-danger ">{errorMessage}</div>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary btnLogin"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}