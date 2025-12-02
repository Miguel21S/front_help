import { CLink } from "../CLink/CLink";

export const HeaderLoginRegister = () => (
    <div className="menu-loginRegister">
        <ul className="navbar-nav">
            <li className="nav-item">
                <CLink path="/login" title={<span> Iniciar Sesion </span>} target="" />
            </li>
            <li className="nav-item">
                <CLink path="/register" title={<span> Registrarse </span>} target="_blank" />
            </li>
        </ul>
    </div>
);