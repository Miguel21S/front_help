import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { userData } from "../../app/slices/userSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { buildings } from "../../services/root";


export const Buildings = () => {
    const navigate = useNavigate();
    const token = useSelector(userData).credentials.token || null

    const [listBuildings, setListBuildings] = useState([])

    let decodificado = null;
    let isPermisionRoled = false;

    if (token) {
        try {
            decodificado = jwtDecode(token);
            isPermisionRoled = decodificado.roleName === "superAdmin";

        } catch {
            isPermisionRoled = false
        }
    }

    useEffect(() => {
        if (!token || !isPermisionRoled) {
            navigate('/')
            return;
        }
    }, [token, isPermisionRoled, navigate])

    useEffect(() => {

        if (!isPermisionRoled || !token) return;
        const listAllBuild = async () => {
            try {
                const fetchedBuildings = await buildings.rootAllBuildings(token);
                if (fetchedBuildings.success && Array.isArray(fetchedBuildings.data)) {
                    setListBuildings(fetchedBuildings.data)
                } else {
                    console.error("Los datos no son array")
                    setListBuildings([])
                }
            } catch (error) {
                console.log(error.message || "Error en jsx")
            }
        }
        listAllBuild();

    }, [token, isPermisionRoled])

    return (
        <>
        </>
    )
}