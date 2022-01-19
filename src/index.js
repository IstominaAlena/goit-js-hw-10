import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import countryCardTemplate from './templates/country-card.hbs';
import countryListTemplate from './templates/country-list.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryContainer: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

refs.input.addEventListener('input', debounce(onInputFn, DEBOUNCE_DELAY));

function onInputFn(evt) {
  let countryName = evt.target.value.trim();
  if (!countryName) {
    refs.countryContainer.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(countryName).then(countriesListCheck).catch(errorCheckFn);
}

function countriesListCheck(countryData) {
  if (countryData.length > 10) {
    return Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countryData.length === 1) {
    refs.countryList.innerHTML = '';

    return renderCountryCard(countryData);
  }
  renderCountryList(countryData);
  refs.countryContainer.innerHTML = '';
}

function renderCountryCard(data) {
  console.log(data);
  refs.countryContainer.innerHTML = countryCardTemplate(data[0]);
}
function renderCountryList(data) {
  refs.countryList.innerHTML = countryListTemplate(data);
}

function errorCheckFn(error) {
  if (error.message === '404') {
    return Notify.failure('Oops, there is no country with that name');
  }
  return error;
}

// ukraine
// africa
