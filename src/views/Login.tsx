import { Box, TextField, Button, Typography } from "@mui/material";

function Login(){
    

    return (
        <Box sx={{ maxWidth: 400, margin: "3rem auto", p: 3, border: "1px solid var(--gold)", borderRadius: "12px", backgroundColor: "var(--card-bg)" }}>
            <Typography variant="h4" sx={{ mb: 2, textAlign: "center", color: "var(--gold)", fontFamily: "Cinzel" }}> Signup/Login</Typography>
            <form>
                <TextField 
                    label="Username"
                    variant="outlined"
                    fullWidth
                    sx={{
                        mb: 2,
                        input: { color: "white" },
                        label: { color: "var(--gold)" },
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "var(--gold)" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "var(--gold)" }
                        }
                    }}/>
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    sx={{
                        mb: 2,
                        input: { color: "white" },
                        label: { color: "var(--gold)" },
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "var(--gold)" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "var(--gold)" }
                        }
                    }}
                    />

                <Button fullWidth sx={{mt: 1, backgroundColor:"var(--gold)", color:"black","&:hover": { backgroundColor: "white", color: "black" } }}>Login</Button>
            </form>

        </Box>

    );
}

export default Login;