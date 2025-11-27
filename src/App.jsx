import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap/dist/js/bootstrap.bundle.min";

import './App.css'
import { Body } from './pages/Body/Body'
import { Header } from './common/Header/Header';

function App() {

  return (
    <>
      <Header />
      <Body />
    </>
  )
}

export default App
