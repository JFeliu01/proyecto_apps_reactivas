import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {ChampionData} from "../types/types";


function Home(){

    const [champions, setChampions] = useState<Record<string, ChampionData>>({});
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("https://ddragon.leagueoflegends.com/cdn/15.18.1/data/en_US/champion.json")
            .then((res) => res.json())
            .then((data) => setChampions(data.data));
    }, []);

    const filtered = Object.values(champions).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));




    return(
        <div style={{ padding: "1rem" }}>
            <h1>Champions</h1>
            <input type="text" placeholder="search champion" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: "1rem", padding: "0.5rem" }}/>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                {filtered.map((champ) => (
                    <Link key={champ.id} to={`/champion/${champ.id}`}>
                        <div style={{ textAlign: "center" }}>
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/${champ.image.full}`}
                                alt={champ.name}
                                style={{ width: "100px", borderRadius: "8px" }}
                            />
                            <h3>{champ.name}</h3>
                            <p>{champ.title}</p>

                        </div>
                    </Link>
                ))}

            </div>
        </div>

    );
}

export default Home;