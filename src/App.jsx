import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap/dist/js/bootstrap.bundle.min";

import './App.css'
import { Body } from './pages/Body/Body'
import { Header } from './common/Header/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userData } from './app/slices/userSlice';
import { useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { HeaderAdmins } from './common/Header/HeaderAdmins';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector(userData).credentials.token || null;

  useEffect(() => {
    if (!token ) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  const isAdmin = useMemo(() => {
    if (!token) return false;

    const decodificado = jwtDecode(token);
    const adminRoles = ['superAdmin', 'admin', 'AdminLocal'];
    return adminRoles.includes(decodificado.roleName);
    
  }, [token]);

  const hideHeaderPaths = ["/login", "/register"];
  const hideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!hideHeader && ( isAdmin ? <HeaderAdmins/> : <Header/> )}
      <Body />
    </>
  )
}

export default App
