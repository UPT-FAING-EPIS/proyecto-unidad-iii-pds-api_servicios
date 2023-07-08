import axios from "axios";

export const listarclientes = () => {
    return axios.get("https://localhost:44392/Cliente");
  };