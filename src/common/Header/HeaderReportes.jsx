import { CLink } from "../CLink/CLink";

export const HeaderReportes = () => (
    <ul className="navbar-nav">
            <div className="btn-group">
                <button
                    type="button"
                    className="c-link nav-link dropdown-toggle color-btn-dropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Reportes
                </button>
                <ul className="dropdown-menu">
                    <li className="dropdown-item"> <CLink className="dropdown-item" path="/#" title="Historial de donaciones" /> </li>
                    <li className="dropdown-item"> <CLink className="dropdown-item" path="/#" title="Solicitudes por estado" /> </li>
                    {/* SUBMENÚ HOVER */}
                    <li><hr className="dropdown-divider" /></li>
                    <li className="dropend hover-dropdown">
                        <a href="#" className="dropdown-item dropdown-toggle item-report" data-bs-toggle="dropdown" aria-expanded="false" >
                            Inventario de bienes
                        </a>
                        <ul className="dropdown-menu">
                            <li className="dropdown-item">
                                <CLink className="dropdown-item" path="/#" title="Monetarios" />
                            </li>
                            <li className="dropdown-item">
                                <CLink className="dropdown-item" path="/#" title="Materiales" />
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </ul>
)