import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./views/Login";
import Home from "./views/Home";
import Champion from "./views/Champion";
import './App.css'

function App() {
  return (
    <Router>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path= "/signup" element={<Login />}/>
        <Route path="/champion/:id" element={<Champion />} />
      </Routes>
    
    </Router>
    
  );
}

export default App;
