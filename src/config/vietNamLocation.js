import axios from "axios";

const apiLocation = axios.create({
    baseURL: " https://vapi.vnappmob.com/api/province",
    timeout: 5000,
  });

  export default apiLocation;