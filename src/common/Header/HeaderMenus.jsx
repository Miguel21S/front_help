import { CLink } from "../CLink/CLink";

export const HeaderMenus = () => (
    <ul className="navbar-nav">
        <li className="nav-item">
            <CLink path="/#" title="Inicio" />
        </li>
        <li className="nav-item">
            {/* <CLink path="/#" title="Donar" /> */}
            <div className="dropdown">
                <button
                    type="button"
                    className="c-link btn nav-link dropdown-toggle color-btn-dropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Solicitudes de ayuda
                </button>
                <div className="dropdown-menu p-3 item-drop">
                    {/* <div className="dropdown-item p-0"> */}
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <CLink className="dropdown-item" path="/#" title="Solicitudes de donación" />
                                <CLink className="dropdown-item" path="/#" title="Solicitudes por categoría" />
                            </div>
                            <div className="col">
                                <CLink className="dropdown-item" path="/#" title="Publicar solicitud de donación" />
                            </div>
                            {/* <div className="col">
                                <CLink className="dropdown-item" path="/housingmanager" title="Viviendas" />
                            </div> */}
                        </div>
                    </div>
                    {/* </div> */}
                    <hr className="dropdown-divider" />
                    <a className="dropdown-item" href="#">Otra acción</a>
                </div>
            </div>
        </li>
    </ul>
);