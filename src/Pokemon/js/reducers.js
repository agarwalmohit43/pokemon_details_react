import { FETCH_NEW_POKEMON, FETCHING, CONTENT } from "./Constant";

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
        fetching: false
      };
    default:
      return state;
  }
};

export default pokemonReducer;
