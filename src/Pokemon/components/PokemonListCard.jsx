const PokemonListCard = ({ pokemon }) => {
  // console.log(pokemon);
  return (
    <div>
      <div className="label">
        <strong>{pokemon.name}</strong>
      </div>
      <div className="url"></div>
    </div>
  );
};

export default PokemonListCard;
