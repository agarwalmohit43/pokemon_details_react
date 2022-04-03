import { useCallback, useEffect, useReducer, useState } from "react";
import PokemonListCard from "./PokemonListCard";
import { getPokemons } from "../js/pokemon";
import { FETCH_NEW_POKEMON, FETCHING, CONTENT } from "../js/Constant";
import { pokemonReducer } from "../js/reducers";

const initialData = {
  fetching: false,
  content: [],
  offset: 0
};

const PokemonLists = () => {
  const [pokemon, dispatch] = useReducer(pokemonReducer, {});
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(
    `https://pokeapi.co/api/v2/pokemon/?offset=${pokemon.offset}&limit=20`
  );

  const [previous, setPrevious] = useState("");
  const [data, setData] = useState([]);

  let fetchNext = useCallback(() => {
    getPokemons(next).then((res) => {
      console.log("data", res);

      let newResult = res.results || [];
      setData((prev) => {
        return [...prev, ...newResult];
      });
      setNext(res.next);
      setCount(res.count);
      setPrevious(res.previous || "");
    });
  }, [next]);

  let fetchPrevious = useCallback(() => {
    getPokemons(previous).then((res) => {
      console.log("data", res);

      let newResult = res.results || [];
      setData((prev) => {
        return [...prev, ...newResult];
      });
      setNext(res.next);
      setCount(res.count);
      setPrevious(res.previous || "");
    });
  }, [previous]);

  useEffect(() => {
    fetchNext();
  }, []);

  const loadmore = () => {
    fetchNext();
  };

  const loadless = () => {
    fetchPrevious();
  };

  return (
    <div className="pokemonLists">
      <div className="count">Total Pokemons: {count}</div>
      <div className="lists">
        {data.length > 0 ? (
          <ol>
            {data.map((pokemon, index) => {
              return (
                <li key={index}>
                  <PokemonListCard pokemon={pokemon} key={index} />
                </li>
              );
            })}
          </ol>
        ) : (
          <h1>No Pokemons found</h1>
        )}
      </div>
      <div className="loadmore">
        <button onClick={loadmore}>Load more...</button>
      </div>
      {previous && (
        <div className="loadless">
          <button onClick={loadless}>Load Less...</button>
        </div>
      )}
    </div>
  );
};

export default PokemonLists;
