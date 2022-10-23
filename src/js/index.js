import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './createMarkup';
import { ApiService } from './APIservice';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { addSmoothScroll } from './scroll';
import { addSimpleLightbox } from './simpleLightbox';

const apiService = new ApiService();

const refs = {
  form: document.querySelector('.search-form'),
  loadmoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {
  event.preventDefault();
  apiService.query = event.currentTarget.elements.searchQuery.value.trim();
  refs.form.reset();
  clearMarkup();
  refs.loadmoreBtn.classList.add('is-hidden');

  apiService.resetPage();

  if (apiService.searchQuery === '') {
    notificOnErrorFetch();
    return;
  }

  try {
    const { hits, totalHits } = await apiService.fetchImages();

    apiService.calculateTotalPages(totalHits);

    if (hits.length < 1) {
      notificOnErrorFetch();
      return;
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    appendMarkup(hits);

    if (apiService.page === apiService.totalPages) {
      refs.loadmoreBtn.classList.add('is-hidden');
      Notify.warning(
        'We are sorry, but you have reached the end of search results.'
      );
    } else {
      refs.loadmoreBtn.classList.remove('is-hidden');
    }

    addSimpleLightbox();

    apiService.incrementPage();
  } catch (error) {
    console.log(error.message);
  }
}

refs.loadmoreBtn.addEventListener('click', onLoadMoreBtn);

async function onLoadMoreBtn() {
  try {
    const { hits, totalHits } = await apiService.fetchImages();

    appendMarkup(hits);

    addSmoothScroll();

    addSimpleLightbox();

    if (apiService.page === apiService.totalPages) {
      refs.loadmoreBtn.classList.add('is-hidden');
      Notify.warning(
        'We are sorry, but you have reached the end of search results.'
      );
    }

    apiService.incrementPage();
  } catch (error) {
    console.log(error);
  }
}

function appendMarkup(hits) {
  const markup = createMarkup(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function notificOnErrorFetch() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    { clickToClose: true }
  );
}
