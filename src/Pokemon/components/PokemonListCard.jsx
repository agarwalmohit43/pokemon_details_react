const PokemonListCard = ({ pokemon }) => {
  // console.log(pokemon);

  if (pokemon === undefined || Object.keys(pokemon).length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="icon">
        <picture>
          <img src={pokemon.imgSrc} alt={pokemon.name} />
        </picture>
      </div>
      <hr />
      <div className="name">
        <h1>
          <em>{pokemon.name}</em>
        </h1>
      </div>
      <div className="abilities">
        {pokemon.abilities.length > 0 ? (
          <figure>
            <figcaption>
              <p>
                <b>Abilities</b>
              </p>
            </figcaption>
            <ul className="abilitiesList">
              {pokemon.abilities.map((ability, index) => {
                return (
                  <li key={ability + index}>
                    <em>{ability}</em>
                  </li>
                );
              })}
            </ul>
          </figure>
        ) : (
          <strong>No abilities</strong>
        )}
      </div>
    </div>
  );
};

export default PokemonListCard;
