import './Header.css';
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { HeaderMenus } from "./HeaderMenus";
import { HeaderLoginRegister } from "./HeaderLoginRegister";
import { userData } from "../../app/slices/userSlice";
import { HeaderNews } from "./HeaderNews";
import { HeaderSuperAdmin } from './HeaderSuperAdmin';

export const Header = () => {
    const token = useSelector(userData).credentials.token || null;
    const decodificado = jwtDecode(token);

    return (
        <>
            <div className="headerDesign">
                <div className="header">
                    <h3>¡AYUDAME!</h3>
                    <p><strong>Un lugar para la solidaridad y la esperanza.</strong> Únete a nosotros para brindar apoyo a quienes lo necesitan.</p>
                    <p>Juntos, podemos cambiar vidas.</p>
                </div>

                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {token ?
                                (
                                    <>
                                        {
                                            decodificado.roleName === 'user' && (
                                                <>
                                                    <HeaderMenus />
                                                    <HeaderNews />
                                                </>
                                            )

                                        }
                                    </>
                                ) : (<>
                                    <HeaderMenus />
                                    <HeaderLoginRegister />
                                </>)
                            }
                        </div>
                    </div>
                </nav>
            </div></>
    )
}