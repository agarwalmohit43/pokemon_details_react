import axios from "axios";
// import pokemon from "../../apis/pokemon";
// export async function getPokemons(offset) {
//   let params = {
//     offset,
//     limit: 20
//   };
//   const res = await pokemon.get("/", { params });
//   if (res.status === 200) {
//     return res.data;
//   } else {
//     console.log("Pokemons not found");
//   }
// }

export async function getPokemonsWithNext(next) {
  // console.log(next);
  const res = await axios.get(next);
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
        console.log("detailsArray", detailsArray);
        return { detailsArray, next: res.data.next };
      });
      // console.log("detailsArray", detailsArray);
      return { content: detailsArray, next: res.data.next };
    }
    // return res.data;
  } else {
    return "Pokemons not found";
  }
}

function getPokemonDetails(url) {
  return fetch(url).then((res) => res.json());
}
