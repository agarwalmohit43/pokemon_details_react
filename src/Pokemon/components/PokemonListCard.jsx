const PokemonListCard = ({ pokemon }) => {
  // console.log(pokemon);
  return (
    <div className="card">
      <div className="icon">
        <picture>
          <img src={pokemon.imgSrc} alt={pokemon.name} />
        </picture>
      </div>
      <div className="name">{pokemon.name}</div>
      <div className="abilities">
        {pokemon.abilities.length > 0 ? (
          <ol className="abilitiesList">
            {pokemon.abilities.map((ability, index) => {
              return <li key={ability + index}>{ability}</li>;
            })}
          </ol>
        ) : (
          <strong>No abilities</strong>
        )}
      </div>
    </div>
  );
};

export default PokemonListCard;
