import { useEffect } from "react";
import { CLink } from "../CLink/CLink";
import { Dropdown } from "bootstrap";

export const HeaderSuperAdmin = () => {

    useEffect(() => {
        // SELECCIONA TODOS LOS TOGGLES DE DROPDOWN
        const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');

        dropdownToggles.forEach((toggle) => {
            // INICIALIZAR DROPDOWN CON POPPER PERSONALIZADO
            new Dropdown(toggle, {
                popperConfig: (defaultBsPopperConfig) => {
                    defaultBsPopperConfig.placement = "bottom-start"; // ubicación por defecto
                    defaultBsPopperConfig.modifiers = [
                        {
                            name: "flip",
                            options: {
                                fallbackPlacements: ["top-start", "right-start", "left-start"],
                            },
                        },
                    ];
                    return defaultBsPopperConfig;
                },
            });
        });
    }, []);

    return (
        <>
            <div className="menu-superadmin">
                <ul className="navbar-nav">
                    <li>
                        <CLink path="/dashboardSuperAdmin" title="Dashboard" />
                    </li>

                    <div className="btn-group">
                        <button type="button" className="nav-link dropdown-toggle color-btn-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span> </span>
                        </button>
                        <ul className="dropdown-menu">
                            
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="nav-link dropdown-toggle color-btn-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>  </span>
                        </button>
                        <ul className="dropdown-menu">
                            <li className="dropdown-item">
                                
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item item-gestion" href="#">Another action</a>
                            </li>
                        </ul>
                    </div>

                    <div className="dropdown">
                        <button
                            type="button"
                            className="btn nav-link dropdown-toggle color-btn-dropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            
                        </button>
                        <div className="dropdown-menu p-3 item-drop">
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        
                                    </div>
                                    <div className="col">
                                        
                                    </div>
                                    <div className="col">
                                        
                                    </div>
                                </div>
                            </div>
                            <hr className="dropdown-divider" />
                            <a className="dropdown-item" href="#">Otra acción</a>
                        </div>
                    </div>
                </ul>
            </div>
        </>
    )
}