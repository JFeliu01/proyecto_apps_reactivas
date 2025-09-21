import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {ChampionData} from "../types/types";
import { TextField, Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";


function Home(){

    const [champions, setChampions] = useState<Record<string, ChampionData>>({});
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("https://ddragon.leagueoflegends.com/cdn/15.18.1/data/en_US/champion.json")
            .then((res) => res.json())
            .then((data) => setChampions(data.data));
    }, []);

    const filtered = Object.values(champions).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));




    return (
        <div style={{ padding: "2rem" }}>
        <Typography variant="h3" sx={{ color: "var(--gold)", mb: 2, fontFamily: "Cinzel" }}>
            Champions
        </Typography>

        <TextField
            label="Search champion"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
            mb: 3,
            input: { color: "white" },
            label: { color: "var(--gold)" },
            "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--gold)" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "var(--gold)" }
            }
            }}
        />

        <Grid container spacing={3}>
            {filtered.map((champ) => (
                <Grid item xs={12} sm={6} md={3} key={champ.id}>
                    <Link to={`/champion/${champ.id}`}>
                    <Card
                        sx={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--gold)",
                        borderRadius: "12px",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 0 15px rgba(200, 155, 60, 0.6)"
                        }
                        }}
                    >
                        <CardMedia
                        component="img"
                        height="140"
                        image={`https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/${champ.image.full}`}
                        alt={champ.name}
                        />
                        <CardContent>
                        <Typography variant="h6" sx={{ color: "white" }}>
                            {champ.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "var(--gold)" }}>
                            {champ.title}
                        </Typography>
                        </CardContent>
                    </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
        </div>
    );
}

export default Home;