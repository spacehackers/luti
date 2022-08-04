export default function reducer(state, action) {
  switch (action.type) {
    // case "TOGGLE_SOUND":
    //   return { ...state, soundOn: action.payload.soundOn };

    case "DARK_MODE":
      console.log("updating state yea?");
      return { ...state, darkMode: action.payload };

    default:
      return state;
  }
}
