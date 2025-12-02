import { CLink } from "../CLink/CLink";

export const HeaderLogoProfile = ({ userProfile, onLogout }) => (
    <div className="menu-profile">
        <div className="btn-group">
            <button type="button" className="btn btn-name" data-bs-toggle="dropdown" aria-expanded="false">
                {userProfile?.id ? userProfile.name : "Cargando..."}
            </button>
            <ul className="dropdown-menu ">
                <li className="dropdown-item item-profile">
                    <CLink path="/profilemanager" title="Datos personales"  />
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li className="dropdown-item item-profile">
                    {userProfile && (
                        <button className="item-logoutCount" onClick={onLogout} title={(userProfile && userProfile?.name) || "Cerrar sesión"}>
                            <i className="bi bi-power"></i>
                        </button>
                    )}
                </li>
            </ul>
        </div>
    </div>
);