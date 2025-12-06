import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../Login/Login"
import { DashboardSuperAdmin } from "../DashboardSuperAdmin/DashboardSuperAdmin"
import { Register } from "../Register/Register"
import { Home } from "../Home/Home"
import { BuildingsManager } from "../Buildings/BuidingsManager"
import { UsersManager } from "../UsersManager/UsersManager"

export const Body = () =>{
    return(
        <Routes>
            <Route path="*" element= {<Navigate to = {"/"} replace />}/>
            <Route path="/" element= {<Home />}/>
            <Route path="/register" element= {<Register />}/>
            <Route path="/login" element= {< Login />}/>
            <Route path="/dashboardSuperAdmin" element= {< DashboardSuperAdmin />}/>
            <Route path="/usersmanager" element= {< UsersManager />}/>
            <Route path="/buildingsmanager" element= {< BuildingsManager />}/>
        </Routes>

    )
}