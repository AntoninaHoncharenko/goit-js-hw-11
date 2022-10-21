import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['Authorization'] =
//   '30659644-d62c8c976bf0a1f367dc53c1a';

export class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalPages = 0;
    this.params = {
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    };
  }

  async fetchImages() {
    // const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '30659644-d62c8c976bf0a1f367dc53c1a';
    const url = `?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}`;

    const { data } = await axios.get(url, this.params);
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

  resetPage() {
    this.page = 1;
  }

  calculateTotalPages(total) {
    this.totalPages = Math.ceil(total / this.perPage);
  }

  // get isShowLoadMoreBtn() {
  //   return this.page <= this.totalPages;
  // }
}
