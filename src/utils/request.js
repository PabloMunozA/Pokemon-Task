import axios from 'axios';

export const request = async({url, method, data }) => {
  const allData = await axios[method](url, data);
  return allData.data;
};
