import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../Login/Login"
import { DashboardSuperAdmin } from "../DashboardSuperAdmin/DashboardSuperAdmin"
export const Body = () =>{
    return(
        <Routes>
            <Route path="*" element= {<Navigate to = {"/"} replace />}/>
            <Route path="login" element= {< Login />}/>
            <Route path="/dashboardSuperAdmin" element= {< DashboardSuperAdmin />}/>
        </Routes>

    )
}