import { useNavigate } from "react-router-dom";
import './CLink.css';

export const CLink = ({ path = "#", title, target, className = "" }) => {
    const navigate = useNavigate();

    const handleNavigation = (e) => {
        if (target === "_blank") return;

        e.preventDefault();
        navigate(path);
    };
    return target === "_blank" ?
        (
            <a href={path} target="_blank" rel="noopener noreferrer" className={`c-link ${className}`}>
                {title}
            </a>
        ) : (
            <a href={path} onClick={handleNavigation} className={`c-link ${className}`}>
                {title}
            </a>
        );
}