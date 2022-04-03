import { useCallback, useEffect, useReducer, useState } from "react";
import PokemonListCard from "./PokemonListCard";
import { getPokemonsWithNext } from "../js/pokemon";
import { FETCH_NEW_POKEMON, FETCHING, CONTENT } from "../js/Constant";
// import { pokemonReducer } from "../js/reducers";

import "../style/pokemon.scss";

const initialData = {
  fetching: true,
  content: [
    // { name: "Mohit", abilities: ["code", "eat", "sleep"] },
    // { name: "Prachi", abilities: ["code", "eat", "sleep"] }
  ],
  offset: 0,
  next: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20"
};

const PokemonLists = () => {
  const pokemonReducer = (state, action) => {
    switch (action.type) {
      case FETCH_NEW_POKEMON:
        return { ...state, offset: state.offset + 20, fetching: true };
      case FETCHING:
        return { ...state, fetching: true };
      case CONTENT:
        return {
          ...state,
          content: state.content.concat(action.payload.data),
          fetching: false,
          next: action.payload.next
        };
      default:
        return state;
    }
  };
  const [pokemon, dispatch] = useReducer(pokemonReducer, initialData);

  useEffect(() => {
    if (pokemon.next) {
      getPokemonsWithNext(pokemon.next)
        .then((res) => {
          console.log(res);
          dispatch({
            type: CONTENT,
            payload: {
              data: res.content,
              next: res.next
            }
          });
        })
        .catch(console.log);
    }
  }, [pokemon.next]);

  useEffect(() => {
    observeNewCard();
  }, [pokemon.content]);

  const observeNewCard = () => {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          entry.target.classList.toggle("show", entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(entry.target); // once visible stop unmounting
        });
      },
      {
        threshold: 1 // 0 to 100%, 0 means about to enter the screen.
      }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });
  };

  return (
    <div className="pokemonLists">
      {/* <div className="count">Total Pokemons: {count}</div> */}
      {pokemon.fetching ? (
        <h1>Loading...</h1>
      ) : (
        <div className="lists">
          {pokemon.content.length > 0 ? (
            pokemon.content.map((pokemon, index) => {
              return <PokemonListCard pokemon={pokemon} key={index} />;
            })
          ) : (
            <h1>No Pokemons found</h1>
          )}
        </div>
      )}
      {/* <div className="loadmore">
        <button onClick={loadmore}>Load more...</button>
      </div> */}
      {/* {previous && (
        <div className="loadless">
          <button onClick={loadless}>Load Less...</button>
        </div>
      )} */}
    </div>
  );
};

export default PokemonLists;
