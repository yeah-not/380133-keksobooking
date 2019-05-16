'use strict';

(function () {
  // Константы
  // ----------
  var ADVERTS_AMOUNT = 20;
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_IN_OUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var AVATAR_PATH = 'img/avatars/user';
  var PIN_Y_RANGE = {
    min: 100,
    max: 630
  };
  var PIN_SIZES = {
    width: 50,
    height: 70,
  };
  var MAIN_PIN_SIZES = {
    width: 65,
    height: 65,
    pointerHeight: 22,
  };
  var MIN_PRICE_BY_TYPE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000,
  };
  var GUESTS_BY_ROOMS = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };
  var PRICE_BY_FILTER = {
    low: {min: 0, max: 10000},
    middle: {min: 10000, max: 50000},
    high: {min: 50000, max: 1000000},
  };
  var LOCALE_RUS = {
    'palace': 'дворец',
    'house': 'дом',
    'flat': 'квартира',
    'bungalo': 'бунгало',
  };

  // Функции
  // ----------
  var generateAdvert = function (index, data) {
    var randomPriceRange = window.util.getRandomProperty(PRICE_BY_FILTER);

    var advert = {
      author: {
        avatar: data.avatarPath + '0' + window.util.getRandomInt(1, 8) + '.png'
      },
      offer: {
        title: window.util.getRandomElement(data.titles),
        address: '',
        price: window.util.getRandomInt(randomPriceRange.min, randomPriceRange.max),
        type: window.util.getRandomElement(data.types),
        rooms: window.util.getRandomInt(1, 3),
        guests: window.util.getRandomInt(1, 3),
        checkin: window.util.getRandomElement(data.checkInOut),
        checkout: window.util.getRandomElement(data.checkInOut),
        features: window.util.randomizeArray(data.features),
        description: '',
        photos: window.util.shuffleArray(data.photos)
      },
      location: {
        x: window.util.getRandomInt(data.location.rangeX.min, data.location.rangeX.max),
        y: window.util.getRandomInt(data.location.rangeY.min, data.location.rangeY.max)
      }
    };

    advert.offer.address = advert.location.x + ', ' + advert.location.y;

    return advert;
  };

  // DOM-элементы
  // ----------
  var map = document.querySelector('.map');

  // Переменные
  // ----------
  var pinRangeX = {
    min: PIN_SIZES.width / 2,
    max: map.offsetWidth - PIN_SIZES.width / 2
  };
  var mainPinRangeX = {
    min: 0,
    max: map.offsetWidth - MAIN_PIN_SIZES.width
  };
  var advertsData = {
    titles: TITLES,
    types: TYPES,
    checkInOut: CHECK_IN_OUT,
    features: FEATURES,
    photos: PHOTOS,
    avatarPath: AVATAR_PATH,
    location: {
      rangeX: pinRangeX,
      rangeY: PIN_Y_RANGE,
    },
  };

  // Интерфейс
  // ----------
  window.data = {
    advertsNum: ADVERTS_AMOUNT,
    pin: {
      sizes: PIN_SIZES,
      position: {
        rangeX: pinRangeX,
        rangeY: PIN_Y_RANGE,
      },
    },
    mainPin: {
      sizes: MAIN_PIN_SIZES,
      position: {
        rangeX: mainPinRangeX,
        rangeY: PIN_Y_RANGE,
      },
    },
    form: {
      minPriceByType: MIN_PRICE_BY_TYPE,
      guestsByRooms: GUESTS_BY_ROOMS,
    },
    filters: {
      priceByFilter: PRICE_BY_FILTER,
    },
    lang: 'ru',
    locales: {
      ru: LOCALE_RUS,
    },
    getLocale: function () {
      return this.locales[this.lang];
    },
    generateAdverts: function (amount) {
      var adverts = [];

      for (var i = 0; i < amount; i++) {
        adverts[i] = generateAdvert(i, advertsData);
      }

      return adverts;
    },
  };
})();
