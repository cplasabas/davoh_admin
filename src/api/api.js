import axios from 'axios';

export default () => {
  // console.log(this.$store);
  return axios.create({
    baseURL: 'http://localhost:8010'
  });
};
