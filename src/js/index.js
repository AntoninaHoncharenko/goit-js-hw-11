import '../css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import { createMarkup } from './createMarkup';
import { ApiService } from './APIservice';

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

  try {
    if (apiService.searchQuery === '') {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      return;
    }

    const { hits, totalHits } = await apiService.fetchImages();
    console.log(hits);
    console.log(totalHits);

    if (hits.length < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      return;
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);
    clearMarkup();

    hits.forEach(hit => {
      const markup = createMarkup(hit);
      console.log(markup);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    });
  } catch (error) {
    console.log(error);
  }
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
