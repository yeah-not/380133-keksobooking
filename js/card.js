'use strict';

(function () {
  // Функции
  // ----------
  var render = function (advert, template, locale) {
    var card = template.cloneNode(true);

    card.querySelector('.popup__title').textContent = advert.offer.title;
    card.querySelector('.popup__description').textContent = advert.offer.description;
    card.querySelector('.popup__text--address').textContent = advert.offer.address;
    card.querySelector('.popup__avatar').src = advert.author.avatar;
    card.querySelector('.popup__type').textContent = window.util.capitalizeFirstLetter(locale[advert.offer.type]);
    card.querySelector('.popup__text--price').textContent = window.util.getFormatedPrice(advert.offer.price, 3) + '₽/ночь';
    card.querySelector('.popup__text--capacity').textContent = getAdvertCapacity(advert.offer.rooms, advert.offer.guests);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

    var features = advert.offer.features;
    var featuresList = card.querySelector('.popup__features');
    var featureTemplate = template.querySelector('.popup__feature');

    featureTemplate.classList.remove(featureTemplate.classList[1]);
    window.util.removeChildren(featuresList);
    featuresList.appendChild(window.util.renderFragment(features, renderFeature, featureTemplate));

    var photos = advert.offer.photos;
    var photosList = card.querySelector('.popup__photos');
    var photoTemplate = template.querySelector('.popup__photo');

    window.util.removeChildren(photosList);
    photosList.appendChild(window.util.renderFragment(photos, renderPhoto, photoTemplate));

    return card;
  };

  var renderFeature = function (featureName, template) {
    var feature = template.cloneNode();
    feature.classList.add(feature.classList[0] + '--' + featureName);
    return feature;
  };

  var renderPhoto = function (photoSrc, template) {
    var photo = template.cloneNode();
    photo.src = photoSrc;
    return photo;
  };

  var getAdvertCapacity = function (rooms, guests) {
    var roomsRemainder = rooms % 10;
    var guestsRemainder = guests % 10;
    var roomsLabel = 'комната';
    var guestsLabel = 'гостя';

    if (roomsRemainder > 1 && roomsRemainder < 5) {
      roomsLabel = 'комнаты';
    } else if (roomsRemainder >= 5) {
      roomsLabel = 'комнат';
    }

    if (guestsRemainder > 1) {
      guestsLabel = 'гостей';
    }

    return rooms + ' ' + roomsLabel + ' для ' + guests + ' ' + guestsLabel;
  };

  // Обработчики
  // ----------
  var onCardCloseClick = function (evt) {
    evt.preventDefault();
    window.card.remove();
  };

  // DOM-элементы
  // ----------
  var map = document.querySelector('.map');
  var filtersContainer = document.querySelector('.map__filters-container');

  // Шаблоны
  // ----------
  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');

  // Интерфейс
  // ----------
  window.card = {
    insert: function (advert) {
      this.remove();

      var locale = window.data.getLocale();
      var card = render(advert, cardTemplate, locale);
      map.insertBefore(card, filtersContainer);

      var cardClose = card.querySelector('.popup__close');
      cardClose.addEventListener('click', onCardCloseClick);
    },
    remove: function () {
      var card = map.querySelector('.map__card');

      if (card) {
        card.remove();
      }

    },
  };
})();
