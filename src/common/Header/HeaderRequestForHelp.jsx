export const HeaderRequestForHelp = () => (
    <div className="navbar-nav">
        <div className="btn-group">
            <button type="button" className="item-gestion btn dropdown-toggle color-btn-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span> Solicitudes de ayuda </span>
            </button>
            <ul className="dropdown-menu">
                <li className="dropdown-item"> <CLink path="/#" title="Ver solicitudes" /> </li>
                <li className="dropdown-item"> <CLink path="/#" title="Publicar solicitud" /> </li>
                <li className="dropdown-item"> <CLink path="/#" title="Donar" /> </li>
            </ul>
        </div>
    </div>
)