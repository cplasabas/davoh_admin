import axios from 'axios';

export default () => {
  return axios.create({
    baseURL: 'http://206.189.89.72:8010'
  });
};
