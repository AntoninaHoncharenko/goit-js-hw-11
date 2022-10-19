import axios from 'axios';

export class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalPages = 0;
  }
  async fetchImages() {
    console.log(this);
    //   axios.defaults.baseURL = 'https://pixabay.com/api/';
    //   axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '30659644-d62c8c976bf0a1f367dc53c1a';
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;

    const { data } = await axios.get(url);
    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  calculateTotalPages(total) {
    this.totalPages = Math.ceil(total / this.perPage);
  }

  get isShowLoadMoreBtn() {
    return this.page < this.totalPages;
  }
  // тоді refs.loadmoreBtn.classList.remove('is-hidden');
}
