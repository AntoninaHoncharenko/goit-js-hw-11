import axios from 'axios';

export class ApiService {
  constructor() {
    this.searchQuery = '';
  }
  async fetchImages() {
    //   axios.defaults.baseURL = 'https://pixabay.com/api/';
    //   axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '30659644-d62c8c976bf0a1f367dc53c1a';
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

    const { data } = await axios.get(url);
    console.log(data);
    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
