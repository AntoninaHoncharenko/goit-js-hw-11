import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './createMarkup';
import { ApiService } from './APIservice';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiService = new ApiService();

const refs = {
  form: document.querySelector('.search-form'),
  loadmoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadmoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();
  apiService.query = event.currentTarget.elements.searchQuery.value.trim();
  apiService.page = 1;
  refs.form.reset();

  try {
    if (apiService.searchQuery === '') {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      return;
    }

    const { hits, totalHits } = await apiService.fetchImages();
    apiService.page += 1;

    if (hits.length < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      refs.loadmoreBtn.classList.add('is-hidden');
      clearMarkup();
      return;
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);
    clearMarkup();

    hits.forEach(hit => {
      const markup = createMarkup(hit);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    });

    if (totalHits <= apiService.perPage) {
      refs.loadmoreBtn.classList.add('is-hidden');
    } else {
      refs.loadmoreBtn.classList.remove('is-hidden');
    }

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } catch (error) {
    console.log(error);
  }
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

async function onLoadMore() {
  try {
    const { hits, totalHits } = await apiService.fetchImages();
    apiService.page += 1;
    hits.forEach(hit => {
      const markup = createMarkup(hit);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    });
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } catch (error) {
    console.log(error);
  }
}

// оптимізувати clearMarkup() та is-hidden
