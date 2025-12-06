import { useSelector } from 'react-redux'
import './UsersManager.css'
import { useEffect, useState } from 'react'
import { users } from '../../services/root'
import { userData } from '../../app/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

export const UsersManager = ()=>{
    const navigate = useNavigate();
    const token = useSelector(userData).credentials.token || null;

    let decodificado = null;
    let isPermisionRoled = false;

    if(token){
        try {
            decodificado = jwtDecode(token);
            isPermisionRoled = decodificado.roleName === 'superAdmin';
            
        } catch {
            isPermisionRoled = false;
        }
    }

    useEffect(()=>{
        if( !token || !isPermisionRoled){
            navigate('/')
            return;
        }
    }, [token, isPermisionRoled, navigate])

    const [list, setList] = useState([])

    useEffect(() => {
        const listarU = async () => {
            try {
                const fetched = await users.rootListAllUsers(token)
                if (fetched.data && Array.isArray(fetched.data)) {
                    setList(fetched.data)
                } else {
                    setList([])
                    console.log("Los datos no son array")
                }

            } catch (error) {
                console.log(error.message || "Error en jsx")
            }
        }
        listarU()
    }, [token])
    console.log("Los datos:", list)

    return (
        <>
        <div className='usersDesign'>
            <h1>Wolcome to Users page</h1>

        </div>
        </>
    )
}

