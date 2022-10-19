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
  refs.form.reset();
  clearMarkup();
  refs.loadmoreBtn.classList.add('is-hidden');
  apiService.page = 1;
  window.scroll(0, 100);

  try {
    if (apiService.searchQuery === '') {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      return;
    }

    const { hits, totalHits } = await apiService.fetchImages();
    apiService.incrementPage();

    apiService.calculateTotalPages(totalHits);
    console.log(apiService.totalPages);

    if (hits.length < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      // refs.loadmoreBtn.classList.add('is-hidden');
      return;
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);

    hits.forEach(hit => {
      const markup = createMarkup(hit);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    });

    if (apiService.isShowLoadMoreBtn) {
      refs.loadmoreBtn.classList.remove('is-hidden');
    }

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });

    lightbox.refresh();
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
    apiService.incrementPage();

    hits.forEach(hit => {
      const markup = createMarkup(hit);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    });

    // window.scrollBy(0, 100);

    if (!apiService.isShowLoadMoreBtn) {
      refs.loadmoreBtn.classList.add('is-hidden');
    }

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

// оптимізувати is-hidden, lightbox
