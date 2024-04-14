import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from "react-router-dom";

interface Pokemons {
  name: string;
  url: string;
}

interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
}

const PokemonDetailsPage = () => {
  const { url } = useParams<{ url: string }>();

  const [pokemon, setPokemon] = useState<PokemonDetails>();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!url) {
        return;
      }
      try {
        const fetchData = await fetch(url);
        const data = await fetchData.json();

        setPokemon(data);
      } catch (error) {
        console.error("Error fetching Pokémon Details:", error);
      }
    };

    fetchPokemonDetails();
  }, [url]);

  return (
    <div>
      <h1>{pokemon?.name}</h1>
      <img src={pokemon?.sprites.front_default} alt="" />
    </div>
  );
};

const PokemonListPage = () => {
  const [pokemons, setPokemons] = useState<Pokemons[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchAllPokemon = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );
        const data = await fetchAllPokemon.json();

        setPokemons(data.results);
      } catch (error) {
        console.error("Error fetching Pokémons:", error);
      }
    };

    fetchData();
  }, []);

  const pokemonsList = useMemo(() => pokemons, [pokemons]);

  return (
    <div>
      <h1>Pokemons</h1>
      <div className="pokemons">
        {pokemonsList.length !== 0 &&
          pokemonsList.map((pokemon) => {
            return (
              <ul
                key={pokemon.name}
                style={{
                  listStyle: "none",
                  listStyleType: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Link to={`pokemon/${encodeURIComponent(pokemon.url)}`}>
                  <li>{pokemon.name}</li>
                </Link>
              </ul>
            );
          })}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonListPage />} />
        <Route path="pokemon/:url" element={<PokemonDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
