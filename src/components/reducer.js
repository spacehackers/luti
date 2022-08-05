export default function reducer(state, action) {
  switch (action.type) {
    case "DARK_MODE":
      return { ...state, darkMode: action.payload };

    case "SOUND":
      return { ...state, sound: action.payload };

    default:
      return state;
  }
}
