import { Link } from "react-router-dom";

function NavBar(){
    return (
        <nav style={{ padding: "1rem", background: "#111", color: "#fff" }}>
            <Link to="/" style={{ marginRight: "1rem", color: "white" }}>Home</Link>
            <Link to="/signup" style={{ color: "white" }}>Signup</Link>
        </nav>

    );
}

export default NavBar;