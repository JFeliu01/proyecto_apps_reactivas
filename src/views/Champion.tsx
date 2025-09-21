import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Grid } from "@mui/material";


function Champion(){

    const {id}= useParams();
    const [champion, setChampion] = useState<any>(null);

    useEffect(() => {
        fetch(`https://ddragon.leagueoflegends.com/cdn/15.18.1/data/en_US/champion/${id}.json`)
        .then((res) => res.json())
        .then((data) => {setChampion(data.data[id as string])});
    }, [id]);

    if (!champion) return <p>Loading...</p>



    return (
        <Box sx={{ padding: "2rem", color: "var(--text)" }}>
        {/* Header del campeón */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Card
            sx={{
                width: 180,
                backgroundColor: "var(--card-bg)",
                border: "2px solid var(--gold)",
                borderRadius: "12px",
                mr: 3,
            }}
            >
            <CardMedia
                component="img"
                image={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`}
                alt={champion.name}
            />
            </Card>
            <Box>
            <Typography variant="h3" sx={{ color: "var(--gold)", fontFamily: "Cinzel" }}>
                {champion.name}
            </Typography>
            <Typography variant="h5" sx={{ color: "white", fontStyle: "italic" }}>
                {champion.title}
            </Typography>
            </Box>
        </Box>

        {/* Lore */}
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: "var(--gold)", mb: 1 }}>
            Lore
            </Typography>
            <Typography variant="body1" sx={{ color: "white", lineHeight: 1.6 }}>
            {champion.lore}
            </Typography>
        </Box>

        {/* Habilidades */}
        <Typography variant="h5" sx={{ color: "var(--gold)", mb: 2 }}>
            Abilities
        </Typography>
        <Grid container spacing={2}>
            {champion.spells.map((spell: any) => (
            <Grid item xs={12} sm={6} md={3} key={spell.id}>
                <Card
                sx={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--gold)",
                    borderRadius: "12px",
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 0 15px rgba(200, 155, 60, 0.6)",
                    },
                }}
                >
                <CardMedia
                    component="img"
                    image={`https://ddragon.leagueoflegends.com/cdn/15.18.1/img/spell/${spell.image.full}`}
                    alt={spell.name}
                    sx={{ height: 100, objectFit: "contain", backgroundColor: "#000" }}
                />
                <CardContent>
                    <Typography variant="h6" sx={{ color: "white" }}>
                    {spell.name}
                    </Typography>
                    <Typography
                    variant="body2"
                    sx={{ color: "var(--text)", fontSize: "0.85rem" }}
                    dangerouslySetInnerHTML={{ __html: spell.description }}
                    />
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Box>
    );
}

export default Champion;