import pokemon from "../../apis/pokemon";

export async function getPokemons(next) {
  /**
   * , {
    params: {
      offset: 20,
      limit: 20
    }
   */
  // console.log(pokemon);
  const res = await pokemon.get(next);
  // console.log(res);
  if (res.status === 200) {
    return res.data;
  } else {
    console.log("Pokemons not found");
  }
}
