import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function Champion(){

    const {id}= useParams();
    const [champion, setChampion] = useState<any>(null);

    useEffect(() => {
        fetch(`https://ddragon.leagueoflegends.com/cdn/15.18.1/data/en_US/champion/${id}.json`)
        .then((res) => res.json())
        .then((data) => {setChampion(data.data[id as string])});
    }, [id]);

    if (!champion) return <p>Loading...</p>



    return(
        <div style={{ padding: "1rem" }}>
            <h1>{champion.name}</h1>
            <p>{champion.title}</p>
            <p>{champion.lore}</p>
            {champion.spells.map((spell: any) => (
                <div key={spell.id} style={{ marginBottom: "1rem" }}>
                    <h3>{spell.name}</h3>
                    <p>{spell.description}</p>
                </div>
            ))}

        </div>

    );
}

export default Champion;