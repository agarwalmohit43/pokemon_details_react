import axios from "axios";
import pokemon from "../../apis/pokemon";

export async function getPokemonsWithNext(next) {
  // console.log(next);
  try {
    const res = await axios.get(next);
    const data = await filterResponse(res);
    return {};
  } catch (error) {
    throw error;
  }
}

export async function getPokemonsWithPageOffset(offset) {
  // console.log("called", offset);
  try {
    let params = {
      offset,
      limit: 20
    };
    const res = await pokemon.get("/", { params });
    // console.log(res);
    const data = await filterResponse(res);
    return data;
  } catch (error) {
    throw error;
  }
}

function getPokemonDetails(url) {
  return fetch(url).then((res) => res.json());
}

async function filterResponse(res) {
  try {
    if (res.status === 200) {
      // console.log(res);
      let results = res.data.results || [];
      let detailsArray = [];
      let pokemonsPromise = [];
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          let currPokemon = results[i];
          pokemonsPromise.push(await getPokemonDetails(currPokemon.url));
        }
        await Promise.all(pokemonsPromise).then((results) => {
          // console.log("bulk", results);
          for (let i = 0; i < results.length; i++) {
            let curr = results[i];
            let abilitiesNames = [];
            if (curr.abilities.length > 0) {
              let abilities = curr.abilities;
              abilitiesNames = abilities.map((item) => item.ability.name);
            }
            let obj = {
              name: curr.name,
              abilities: abilitiesNames,
              imgSrc: curr.sprites.front_shiny || ""
            };
            detailsArray.push(obj);
            // console.log(detailsArray);
          }
          // console.log("detailsArray", detailsArray);
          return { detailsArray, next: res.data.next };
        });
        // console.log("detailsArray", detailsArray);
        // const newResponse = (({ results, ...o }) => o)(res.data); //eliminating results array from response;
        return { content: detailsArray, ...res.data };
      }
      // return res.data;
    } else {
      const error = { code: 403, message: "Pokemons not found" };
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
