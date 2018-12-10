import axios from 'axios';

export default () => {
  return axios.create({
    // baseURL: 'https://api.davohjewelryco.com:8010/'
    baseURL: 'http://localhost:8010/'
  });
};
