import { useSelector } from "react-redux"
import { userData } from "../../app/slices/userSlice"
import { jwtDecode } from "jwt-decode";
import { HeaderMenus } from "./HeaderMenus";
import { HeaderNews } from "./HeaderNews";
import { HeaderSuperAdmin } from "./HeaderSuperAdmin";
import { HeaderReportes } from "./HeaderReportes";
import { HeaderLoginRegister } from "./HeaderLoginRegister";

export const HeaderAdmins = () => {
    const token = useSelector(userData).credentials.token || null;
    const decodificado = jwtDecode(token);

    return (
        <>
            <div className="headerAdminsDesign">
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {
                                token ? (
                                    <>
                                        {decodificado.roleName === 'superAdmin' && (
                                            <>
                                                <HeaderMenus />
                                                <HeaderNews />
                                                <HeaderSuperAdmin />
                                                <HeaderReportes />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <HeaderMenus />
                                        <HeaderLoginRegister />
                                    </>
                                )
                            }
                        </div>
                    </div>
                </nav>
            </div></>
    )
}