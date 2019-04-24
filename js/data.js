'use strict';

(function () {
  // Константы
  // ----------
  var ADVERTS_AMOUNT = 8;
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
  var LOCALE_RUS = {
    'palace': 'дворец',
    'house': 'дом',
    'flat': 'квартира',
    'bungalo': 'бунгало',
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

  // Интерфейс
  // ----------
  window.data = {
    advertsNum: ADVERTS_AMOUNT,
    adverts: {
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
    },
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
    locales: {
      ru: LOCALE_RUS,
    }
  }
})();
