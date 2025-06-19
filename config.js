const BASE_URL = __DEV__
  ? "http://10.91.40.41:3000" // Use localhost in development
  : "http://10.0.2.2:3000"; // Use production API URL (CHANGE)

export default BASE_URL;