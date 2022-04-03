import { useEffect, useReducer, useRef } from "react";
import PokemonListCard from "./PokemonListCard";
import { getPokemonsWithPageOffset } from "../js/pokemon";
import { FETCHING, CONTENT, OFFSET_INCREASE } from "../js/Constant";
import pokemonReducer from "../js/reducers";
import Spinner from "./Spinner";

import "../style/pokemon.scss";

const initialData = {
  // const [card, setCard] = useState(document.querySelectorAll(".card"));
  fetching: true,
  content: [
    // { name: "Mohit", abilities: ["code", "eat", "sleep"] }
    // { name: "Prachi", abilities: ["code", "eat", "sleep"] }
  ],
  offset: 0,
  next: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20",
  contents: []
};

// const cards = useMemo(() => document.querySelectorAll(".card"), [
//   card
// ]);

const PokemonLists = () => {
  const [pokemon, dispatch] = useReducer(pokemonReducer, initialData);
  const count = useRef(0);
  // const offSetMax = useRef(0);

  // const fetch = useCallback(() => {
  //   return fetchAndUpdate;
  // }, [pokemon.offset]);

  useEffect(() => {
    // fetchAndUpdate(pokemon.next);
    if (count.current >= pokemon.offset) {
      fetchAndUpdate(pokemon.offset);
    }
  }, [pokemon.offset]);

  useEffect(() => {
    observeNewCard();
  }, [pokemon.content]);

  // const fetchAndUpdate = (next) => {
  //   if (next) {
  //     dispatch({ type: FETCHING });
  //     getPokemonsWithNext(next)
  //       .then((res) => {
  //         console.log(res);
  //         dispatch({
  //           type: CONTENT,
  //           payload: {
  //             data: res.content,
  //             next: res.next
  //           }
  //         });
  //       })
  //       .catch(console.log);
  //   }
  // };

  const fetchAndUpdate = (offset) => {
    if (offset >= 0) {
      dispatch({ type: FETCHING });
      getPokemonsWithPageOffset(offset)
        .then((res) => {
          // console.log(res);
          dispatch({
            type: CONTENT,
            payload: {
              data: res.content,
              next: res.next
            }
          });
          count.current = res.count;
          // offSetMax.current = parseInt(res.count / 20);
        })
        .catch(console.log);
    }
  };

  const observeNewCard = () => {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(
      (entries) => {
        // console.log(entries);
        entries.forEach((entry) => {
          entry.target.classList.toggle("show", entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(entry.target); // once visible stop unmounting
        });
      },
      {
        threshold: 0 // 0 to 100%, 0 means about to enter the screen.
        // rootMargin: "200px"
      }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });
    lazyLoading();
  };

  const lazyLoading = () => {
    //lazy-loading
    const lastCardObserver = new IntersectionObserver(
      (entries) => {
        const lastCard = entries[0];
        if (!lastCard.isIntersecting) return;
        if (count.current >= pokemon.offset) {
          dispatch({ type: OFFSET_INCREASE });
        }

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
        {pokemon.fetching && <Spinner />}
      </div>
      <br />
      <hr />
      {/* {pokemon.offset} */}
      {pokemon.offset >= count.current && <h1>Finish</h1>}
    </div>
  );
};

export default PokemonLists;
