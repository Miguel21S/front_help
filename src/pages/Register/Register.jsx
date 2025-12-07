
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Register.css'
import { auth, users } from '../../services/root';
import Swal from 'sweetalert2';

///////////////////   Reglas de validación de contraseña
const passwordRules = {
    lower: /[a-z]/,
    upper: /[A-Z]/,
    number: /\d/,
    symbol: /[.@$!%*?&]/,
    length: /.{8,}/
};

///////////////////   Esquema de validación con Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Debe tener al menos 3 caracteres")
        .required("Por favor, debes rellenar este campo."),
    lastName: Yup.string()
        .min(3, "Debe tener al menos 3 caracteres")
        .required("Por favor, debes rellenar este campo"),
    gender: Yup.string().required("Por favor, debes rellenar este campo"),
    email: Yup.string()
        .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, "Formato de email inválido, ejemplo de email (example@gmail.com)")
        .required("Por favor, debes rellenar este campo"),

    password: Yup.string()
        .matches(passwordRules.lower, 'La contraseña debe contener al menos una letra minúscula')
        .matches(passwordRules.upper, 'La contraseña debe contener al menos una letra mayúscula')
        .matches(passwordRules.number, 'La contraseña debe contener al menos un número')
        .matches(passwordRules.symbol, 'La contraseña debe contener al menos un símbolo (@$!%*?&)')
        .matches(passwordRules.length, 'La contraseña debe tener al menos 8 caracteres')
        .required('La contraseña es obligatoria'),

    comparePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
        .required("Por favor, debes rellenar este campo"),
});

//////////////////   Función para evaluar la fortaleza de la contraseña
const getPassStrength = (password) => {
    let score = 0;
    if (passwordRules.lower.test(password)) score++;
    if (passwordRules.upper.test(password)) score++;
    if (passwordRules.number.test(password)) score++;
    if (passwordRules.symbol.test(password)) score++;
    if (passwordRules.length.test(password)) score++;
    if (score <= 2) return { label: "Débil", color: "red" };
    if (score === 3 || score === 4) return { label: "Media", color: "orange" };
    return { label: "Fuerte", color: "green" };
}

export const Register = () => {
    const navigate = useNavigate();

    // const [errorMessage, setErrorMessage] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(null);


    const genderes = [
        { label: "Masculino", value: "Male" },
        { label: "Female", value: "Female" },
    ]

    const formik = useFormik({
        initialValues: {
            name: "",
            lastName: "",
            gender: "",
            email: "",
            password: "",
            comparePassword: "",
        },
        validationSchema: validationSchema,
        validateOnChange: true,
        validateOnBlur: true,

        onSubmit: async (values) => {
            try {

                if (!navigator.onLine) {
                    Swal.fire("Error", "No tienes conexión a Internet. Verifica tu red e intenta de nuevo.");
                    return;
                }

                const compareEmail = await users.rootCompareEmail(values.email);
                if(compareEmail){
                    Swal.fire("Error", "Este correo ya está registrado.", "error")
                    return;
                }
                
                const userRegister = await auth.rootRegister(values);
                if (userRegister.success) {
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000);
                } else {
                    Swal.fire("Error", userRegister.message || "Registro fallido", "error");
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error', title: 'Error',
                    text: error.message || 'Hubo un error en el registro. Por favor, intenta de nuevo.',
                });

            }
        }

    })

    return (
        <>
            <div className='designResister'>
                <form className='formRegister' onSubmit={formik.handleSubmit}>

                    <label>Nombre</label>
                    <input
                        name="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="error">{formik.errors.name}</p>
                    )}

                    <label>Apellido</label>
                    <input
                        name="lastName"
                        type="text"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                        <p className="error">{formik.errors.lastName}</p>
                    )}

                    <label>Género</label>
                    <select
                        value={formik.values.gender}
                        name="gender"
                        onChange={formik.handleChange}
                        options={genderes}
                        onBlur={formik.handleBlur}
                        className='register-select'
                    >
                        <option value="" disabled>Seleccione género</option>
                        {genderes.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                        <p className="error">{formik.errors.gender}</p>
                    )}

                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="error">{formik.errors.email}</p>
                    )}

                    <label>Contraseña</label>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        onChange={(e) => {
                            formik.setFieldValue("password", e.target.value);
                            setPasswordStrength(getPassStrength(e.target.value));
                        }}
                        onBlur={formik.handleBlur}
                    />

                    <button
                        type="button"
                        style={{ marginLeft: "6px" }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                        <p className="error">{formik.errors.password}</p>
                    )}

                    {/* INDICADOR DE FUERZA */}
                    {passwordStrength && (
                        <p style={{ color: passwordStrength.color }}>
                            Fuerza: {passwordStrength.label}
                        </p>
                    )}

                    {/* ---------------- CONFIRM PASSWORD ---------------- */}
                    <label>Confirmar contraseña</label>
                    <input
                        name="comparePassword"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.comparePassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.comparePassword && formik.errors.comparePassword && (
                        <p className="error">{formik.errors.comparePassword}</p>
                    )}

                    <button
                        type="submit"
                        style={{ marginTop: "10px" }}>
                        Registrarse
                    </button>
                </form >
            </div >
        </>
    )
}
