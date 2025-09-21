import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function NavBar(){
    

    return (
        <AppBar position="static" sx={{ backgroundColor: "black", borderBottom: "2px solid var(--gold)" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ color: "var(--gold)", fontFamily: "Cinzel" }}>LoL.gg</Typography>
                <div>
                    <Button component={Link} to="/" sx={{ color: "white", "&:hover": { color: "var(--gold)" } }}>Home</Button>
                    <Button component={Link} to="/signup" sx={{ color: "white", "&:hover": { color: "var(--gold)" } }}>Signup</Button>
                </div>

            </Toolbar>
        </AppBar>

    );
}

export default NavBar;