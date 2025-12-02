import { CLink } from "../CLink/CLink";

export const HeaderNews = () => (
    <div className="navbar-nav">
        <div className="btn-group">
            <button type="button" className="item-gestion btn dropdown-toggle color-btn-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span> Noticias </span>
            </button>
            <ul className="dropdown-menu">
                <li className="dropdown-item"> <CLink path="/#" title="Ver todas" /> </li>
                <li className="dropdown-item">  <CLink path="/#" title="Noticias destacadas" /> </li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item item-news" href="#">Separated link</a></li>
            </ul>
        </div>
    </div>
)