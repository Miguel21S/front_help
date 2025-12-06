import { useSelector } from "react-redux"
import { userData } from "../../app/slices/userSlice"
import { jwtDecode } from "jwt-decode";
import { HeaderMenus } from "./HeaderMenus";
import { HeaderNews } from "./HeaderNews";
import { HeaderSuperAdmin } from "./HeaderSuperAdmin";
import { HeaderReportes } from "./HeaderReportes";
import { HeaderLoginRegister } from "./HeaderLoginRegister";
import { useEffect } from "react";
import { Dropdown } from "bootstrap";

export const HeaderAdmins = () => {
    const token = useSelector(userData).credentials.token || null;

    let decodificado = null;
    try {
        if (token) decodificado = jwtDecode(token);
    } catch (error) {
        console.warn(error.message || "Token inválido");
    }

    // useEffect(() => {
    //     const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');

    //     dropdownToggles.forEach((toggle) => {
    //         new Dropdown(toggle, {
    //             popperConfig: {
    //                 placement: "bottom-start",
    //                 modifiers: [
    //                     {
    //                         name: "flip",
    //                         options: {
    //                             fallbackPlacements: ["top", "right", "left"],
    //                         },
    //                     },
    //                 ],
    //             },
    //         });
    //     });
    // }, []);

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
        <>
            <div className="headerAdminsDesign">
                <nav className="lll navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <button
                                className="btn btn-close-menu d-lg-none"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                            >
                                ✕ Cerrar
                            </button>

                            {
                                !token && (
                                    <>
                                        <HeaderMenus />
                                        <HeaderLoginRegister />

                                    </>
                                )
                            }

                            {
                                token && decodificado.roleName === 'superAdmin' && (
                                    <>
                                        <HeaderMenus />
                                        <HeaderNews />
                                        <HeaderSuperAdmin />
                                        <HeaderReportes />
                                    </>
                                )
                            }
                        </div>
                    </div>
                </nav>
            </div></>
    )
}