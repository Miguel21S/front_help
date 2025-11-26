import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../Login/Login"
export const Body = () =>{
    return(
        <Routes>
            <Route path="*" element= {<Navigate to = {"/"} replace />}/>
            <Route path="login" element= {< Login />}/>
        </Routes>

    )
}