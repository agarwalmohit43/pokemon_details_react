import { useCallback, useEffect, useReducer, useState } from "react";
import PokemonListCard from "./PokemonListCard";
import { getPokemonsWithNext } from "../js/pokemon";
import { FETCH_NEW_POKEMON, FETCHING, CONTENT } from "../js/Constant";
import pokemonReducer from "../js/reducers";

import "../style/pokemon.scss";
import "../style/loader.scss";

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
  const [pokemon, dispatch] = useReducer(pokemonReducer, initialData);

  useEffect(() => {
    fetchAndUpdate(pokemon.next);
  }, [pokemon.next]);

  useEffect(() => {
    observeNewCard();
  }, [pokemon.content]);

  const fetchAndUpdate = (next) => {
    if (next) {
      dispatch({ type: FETCHING });
      getPokemonsWithNext(next)
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
  };

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

    //lazy-loading
    const lastCardObserver = new IntersectionObserver(
      (entries) => {
        const lastCard = entries[0];
        if (!lastCard.isIntersecting) return;
        fetchAndUpdate(pokemon.next);
        lastCardObserver.unobserve(lastCard.target);
        if (document.querySelector(".card:last-child")) {
          lastCardObserver.observe(document.querySelector(".card:last-child"));
        }
      },
      {
        rootMargin: "500px" // reason, want to make network request before the next card is visible
      }
    );

    if (document.querySelector(".card:last-child")) {
      lastCardObserver.observe(document.querySelector(".card:last-child"));
    }
  };

  return (
    <div className="pokemonLists">
      {/* <div className="count">Total Pokemons: {count}</div> */}

      <div className="lists">
        {pokemon.content.length > 0 ? (
          pokemon.content.map((pokemon, index) => {
            return <PokemonListCard pokemon={pokemon} key={index} />;
          })
        ) : (
          <h1>No Pokemons found</h1>
        )}
        {pokemon.fetching && <div class="loader">Loading...</div>}
      </div>
    </div>
  );
};

export default PokemonLists;
