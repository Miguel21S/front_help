import { useEffect } from "react";
import { Dropdown } from "bootstrap";
import { CLink } from "../CLink/CLink";

export const HeaderSuperAdmin = () => {
    useEffect(() => {
        const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');

        dropdownToggles.forEach((toggle) => {
            new Dropdown(toggle, {
                popperConfig: (defaultConfig) => {
                    defaultConfig.placement = "bottom-start";
                    defaultConfig.modifiers = [
                        {
                            name: "flip",
                            options: {
                                fallbackPlacements: ["top-start", "right-start", "left-start"],
                            },
                        },
                    ];
                    return defaultConfig;
                },
            });
        });
    }, []);

    return (
        <div className="menu-superadmin">
            <ul className="navbar-nav">

                <li className="nav-item">
                    <CLink path="/dashboardSuperAdmin" title="Dashboard" />
                </li>

                <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle color-btn-dropdown"
                            data-bs-toggle="dropdown">
                        Gestión de donaciones
                    </button>
                    <ul className="dropdown-menu">
                        <li><CLink className="dropdown-item" path="/#" title="donaciones" /></li>
                        <li><CLink className="dropdown-item" path="/#" title="Asociarlas con solicitudes" /></li>
                    </ul>
                </li>

                <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle color-btn-dropdown"
                            data-bs-toggle="dropdown">
                        Gestión de Contenido
                    </button>
                    <ul className="dropdown-menu">
                        <li><CLink className="dropdown-item" path="/" title="Solicitudes" /></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Otra acción</a></li>
                    </ul>
                </li>

                <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle color-btn-dropdown"
                            data-bs-toggle="dropdown">
                        Gestión de Bienes
                    </button>

                    <div className="dropdown-menu p-3 item-drop">
                        <div className="row">
                            <div className="col">
                                <CLink className="dropdown-item" path="/usersmanager" title="Usuarios" />
                                <CLink className="dropdown-item" path="/buildingsmanager" title="Edificios" />
                                <CLink className="dropdown-item" path="/newsmanager" title="Noticias" />
                            </div>
                            <div className="col">
                                <CLink className="dropdown-item" path="/diseasesmanager" title="Enfermedades" />
                                <CLink className="dropdown-item" path="/housingmanager" title="Viviendas" />
                            </div>
                            <div className="col">
                                <CLink className="dropdown-item" path="/mascotsmanager" title="Mascotas" />
                                <CLink className="dropdown-item" path="/carsmanager" title="Coches" />
                            </div>
                        </div>

                        <hr className="dropdown-divider" />
                        <a className="dropdown-item" href="#">Otra acción</a>
                    </div>
                </li>

            </ul>
        </div>
    );
};
