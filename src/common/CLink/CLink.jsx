import { useNavigate } from "react-router-dom";

export const CLink = (path, title, target) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        if(target === "_blank"){
            window.open(path, '_blank', 'noopener,noreferrer');
        } else{
            navigate(path)
        }
    }
    return(
        <div className="designCLink" onClick={handleNavigation}>
            {title}
        </div>

    )
}