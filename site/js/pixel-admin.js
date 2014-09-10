(function() {
  if (!String.prototype.endsWith) {

	/*
	 * Determines whether a string ends with the specified suffix.
	 * 
	 * @param  {String} suffix
	 * @return Boolean
	 */
	String.prototype.endsWith = function(suffix) {
	  return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
  }

  if (!String.prototype.trim) {

	/*
	 * Removes whitespace from both sides of a string.
	 * 
	 * @return {String}
	 */
	String.prototype.trim = function() {
	  return this.replace(/^\s+|\s+$/g, '');
	};
  }

  if (!Array.prototype.indexOf) {

	/*
	 * The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
	 * 
	 * @param  {Variant} searchElement
	 * @param  {Integer} fromIndex
	 * @return {Integer}
	 */
	Array.prototype.indexOf = function(searchElement, fromIndex) {
	  var i, length, _i;
	  if (this === void 0 || this === null) {
		throw new TypeError('"this" is null or not defined');
	  }
	  length = this.length >>> 0;
	  fromIndex = +fromIndex || 0;
	  if (Math.abs(fromIndex) === Infinity) {
		fromIndex = 0;
	  }
	  if (fromIndex < 0) {
		fromIndex += length;
		if (fromIndex < 0) {
		  fromIndex = 0;
		}
	  }
	  for (i = _i = fromIndex; fromIndex <= length ? _i < length : _i > length; i = fromIndex <= length ? ++_i : --_i) {
		if (this[i] === searchElement) {
		  return i;
		}
	  }
	  return -1;
	};
  }

  if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
	  var aArgs, fBound, fNOP, fToBind;
	  if (typeof this !== "function") {
		throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	  }
	  aArgs = Array.prototype.slice.call(arguments, 1);
	  fToBind = this;
	  fNOP = function() {};
	  fBound = function() {
		return fToBind.apply((this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array.prototype.slice.call(arguments)));
	  };
	  fNOP.prototype = this.prototype;
	  fBound.prototype = new fNOP();
	  return fBound;
	};
  }

  if (!Object.keys) {
	Object.keys = (function() {
	  'use strict';
	  var dontEnums, hasDontEnumBug, hasOwnProperty;
	  hasOwnProperty = Object.prototype.hasOwnProperty;
	  hasDontEnumBug = {
		toString: null
	  }.propertyIsEnumerable('toString') ? false : true;
	  dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
	  return function(obj) {
		var dontEnum, prop, result, _i, _j, _len, _len1;
		if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
		  throw new TypeError('Object.keys called on non-object');
		}
		result = [];
		for (_i = 0, _len = obj.length; _i < _len; _i++) {
		  prop = obj[_i];
		  if (hasOwnProperty.call(obj, prop)) {
			result.push(prop);
		  }
		}
		if (hasDontEnumBug) {
		  for (_j = 0, _len1 = dontEnums.length; _j < _len1; _j++) {
			dontEnum = dontEnums[_j];
			if (hasOwnProperty.call(obj, dontEnum)) {
			  result.push(dontEnum);
			}
		  }
		}
		return result;
	  };
	}).call(this);
  }


  /*
   * Detect screen size.
   * 
   * @param  {jQuery Object} $ssw_point
   * @param  {jQuery Object} $tsw_point
   * @return {String}
   */

  window.getScreenSize = function($ssw_point, $tsw_point) {
	if ($ssw_point.is(':visible')) {
	  return 'small';
	} else if ($tsw_point.is(':visible')) {
	  return 'tablet';
	} else {
	  return 'desktop';
	}
  };

  window.elHasClass = function(el, selector) {
	return (" " + el.className + " ").indexOf(" " + selector + " ") > -1;
  };

  window.elRemoveClass = function(el, selector) {
	return el.className = (" " + el.className + " ").replace(" " + selector + " ", ' ').trim();
  };

}).call(this);
;
(function() {
  var PixelAdminApp, SETTINGS_DEFAULTS;

  SETTINGS_DEFAULTS = {
	is_mobile: false,
	resize_delay: 400,
	stored_values_prefix: 'pa_',
	main_menu: {
	  accordion: true,
	  animation_speed: 250,
	  store_state: true,
	  store_state_key: 'mmstate',
	  disable_animation_on: ['small'],
	  dropdown_close_delay: 300,
	  detect_active: true,
	  detect_active_predicate: function(href, url) {
		return href === url;
	  }
	},
	consts: {
	  COLORS: ['#71c73e', '#77b7c5', '#d54848', '#6c42e5', '#e8e64e', '#dd56e6', '#ecad3f', '#618b9d', '#b68b68', '#36a766', '#3156be', '#00b3ff', '#646464', '#a946e8', '#9d9d9d']
	}
  };


  /*
   * @class PixelAdminApp
   */

  PixelAdminApp = function() {
	this.init = [];
	this.plugins = {};
	this.settings = {};
	this.localStorageSupported = typeof window.Storage !== "undefined" ? true : false;
	return this;
  };


  /*
   * Start application. Method takes an array of initializers and a settings object(that overrides default settings).
   * 
   * @param  {Array} suffix
   * @param  {Object} settings
   * @return this
   */

  PixelAdminApp.prototype.start = function(init, settings) {
	if (init == null) {
	  init = [];
	}
	if (settings == null) {
	  settings = {};
	}
	window.onload = (function(_this) {
	  return function() {
		var initilizer, _i, _len, _ref;
		$('html').addClass('pxajs');
		if (init.length > 0) {
		  $.merge(_this.init, init);
		}
		_this.settings = $.extend(true, {}, SETTINGS_DEFAULTS, settings || {});
		_this.settings.is_mobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
		if (_this.settings.is_mobile) {
		  if (FastClick) {
			FastClick.attach(document.body);
		  }
		}
		_ref = _this.init;
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		  initilizer = _ref[_i];
		  $.proxy(initilizer, _this)();
		}
		$(window).trigger("pa.loaded");
		return $(window).resize();
	  };
	})(this);
	return this;
  };


  /*
   * Add initializer to the stack.
   * 
   * @param  {Function} callback
   */

  PixelAdminApp.prototype.addInitializer = function(callback) {
	return this.init.push(callback);
  };


  /*
   * Initialize plugin and add it to the plugins list.
   * 
   * @param  {String} plugin_name
   * @param  {Instance} plugin
   */

  PixelAdminApp.prototype.initPlugin = function(plugin_name, plugin) {
	this.plugins[plugin_name] = plugin;
	if (plugin.init) {
	  return plugin.init();
	}
  };


  /*
   * Save value in the localStorage/Cookies.
   * 
   * @param  {String}  key
   * @param  {String}  value
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.storeValue = function(key, value, use_cookies) {
	var e;
	if (use_cookies == null) {
	  use_cookies = false;
	}
	if (this.localStorageSupported && !use_cookies) {
	  try {
		window.localStorage.setItem(this.settings.stored_values_prefix + key, value);
		return;
	  } catch (_error) {
		e = _error;
		1;
	  }
	}
	return document.cookie = this.settings.stored_values_prefix + key + '=' + escape(value);
  };


  /*
   * Save key/value pairs in the localStorage/Cookies.
   * 
   * @param  {Object} pairs
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.storeValues = function(pairs, use_cookies) {
	var e, key, value, _results;
	if (use_cookies == null) {
	  use_cookies = false;
	}
	if (this.localStorageSupported && !use_cookies) {
	  try {
		for (key in pairs) {
		  value = pairs[key];
		  window.localStorage.setItem(this.settings.stored_values_prefix + key, value);
		}
		return;
	  } catch (_error) {
		e = _error;
		1;
	  }
	}
	_results = [];
	for (key in pairs) {
	  value = pairs[key];
	  _results.push(document.cookie = this.settings.stored_values_prefix + key + '=' + escape(value));
	}
	return _results;
  };


  /*
   * Get value from the localStorage/Cookies.
   * 
   * @param  {String} key
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.getStoredValue = function(key, use_cookies, deflt) {
	var cookie, cookies, e, k, pos, r, v, _i, _len;
	if (use_cookies == null) {
	  use_cookies = false;
	}
	if (deflt == null) {
	  deflt = null;
	}
	if (this.localStorageSupported && !use_cookies) {
	  try {
		r = window.localStorage.getItem(this.settings.stored_values_prefix + key);
		return (r ? r : deflt);
	  } catch (_error) {
		e = _error;
		1;
	  }
	}
	cookies = document.cookie.split(';');
	for (_i = 0, _len = cookies.length; _i < _len; _i++) {
	  cookie = cookies[_i];
	  pos = cookie.indexOf('=');
	  k = cookie.substr(0, pos).replace(/^\s+|\s+$/g, '');
	  v = cookie.substr(pos + 1).replace(/^\s+|\s+$/g, '');
	  if (k === (this.settings.stored_values_prefix + key)) {
		return v;
	  }
	}
	return deflt;
  };


  /*
   * Get values from the localStorage/Cookies.
   * 
   * @param  {Array} keys
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.getStoredValues = function(keys, use_cookies, deflt) {
	var cookie, cookies, e, k, key, pos, r, result, v, _i, _j, _k, _len, _len1, _len2;
	if (use_cookies == null) {
	  use_cookies = false;
	}
	if (deflt == null) {
	  deflt = null;
	}
	result = {};
	for (_i = 0, _len = keys.length; _i < _len; _i++) {
	  key = keys[_i];
	  result[key] = deflt;
	}
	if (this.localStorageSupported && !use_cookies) {
	  try {
		for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
		  key = keys[_j];
		  r = window.localStorage.getItem(this.settings.stored_values_prefix + key);
		  if (r) {
			result[key] = r;
		  }
		}
		return result;
	  } catch (_error) {
		e = _error;
		1;
	  }
	}
	cookies = document.cookie.split(';');
	for (_k = 0, _len2 = cookies.length; _k < _len2; _k++) {
	  cookie = cookies[_k];
	  pos = cookie.indexOf('=');
	  k = cookie.substr(0, pos).replace(/^\s+|\s+$/g, '');
	  v = cookie.substr(pos + 1).replace(/^\s+|\s+$/g, '');
	  if (k === (this.settings.stored_values_prefix + key)) {
		result[key] = v;
	  }
	}
	return result;
  };

  PixelAdminApp.Constructor = PixelAdminApp;

  window.PixelAdmin = new PixelAdminApp;

}).call(this);
;
(function() {
  var delayedResizeHandler;

  delayedResizeHandler = function(callback) {
	var resizeTimer;
	resizeTimer = null;
	return function() {
	  if (resizeTimer) {
		clearTimeout(resizeTimer);
	  }
	  return resizeTimer = setTimeout(function() {
		resizeTimer = null;
		return callback.call(this);
	  }, PixelAdmin.settings.resize_delay);
	};
  };

  PixelAdmin.addInitializer(function() {
	var $ssw_point, $tsw_point, $window, _last_screen;
	_last_screen = null;
	$window = $(window);
	$ssw_point = $('<div id="small-screen-width-point" style="position:absolute;top:-10000px;width:10px;height:10px;background:#fff;"></div>');
	$tsw_point = $('<div id="tablet-screen-width-point" style="position:absolute;top:-10000px;width:10px;height:10px;background:#fff;"></div>');
	$('body').append($ssw_point).append($tsw_point);
	return $window.on('resize', delayedResizeHandler(function() {
	  $window.trigger("pa.resize");
	  if ($ssw_point.is(':visible')) {
		if (_last_screen !== 'small') {
		  $window.trigger("pa.screen.small");
		}
		return _last_screen = 'small';
	  } else if ($tsw_point.is(':visible')) {
		if (_last_screen !== 'tablet') {
		  $window.trigger("pa.screen.tablet");
		}
		return _last_screen = 'tablet';
	  } else {
		if (_last_screen !== 'desktop') {
		  $window.trigger("pa.screen.desktop");
		}
		return _last_screen = 'desktop';
	  }
	}));
  });

}).call(this);
;
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.11
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !this.deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			
			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}
;
/**
 *
 * Version: 0.0.4
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) 2013 Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/

;(function(window, document, $) {
  "use strict";

  // Plugin private cache

  var cache = {
	filterId: 0
  };

  var Vague = function(elm, customOptions) {
	// Default oprions
	var defaultOptions = {
	  intensity: 5,
	  forceSVGUrl: false
	},
	  options = $.extend(defaultOptions, customOptions);

	/*
	 *
	 * PUBLIC VARS
	 *
	 */

	this.$elm = elm instanceof $ ? elm : $(elm);

	/*
	 *
	 * PRIVATE VARS
	 *
	 */


	var blurred = false;

	/*
	 *
	 * features detection
	 *
	 */

	var browserPrefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
	  cssPrefixString = {},
	  cssPrefix = function(property) {
		if (cssPrefixString[property] || cssPrefixString[property] === '') return cssPrefixString[property] + property;
		var e = document.createElement('div');
		var prefixes = ['', 'Moz', 'Webkit', 'O', 'ms', 'Khtml']; // Various supports...
		for (var i in prefixes) {
		  if (typeof e.style[prefixes[i] + property] !== 'undefined') {
			cssPrefixString[property] = prefixes[i];
			return prefixes[i] + property;
		  }
		}
		return property.toLowerCase();
	  },

	  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css-filters.js
	  cssfilters = function() {
		var el = document.createElement('div');
		el.style.cssText = browserPrefixes.join('filter' + ':blur(2px); ');
		return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
	  }(),

	  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg-filters.js
	  svgfilters = function() {
		var result = false;
		try {
		  result = typeof SVGFEColorMatrixElement !== undefined &&
			SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
		} catch (e) {}
		return result;
	  }(),

	  /*
	   *
	   * PRIVATE METHODS
	   *
	   */

	  appendSVGFilter = function() {

		var filterMarkup = "<svg id='vague-svg-blur' style='position:absolute;' width='0' height='0' >" +
		  "<filter id='blur-effect-id-" + cache.filterId + "'>" +
		  "<feGaussianBlur stdDeviation='" + options.intensity + "' />" +
		  "</filter>" +
		  "</svg>";

		$("body").append(filterMarkup);

	  };

	/*
	 *
	 * PUBLIC METHODS
	 *
	 */

	this.init = function() {
	  // checking the css filter feature

	  if (svgfilters) {
		appendSVGFilter();
	  }

	  this.$elm.data("vague-filter-id", cache.filterId);

	  cache.filterId++;

	};

	this.blur = function() {
	  var filterValue,
		loc = window.location,
		svgUrl = options.forceSVGUrl ? loc.protocol + "//" + loc.host + loc.pathname : '',
		filterId = this.$elm.data("vague-filter-id"),
		cssProp = {};
	  if (cssfilters) {
		filterValue = "blur(" + options.intensity + "px)";
	  } else if (svgfilters) {
		filterValue = "url(" + svgUrl + "#blur-effect-id-" + filterId + ")";
	  } else {
		filterValue = "progid:DXImageTransform.Microsoft.Blur(pixelradius=" + options.intensity + ")";
	  }
	  cssProp[cssPrefix('Filter')] = filterValue;

	  this.$elm.css(cssProp);

	  blurred = true;
	};

	this.unblur = function() {
	  var cssProp = {};
	  cssProp[cssPrefix('Filter')] = "none";
	  this.$elm.css(cssProp);
	  blurred = false;
	};

	this.toggleblur = function() {
	  if (blurred) {
		this.unblur();
	  } else {
		this.blur();
	  }
	};

	this.destroy = function() {
	  if (svgfilters) {
		$("filter#blur-effect-id-" + this.$elm.data("vague-filter-id")).parent().remove();
	  }
	  this.unblur();
	};
	return this.init();
  };

  $.fn.Vague = function(options) {
	return new Vague(this, options);
  };

  window.Vague = Vague;

}(window, document, jQuery));;
/*
Copyright 2012 Igor Vaynberg

Version: 3.4.5 Timestamp: Mon Nov  4 08:22:42 PST 2013

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

	http://www.apache.org/licenses/LICENSE-2.0
	http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
(function ($) {
	if(typeof $.fn.each2 == "undefined") {
		$.extend($.fn, {
			/*
			* 4-10 times faster .each replacement
			* use it carefully, as it overrides jQuery context of element on each iteration
			*/
			each2 : function (c) {
				var j = $([0]), i = -1, l = this.length;
				while (
					++i < l
					&& (j.context = j[0] = this[i])
					&& c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
				);
				return this;
			}
		});
	}
})(jQuery);

(function ($, undefined) {
	"use strict";
	/*global document, window, jQuery, console */

	if (window.Select2 !== undefined) {
		return;
	}

	var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
		lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

	KEY = {
		TAB: 9,
		ENTER: 13,
		ESC: 27,
		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		HOME: 36,
		END: 35,
		BACKSPACE: 8,
		DELETE: 46,
		isArrow: function (k) {
			k = k.which ? k.which : k;
			switch (k) {
			case KEY.LEFT:
			case KEY.RIGHT:
			case KEY.UP:
			case KEY.DOWN:
				return true;
			}
			return false;
		},
		isControl: function (e) {
			var k = e.which;
			switch (k) {
			case KEY.SHIFT:
			case KEY.CTRL:
			case KEY.ALT:
				return true;
			}

			if (e.metaKey) return true;

			return false;
		},
		isFunctionKey: function (k) {
			k = k.which ? k.which : k;
			return k >= 112 && k <= 123;
		}
	},
	MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

	DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z"};

	$document = $(document);

	nextUid=(function() { var counter=1; return function() { return counter++; }; }());


	function stripDiacritics(str) {
		var ret, i, l, c;

		if (!str || str.length < 1) return str;

		ret = "";
		for (i = 0, l = str.length; i < l; i++) {
			c = str.charAt(i);
			ret += DIACRITICS[c] || c;
		}
		return ret;
	}

	function indexOf(value, array) {
		var i = 0, l = array.length;
		for (; i < l; i = i + 1) {
			if (equal(value, array[i])) return i;
		}
		return -1;
	}

	function measureScrollbar () {
		var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
		$template.appendTo('body');

		var dim = {
			width: $template.width() - $template[0].clientWidth,
			height: $template.height() - $template[0].clientHeight
		};
		$template.remove();

		return dim;
	}

	/**
	 * Compares equality of a and b
	 * @param a
	 * @param b
	 */
	function equal(a, b) {
		if (a === b) return true;
		if (a === undefined || b === undefined) return false;
		if (a === null || b === null) return false;
		// Check whether 'a' or 'b' is a string (primitive or object).
		// The concatenation of an empty string (+'') converts its argument to a string's primitive.
		if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
		if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
		return false;
	}

	/**
	 * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
	 * strings
	 * @param string
	 * @param separator
	 */
	function splitVal(string, separator) {
		var val, i, l;
		if (string === null || string.length < 1) return [];
		val = string.split(separator);
		for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
		return val;
	}

	function getSideBorderPadding(element) {
		return element.outerWidth(false) - element.width();
	}

	function installKeyUpChangeEvent(element) {
		var key="keyup-change-value";
		element.on("keydown", function () {
			if ($.data(element, key) === undefined) {
				$.data(element, key, element.val());
			}
		});
		element.on("keyup", function () {
			var val= $.data(element, key);
			if (val !== undefined && element.val() !== val) {
				$.removeData(element, key);
				element.trigger("keyup-change");
			}
		});
	}

	$document.on("mousemove", function (e) {
		lastMousePosition.x = e.pageX;
		lastMousePosition.y = e.pageY;
	});

	/**
	 * filters mouse events so an event is fired only if the mouse moved.
	 *
	 * filters out mouse events that occur when mouse is stationary but
	 * the elements under the pointer are scrolled.
	 */
	function installFilteredMouseMove(element) {
		element.on("mousemove", function (e) {
			var lastpos = lastMousePosition;
			if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
				$(e.target).trigger("mousemove-filtered", e);
			}
		});
	}

	/**
	 * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
	 * within the last quietMillis milliseconds.
	 *
	 * @param quietMillis number of milliseconds to wait before invoking fn
	 * @param fn function to be debounced
	 * @param ctx object to be used as this reference within fn
	 * @return debounced version of fn
	 */
	function debounce(quietMillis, fn, ctx) {
		ctx = ctx || undefined;
		var timeout;
		return function () {
			var args = arguments;
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function() {
				fn.apply(ctx, args);
			}, quietMillis);
		};
	}

	/**
	 * A simple implementation of a thunk
	 * @param formula function used to lazily initialize the thunk
	 * @return {Function}
	 */
	function thunk(formula) {
		var evaluated = false,
			value;
		return function() {
			if (evaluated === false) { value = formula(); evaluated = true; }
			return value;
		};
	};

	function installDebouncedScroll(threshold, element) {
		var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
		element.on("scroll", function (e) {
			if (indexOf(e.target, element.get()) >= 0) notify(e);
		});
	}

	function focus($el) {
		if ($el[0] === document.activeElement) return;

		/* set the focus in a 0 timeout - that way the focus is set after the processing
			of the current event has finished - which seems like the only reliable way
			to set focus */
		window.setTimeout(function() {
			var el=$el[0], pos=$el.val().length, range;

			$el.focus();

			/* make sure el received focus so we do not error out when trying to manipulate the caret.
				sometimes modals or others listeners may steal it after its set */
			if ($el.is(":visible") && el === document.activeElement) {

				/* after the focus is set move the caret to the end, necessary when we val()
					just before setting focus */
				if(el.setSelectionRange)
				{
					el.setSelectionRange(pos, pos);
				}
				else if (el.createTextRange) {
					range = el.createTextRange();
					range.collapse(false);
					range.select();
				}
			}
		}, 0);
	}

	function getCursorInfo(el) {
		el = $(el)[0];
		var offset = 0;
		var length = 0;
		if ('selectionStart' in el) {
			offset = el.selectionStart;
			length = el.selectionEnd - offset;
		} else if ('selection' in document) {
			el.focus();
			var sel = document.selection.createRange();
			length = document.selection.createRange().text.length;
			sel.moveStart('character', -el.value.length);
			offset = sel.text.length - length;
		}
		return { offset: offset, length: length };
	}

	function killEvent(event) {
		event.preventDefault();
		event.stopPropagation();
	}
	function killEventImmediately(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	function measureTextWidth(e) {
		if (!sizer){
			var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
			sizer = $(document.createElement("div")).css({
				position: "absolute",
				left: "-10000px",
				top: "-10000px",
				display: "none",
				fontSize: style.fontSize,
				fontFamily: style.fontFamily,
				fontStyle: style.fontStyle,
				fontWeight: style.fontWeight,
				letterSpacing: style.letterSpacing,
				textTransform: style.textTransform,
				whiteSpace: "nowrap"
			});
			sizer.attr("class","select2-sizer");
			$("body").append(sizer);
		}
		sizer.text(e.val());
		return sizer.width();
	}

	function syncCssClasses(dest, src, adapter) {
		var classes, replacements = [], adapted;

		classes = dest.attr("class");
		if (classes) {
			classes = '' + classes; // for IE which returns object
			$(classes.split(" ")).each2(function() {
				if (this.indexOf("select2-") === 0) {
					replacements.push(this);
				}
			});
		}
		classes = src.attr("class");
		if (classes) {
			classes = '' + classes; // for IE which returns object
			$(classes.split(" ")).each2(function() {
				if (this.indexOf("select2-") !== 0) {
					adapted = adapter(this);
					if (adapted) {
						replacements.push(adapted);
					}
				}
			});
		}
		dest.attr("class", replacements.join(" "));
	}


	function markMatch(text, term, markup, escapeMarkup) {
		var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
			tl=term.length;

		if (match<0) {
			markup.push(escapeMarkup(text));
			return;
		}

		markup.push(escapeMarkup(text.substring(0, match)));
		markup.push("<span class='select2-match'>");
		markup.push(escapeMarkup(text.substring(match, match + tl)));
		markup.push("</span>");
		markup.push(escapeMarkup(text.substring(match + tl, text.length)));
	}

	function defaultEscapeMarkup(markup) {
		var replace_map = {
			'\\': '&#92;',
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
			"/": '&#47;'
		};

		return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
			return replace_map[match];
		});
	}

	/**
	 * Produces an ajax-based query function
	 *
	 * @param options object containing configuration paramters
	 * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
	 * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
	 * @param options.url url for the data
	 * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
	 * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
	 * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
	 * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
	 *      The expected format is an object containing the following keys:
	 *      results array of objects that will be used as choices
	 *      more (optional) boolean indicating whether there are more results available
	 *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
	 */
	function ajax(options) {
		var timeout, // current scheduled but not yet executed request
			handler = null,
			quietMillis = options.quietMillis || 100,
			ajaxUrl = options.url,
			self = this;

		return function (query) {
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function () {
				var data = options.data, // ajax data function
					url = ajaxUrl, // ajax url string or function
					transport = options.transport || $.fn.select2.ajaxDefaults.transport,
					// deprecated - to be removed in 4.0  - use params instead
					deprecated = {
						type: options.type || 'GET', // set type of request (GET or POST)
						cache: options.cache || false,
						jsonpCallback: options.jsonpCallback||undefined,
						dataType: options.dataType||"json"
					},
					params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

				data = data ? data.call(self, query.term, query.page, query.context) : null;
				url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

				if (handler) { handler.abort(); }

				if (options.params) {
					if ($.isFunction(options.params)) {
						$.extend(params, options.params.call(self));
					} else {
						$.extend(params, options.params);
					}
				}

				$.extend(params, {
					url: url,
					dataType: options.dataType,
					data: data,
					success: function (data) {
						// TODO - replace query.page with query so users have access to term, page, etc.
						var results = options.results(data, query.page);
						query.callback(results);
					}
				});
				handler = transport.call(self, params);
			}, quietMillis);
		};
	}

	/**
	 * Produces a query function that works with a local array
	 *
	 * @param options object containing configuration parameters. The options parameter can either be an array or an
	 * object.
	 *
	 * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
	 *
	 * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
	 * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
	 * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
	 * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
	 * the text.
	 */
	function local(options) {
		var data = options, // data elements
			dataText,
			tmp,
			text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

		 if ($.isArray(data)) {
			tmp = data;
			data = { results: tmp };
		}

		 if ($.isFunction(data) === false) {
			tmp = data;
			data = function() { return tmp; };
		}

		var dataItem = data();
		if (dataItem.text) {
			text = dataItem.text;
			// if text is not a function we assume it to be a key name
			if (!$.isFunction(text)) {
				dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
				text = function (item) { return item[dataText]; };
			}
		}

		return function (query) {
			var t = query.term, filtered = { results: [] }, process;
			if (t === "") {
				query.callback(data());
				return;
			}

			process = function(datum, collection) {
				var group, attr;
				datum = datum[0];
				if (datum.children) {
					group = {};
					for (attr in datum) {
						if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
					}
					group.children=[];
					$(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
					if (group.children.length || query.matcher(t, text(group), datum)) {
						collection.push(group);
					}
				} else {
					if (query.matcher(t, text(datum), datum)) {
						collection.push(datum);
					}
				}
			};

			$(data().results).each2(function(i, datum) { process(datum, filtered.results); });
			query.callback(filtered);
		};
	}

	// TODO javadoc
	function tags(data) {
		var isFunc = $.isFunction(data);
		return function (query) {
			var t = query.term, filtered = {results: []};
			$(isFunc ? data() : data).each(function () {
				var isObject = this.text !== undefined,
					text = isObject ? this.text : this;
				if (t === "" || query.matcher(t, text)) {
					filtered.results.push(isObject ? this : {id: this, text: this});
				}
			});
			query.callback(filtered);
		};
	}

	/**
	 * Checks if the formatter function should be used.
	 *
	 * Throws an error if it is not a function. Returns true if it should be used,
	 * false if no formatting should be performed.
	 *
	 * @param formatter
	 */
	function checkFormatter(formatter, formatterName) {
		if ($.isFunction(formatter)) return true;
		if (!formatter) return false;
		throw new Error(formatterName +" must be a function or a falsy value");
	}

	function evaluate(val) {
		return $.isFunction(val) ? val() : val;
	}

	function countResults(results) {
		var count = 0;
		$.each(results, function(i, item) {
			if (item.children) {
				count += countResults(item.children);
			} else {
				count++;
			}
		});
		return count;
	}

	/**
	 * Default tokenizer. This function uses breaks the input on substring match of any string from the
	 * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
	 * two options have to be defined in order for the tokenizer to work.
	 *
	 * @param input text user has typed so far or pasted into the search field
	 * @param selection currently selected choices
	 * @param selectCallback function(choice) callback tho add the choice to selection
	 * @param opts select2's opts
	 * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
	 */
	function defaultTokenizer(input, selection, selectCallback, opts) {
		var original = input, // store the original so we can compare and know if we need to tell the search to update its text
			dupe = false, // check for whether a token we extracted represents a duplicate selected choice
			token, // token
			index, // position at which the separator was found
			i, l, // looping variables
			separator; // the matched separator

		if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

		while (true) {
			index = -1;

			for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
				separator = opts.tokenSeparators[i];
				index = input.indexOf(separator);
				if (index >= 0) break;
			}

			if (index < 0) break; // did not find any token separator in the input string, bail

			token = input.substring(0, index);
			input = input.substring(index + separator.length);

			if (token.length > 0) {
				token = opts.createSearchChoice.call(this, token, selection);
				if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
					dupe = false;
					for (i = 0, l = selection.length; i < l; i++) {
						if (equal(opts.id(token), opts.id(selection[i]))) {
							dupe = true; break;
						}
					}

					if (!dupe) selectCallback(token);
				}
			}
		}

		if (original!==input) return input;
	}

	/**
	 * Creates a new class
	 *
	 * @param superClass
	 * @param methods
	 */
	function clazz(SuperClass, methods) {
		var constructor = function () {};
		constructor.prototype = new SuperClass;
		constructor.prototype.constructor = constructor;
		constructor.prototype.parent = SuperClass.prototype;
		constructor.prototype = $.extend(constructor.prototype, methods);
		return constructor;
	}

	AbstractSelect2 = clazz(Object, {

		// abstract
		bind: function (func) {
			var self = this;
			return function () {
				func.apply(self, arguments);
			};
		},

		// abstract
		init: function (opts) {
			var results, search, resultsSelector = ".select2-results";

			// prepare options
			this.opts = opts = this.prepareOpts(opts);

			this.id=opts.id;

			// destroy if called on an existing component
			if (opts.element.data("select2") !== undefined &&
				opts.element.data("select2") !== null) {
				opts.element.data("select2").destroy();
			}

			this.container = this.createContainer();

			this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
			this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
			this.container.attr("id", this.containerId);

			// cache the body so future lookups are cheap
			this.body = thunk(function() { return opts.element.closest("body"); });

			syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

			this.container.attr("style", opts.element.attr("style"));
			this.container.css(evaluate(opts.containerCss));
			this.container.addClass(evaluate(opts.containerCssClass));

			this.elementTabIndex = this.opts.element.attr("tabindex");

			// swap container for the element
			this.opts.element
				.data("select2", this)
				.attr("tabindex", "-1")
				.before(this.container)
				.on("click.select2", killEvent); // do not leak click events

			this.container.data("select2", this);

			this.dropdown = this.container.find(".select2-drop");

			syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

			this.dropdown.addClass(evaluate(opts.dropdownCssClass));
			this.dropdown.data("select2", this);
			this.dropdown.on("click", killEvent);

			this.results = results = this.container.find(resultsSelector);
			this.search = search = this.container.find("input.select2-input");

			this.queryCount = 0;
			this.resultsPage = 0;
			this.context = null;

			// initialize the container
			this.initContainer();

			this.container.on("click", killEvent);

			installFilteredMouseMove(this.results);
			this.dropdown.on("mousemove-filtered touchstart touchmove touchend", resultsSelector, this.bind(this.highlightUnderEvent));

			installDebouncedScroll(80, this.results);
			this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

			// do not propagate change event from the search field out of the component
			$(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
			$(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

			// if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
			if ($.fn.mousewheel) {
				results.mousewheel(function (e, delta, deltaX, deltaY) {
					var top = results.scrollTop();
					if (deltaY > 0 && top - deltaY <= 0) {
						results.scrollTop(0);
						killEvent(e);
					} else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
						results.scrollTop(results.get(0).scrollHeight - results.height());
						killEvent(e);
					}
				});
			}

			installKeyUpChangeEvent(search);
			search.on("keyup-change input paste", this.bind(this.updateResults));
			search.on("focus", function () { search.addClass("select2-focused"); });
			search.on("blur", function () { search.removeClass("select2-focused");});

			this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
				if ($(e.target).closest(".select2-result-selectable").length > 0) {
					this.highlightUnderEvent(e);
					this.selectHighlighted(e);
				}
			}));

			// trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
			// for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
			// dom it will trigger the popup close, which is not what we want
			this.dropdown.on("click mouseup mousedown", function (e) { e.stopPropagation(); });

			if ($.isFunction(this.opts.initSelection)) {
				// initialize selection based on the current value of the source element
				this.initSelection();

				// if the user has provided a function that can set selection based on the value of the source element
				// we monitor the change event on the element and trigger it, allowing for two way synchronization
				this.monitorSource();
			}

			if (opts.maximumInputLength !== null) {
				this.search.attr("maxlength", opts.maximumInputLength);
			}

			var disabled = opts.element.prop("disabled");
			if (disabled === undefined) disabled = false;
			this.enable(!disabled);

			var readonly = opts.element.prop("readonly");
			if (readonly === undefined) readonly = false;
			this.readonly(readonly);

			// Calculate size of scrollbar
			scrollBarDimensions = scrollBarDimensions || measureScrollbar();

			this.autofocus = opts.element.prop("autofocus");
			opts.element.prop("autofocus", false);
			if (this.autofocus) this.focus();

			this.nextSearchTerm = undefined;
		},

		// abstract
		destroy: function () {
			var element=this.opts.element, select2 = element.data("select2");

			this.close();

			if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }

			if (select2 !== undefined) {
				select2.container.remove();
				select2.dropdown.remove();
				element
					.removeClass("select2-offscreen")
					.removeData("select2")
					.off(".select2")
					.prop("autofocus", this.autofocus || false);
				if (this.elementTabIndex) {
					element.attr({tabindex: this.elementTabIndex});
				} else {
					element.removeAttr("tabindex");
				}
				element.show();
			}
		},

		// abstract
		optionToData: function(element) {
			if (element.is("option")) {
				return {
					id:element.prop("value"),
					text:element.text(),
					element: element.get(),
					css: element.attr("class"),
					disabled: element.prop("disabled"),
					locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
				};
			} else if (element.is("optgroup")) {
				return {
					text:element.attr("label"),
					children:[],
					element: element.get(),
					css: element.attr("class")
				};
			}
		},

		// abstract
		prepareOpts: function (opts) {
			var element, select, idKey, ajaxUrl, self = this;

			element = opts.element;

			if (element.get(0).tagName.toLowerCase() === "select") {
				this.select = select = opts.element;
			}

			if (select) {
				// these options are not allowed when attached to a select because they are picked up off the element itself
				$.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
					if (this in opts) {
						throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
					}
				});
			}

			opts = $.extend({}, {
				populateResults: function(container, results, query) {
					var populate, id=this.opts.id;

					populate=function(results, container, depth) {

						var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

						results = opts.sortResults(results, container, query);

						for (i = 0, l = results.length; i < l; i = i + 1) {

							result=results[i];

							disabled = (result.disabled === true);
							selectable = (!disabled) && (id(result) !== undefined);

							compound=result.children && result.children.length > 0;

							node=$("<li></li>");
							node.addClass("select2-results-dept-"+depth);
							node.addClass("select2-result");
							node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
							if (disabled) { node.addClass("select2-disabled"); }
							if (compound) { node.addClass("select2-result-with-children"); }
							node.addClass(self.opts.formatResultCssClass(result));

							label=$(document.createElement("div"));
							label.addClass("select2-result-label");

							formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
							if (formatted!==undefined) {
								label.html(formatted);
							}

							node.append(label);

							if (compound) {

								innerContainer=$("<ul></ul>");
								innerContainer.addClass("select2-result-sub");
								populate(result.children, innerContainer, depth+1);
								node.append(innerContainer);
							}

							node.data("select2-data", result);
							container.append(node);
						}
					};

					populate(results, container, 0);
				}
			}, $.fn.select2.defaults, opts);

			if (typeof(opts.id) !== "function") {
				idKey = opts.id;
				opts.id = function (e) { return e[idKey]; };
			}

			if ($.isArray(opts.element.data("select2Tags"))) {
				if ("tags" in opts) {
					throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
				}
				opts.tags=opts.element.data("select2Tags");
			}

			if (select) {
				opts.query = this.bind(function (query) {
					var data = { results: [], more: false },
						term = query.term,
						children, placeholderOption, process;

					process=function(element, collection) {
						var group;
						if (element.is("option")) {
							if (query.matcher(term, element.text(), element)) {
								collection.push(self.optionToData(element));
							}
						} else if (element.is("optgroup")) {
							group=self.optionToData(element);
							element.children().each2(function(i, elm) { process(elm, group.children); });
							if (group.children.length>0) {
								collection.push(group);
							}
						}
					};

					children=element.children();

					// ignore the placeholder option if there is one
					if (this.getPlaceholder() !== undefined && children.length > 0) {
						placeholderOption = this.getPlaceholderOption();
						if (placeholderOption) {
							children=children.not(placeholderOption);
						}
					}

					children.each2(function(i, elm) { process(elm, data.results); });

					query.callback(data);
				});
				// this is needed because inside val() we construct choices from options and there id is hardcoded
				opts.id=function(e) { return e.id; };
				opts.formatResultCssClass = function(data) { return data.css; };
			} else {
				if (!("query" in opts)) {

					if ("ajax" in opts) {
						ajaxUrl = opts.element.data("ajax-url");
						if (ajaxUrl && ajaxUrl.length > 0) {
							opts.ajax.url = ajaxUrl;
						}
						opts.query = ajax.call(opts.element, opts.ajax);
					} else if ("data" in opts) {
						opts.query = local(opts.data);
					} else if ("tags" in opts) {
						opts.query = tags(opts.tags);
						if (opts.createSearchChoice === undefined) {
							opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
						}
						if (opts.initSelection === undefined) {
							opts.initSelection = function (element, callback) {
								var data = [];
								$(splitVal(element.val(), opts.separator)).each(function () {
									var obj = { id: this, text: this },
										tags = opts.tags;
									if ($.isFunction(tags)) tags=tags();
									$(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
									data.push(obj);
								});

								callback(data);
							};
						}
					}
				}
			}
			if (typeof(opts.query) !== "function") {
				throw "query function not defined for Select2 " + opts.element.attr("id");
			}

			return opts;
		},

		/**
		 * Monitor the original element for changes and update select2 accordingly
		 */
		// abstract
		monitorSource: function () {
			var el = this.opts.element, sync, observer;

			el.on("change.select2", this.bind(function (e) {
				if (this.opts.element.data("select2-change-triggered") !== true) {
					this.initSelection();
				}
			}));

			sync = this.bind(function () {

				// sync enabled state
				var disabled = el.prop("disabled");
				if (disabled === undefined) disabled = false;
				this.enable(!disabled);

				var readonly = el.prop("readonly");
				if (readonly === undefined) readonly = false;
				this.readonly(readonly);

				syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
				this.container.addClass(evaluate(this.opts.containerCssClass));

				syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
				this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));

			});

			// IE8-10
			el.on("propertychange.select2", sync);

			// hold onto a reference of the callback to work around a chromium bug
			if (this.mutationCallback === undefined) {
				this.mutationCallback = function (mutations) {
					mutations.forEach(sync);
				}
			}

			// safari, chrome, firefox, IE11
			observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;
			if (observer !== undefined) {
				if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
				this.propertyObserver = new observer(this.mutationCallback);
				this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
			}
		},

		// abstract
		triggerSelect: function(data) {
			var evt = $.Event("select2-selecting", { val: this.id(data), object: data });
			this.opts.element.trigger(evt);
			return !evt.isDefaultPrevented();
		},

		/**
		 * Triggers the change event on the source element
		 */
		// abstract
		triggerChange: function (details) {

			details = details || {};
			details= $.extend({}, details, { type: "change", val: this.val() });
			// prevents recursive triggering
			this.opts.element.data("select2-change-triggered", true);
			this.opts.element.trigger(details);
			this.opts.element.data("select2-change-triggered", false);

			// some validation frameworks ignore the change event and listen instead to keyup, click for selects
			// so here we trigger the click event manually
			this.opts.element.click();

			// ValidationEngine ignorea the change event and listens instead to blur
			// so here we trigger the blur event manually if so desired
			if (this.opts.blurOnChange)
				this.opts.element.blur();
		},

		//abstract
		isInterfaceEnabled: function()
		{
			return this.enabledInterface === true;
		},

		// abstract
		enableInterface: function() {
			var enabled = this._enabled && !this._readonly,
				disabled = !enabled;

			if (enabled === this.enabledInterface) return false;

			this.container.toggleClass("select2-container-disabled", disabled);
			this.close();
			this.enabledInterface = enabled;

			return true;
		},

		// abstract
		enable: function(enabled) {
			if (enabled === undefined) enabled = true;
			if (this._enabled === enabled) return;
			this._enabled = enabled;

			this.opts.element.prop("disabled", !enabled);
			this.enableInterface();
		},

		// abstract
		disable: function() {
			this.enable(false);
		},

		// abstract
		readonly: function(enabled) {
			if (enabled === undefined) enabled = false;
			if (this._readonly === enabled) return false;
			this._readonly = enabled;

			this.opts.element.prop("readonly", enabled);
			this.enableInterface();
			return true;
		},

		// abstract
		opened: function () {
			return this.container.hasClass("select2-dropdown-open");
		},

		// abstract
		positionDropdown: function() {
			var $dropdown = this.dropdown,
				offset = this.container.offset(),
				height = this.container.outerHeight(false),
				width = this.container.outerWidth(false),
				dropHeight = $dropdown.outerHeight(false),
				$window = $(window),
				windowWidth = $window.width(),
				windowHeight = $window.height(),
				viewPortRight = $window.scrollLeft() + windowWidth,
				viewportBottom = $window.scrollTop() + windowHeight,
				dropTop = offset.top + height,
				dropLeft = offset.left,
				enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
				enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
				dropWidth = $dropdown.outerWidth(false),
				enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
				aboveNow = $dropdown.hasClass("select2-drop-above"),
				bodyOffset,
				above,
				changeDirection,
				css,
				resultsListNode;

			// always prefer the current above/below alignment, unless there is not enough room
			if (aboveNow) {
				above = true;
				if (!enoughRoomAbove && enoughRoomBelow) {
					changeDirection = true;
					above = false;
				}
			} else {
				above = false;
				if (!enoughRoomBelow && enoughRoomAbove) {
					changeDirection = true;
					above = true;
				}
			}

			//if we are changing direction we need to get positions when dropdown is hidden;
			if (changeDirection) {
				$dropdown.hide();
				offset = this.container.offset();
				height = this.container.outerHeight(false);
				width = this.container.outerWidth(false);
				dropHeight = $dropdown.outerHeight(false);
				viewPortRight = $window.scrollLeft() + windowWidth;
				viewportBottom = $window.scrollTop() + windowHeight;
				dropTop = offset.top + height;
				dropLeft = offset.left;
				dropWidth = $dropdown.outerWidth(false);
				enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
				$dropdown.show();
			}

			if (this.opts.dropdownAutoWidth) {
				resultsListNode = $('.select2-results', $dropdown)[0];
				$dropdown.addClass('select2-drop-auto-width');
				$dropdown.css('width', '');
				// Add scrollbar width to dropdown if vertical scrollbar is present
				dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
				dropWidth > width ? width = dropWidth : dropWidth = width;
				enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
			}
			else {
				this.container.removeClass('select2-drop-auto-width');
			}

			//console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
			//console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

			// fix positioning when body has an offset and is not position: static
			if (this.body().css('position') !== 'static') {
				bodyOffset = this.body().offset();
				dropTop -= bodyOffset.top;
				dropLeft -= bodyOffset.left;
			}

			if (!enoughRoomOnRight) {
			   dropLeft = offset.left + width - dropWidth;
			}

			css =  {
				left: dropLeft,
				width: width
			};

			if (above) {
				css.bottom = windowHeight - offset.top;
				css.top = 'auto';
				this.container.addClass("select2-drop-above");
				$dropdown.addClass("select2-drop-above");
			}
			else {
				css.top = dropTop;
				css.bottom = 'auto';
				this.container.removeClass("select2-drop-above");
				$dropdown.removeClass("select2-drop-above");
			}
			css = $.extend(css, evaluate(this.opts.dropdownCss));

			$dropdown.css(css);
		},

		// abstract
		shouldOpen: function() {
			var event;

			if (this.opened()) return false;

			if (this._enabled === false || this._readonly === true) return false;

			event = $.Event("select2-opening");
			this.opts.element.trigger(event);
			return !event.isDefaultPrevented();
		},

		// abstract
		clearDropdownAlignmentPreference: function() {
			// clear the classes used to figure out the preference of where the dropdown should be opened
			this.container.removeClass("select2-drop-above");
			this.dropdown.removeClass("select2-drop-above");
		},

		/**
		 * Opens the dropdown
		 *
		 * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
		 * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
		 */
		// abstract
		open: function () {

			if (!this.shouldOpen()) return false;

			this.opening();

			return true;
		},

		/**
		 * Performs the opening of the dropdown
		 */
		// abstract
		opening: function() {
			var cid = this.containerId,
				scroll = "scroll." + cid,
				resize = "resize."+cid,
				orient = "orientationchange."+cid,
				mask;

			this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

			this.clearDropdownAlignmentPreference();

			if(this.dropdown[0] !== this.body().children().last()[0]) {
				this.dropdown.detach().appendTo(this.body());
			}

			// create the dropdown mask if doesnt already exist
			mask = $("#select2-drop-mask");
			if (mask.length == 0) {
				mask = $(document.createElement("div"));
				mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
				mask.hide();
				mask.appendTo(this.body());
				mask.on("mousedown touchstart click", function (e) {
					var dropdown = $("#select2-drop"), self;
					if (dropdown.length > 0) {
						self=dropdown.data("select2");
						if (self.opts.selectOnBlur) {
							self.selectHighlighted({noFocus: true});
						}
						self.close({focus:true});
						e.preventDefault();
						e.stopPropagation();
					}
				});
			}

			// ensure the mask is always right before the dropdown
			if (this.dropdown.prev()[0] !== mask[0]) {
				this.dropdown.before(mask);
			}

			// move the global id to the correct dropdown
			$("#select2-drop").removeAttr("id");
			this.dropdown.attr("id", "select2-drop");

			// show the elements
			mask.show();

			this.positionDropdown();
			this.dropdown.show();
			this.positionDropdown();

			this.dropdown.addClass("select2-drop-active");

			// attach listeners to events that can change the position of the container and thus require
			// the position of the dropdown to be updated as well so it does not come unglued from the container
			var that = this;
			this.container.parents().add(window).each(function () {
				$(this).on(resize+" "+scroll+" "+orient, function (e) {
					that.positionDropdown();
				});
			});


		},

		// abstract
		close: function () {
			if (!this.opened()) return;

			var cid = this.containerId,
				scroll = "scroll." + cid,
				resize = "resize."+cid,
				orient = "orientationchange."+cid;

			// unbind event listeners
			this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

			this.clearDropdownAlignmentPreference();

			$("#select2-drop-mask").hide();
			this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
			this.dropdown.hide();
			this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
			this.results.empty();


			this.clearSearch();
			this.search.removeClass("select2-active");
			this.opts.element.trigger($.Event("select2-close"));
		},

		/**
		 * Opens control, sets input value, and updates results.
		 */
		// abstract
		externalSearch: function (term) {
			this.open();
			this.search.val(term);
			this.updateResults(false);
		},

		// abstract
		clearSearch: function () {

		},

		//abstract
		getMaximumSelectionSize: function() {
			return evaluate(this.opts.maximumSelectionSize);
		},

		// abstract
		ensureHighlightVisible: function () {
			var results = this.results, children, index, child, hb, rb, y, more;

			index = this.highlight();

			if (index < 0) return;

			if (index == 0) {

				// if the first element is highlighted scroll all the way to the top,
				// that way any unselectable headers above it will also be scrolled
				// into view

				results.scrollTop(0);
				return;
			}

			children = this.findHighlightableChoices().find('.select2-result-label');

			child = $(children[index]);

			hb = child.offset().top + child.outerHeight(true);

			// if this is the last child lets also make sure select2-more-results is visible
			if (index === children.length - 1) {
				more = results.find("li.select2-more-results");
				if (more.length > 0) {
					hb = more.offset().top + more.outerHeight(true);
				}
			}

			rb = results.offset().top + results.outerHeight(true);
			if (hb > rb) {
				results.scrollTop(results.scrollTop() + (hb - rb));
			}
			y = child.offset().top - results.offset().top;

			// make sure the top of the element is visible
			if (y < 0 && child.css('display') != 'none' ) {
				results.scrollTop(results.scrollTop() + y); // y is negative
			}
		},

		// abstract
		findHighlightableChoices: function() {
			return this.results.find(".select2-result-selectable:not(.select2-disabled, .select2-selected)");
		},

		// abstract
		moveHighlight: function (delta) {
			var choices = this.findHighlightableChoices(),
				index = this.highlight();

			while (index > -1 && index < choices.length) {
				index += delta;
				var choice = $(choices[index]);
				if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
					this.highlight(index);
					break;
				}
			}
		},

		// abstract
		highlight: function (index) {
			var choices = this.findHighlightableChoices(),
				choice,
				data;

			if (arguments.length === 0) {
				return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
			}

			if (index >= choices.length) index = choices.length - 1;
			if (index < 0) index = 0;

			this.removeHighlight();

			choice = $(choices[index]);
			choice.addClass("select2-highlighted");

			this.ensureHighlightVisible();

			data = choice.data("select2-data");
			if (data) {
				this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
			}
		},

		removeHighlight: function() {
			this.results.find(".select2-highlighted").removeClass("select2-highlighted");
		},

		// abstract
		countSelectableResults: function() {
			return this.findHighlightableChoices().length;
		},

		// abstract
		highlightUnderEvent: function (event) {
			var el = $(event.target).closest(".select2-result-selectable");
			if (el.length > 0 && !el.is(".select2-highlighted")) {
				var choices = this.findHighlightableChoices();
				this.highlight(choices.index(el));
			} else if (el.length == 0) {
				// if we are over an unselectable item remove all highlights
				this.removeHighlight();
			}
		},

		// abstract
		loadMoreIfNeeded: function () {
			var results = this.results,
				more = results.find("li.select2-more-results"),
				below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
				page = this.resultsPage + 1,
				self=this,
				term=this.search.val(),
				context=this.context;

			if (more.length === 0) return;
			below = more.offset().top - results.offset().top - results.height();

			if (below <= this.opts.loadMorePadding) {
				more.addClass("select2-active");
				this.opts.query({
						element: this.opts.element,
						term: term,
						page: page,
						context: context,
						matcher: this.opts.matcher,
						callback: this.bind(function (data) {

					// ignore a response if the select2 has been closed before it was received
					if (!self.opened()) return;


					self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
					self.postprocessResults(data, false, false);

					if (data.more===true) {
						more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
						window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
					} else {
						more.remove();
					}
					self.positionDropdown();
					self.resultsPage = page;
					self.context = data.context;
					this.opts.element.trigger({ type: "select2-loaded", items: data });
				})});
			}
		},

		/**
		 * Default tokenizer function which does nothing
		 */
		tokenize: function() {

		},

		/**
		 * @param initial whether or not this is the call to this method right after the dropdown has been opened
		 */
		// abstract
		updateResults: function (initial) {
			var search = this.search,
				results = this.results,
				opts = this.opts,
				data,
				self = this,
				input,
				term = search.val(),
				lastTerm = $.data(this.container, "select2-last-term"),
				// sequence number used to drop out-of-order responses
				queryNumber;

			// prevent duplicate queries against the same term
			if (initial !== true && lastTerm && equal(term, lastTerm)) return;

			$.data(this.container, "select2-last-term", term);

			// if the search is currently hidden we do not alter the results
			if (initial !== true && (this.showSearchInput === false || !this.opened())) {
				return;
			}

			function postRender() {
				search.removeClass("select2-active");
				self.positionDropdown();
			}

			function render(html) {
				results.html(html);
				postRender();
			}

			queryNumber = ++this.queryCount;

			var maxSelSize = this.getMaximumSelectionSize();
			if (maxSelSize >=1) {
				data = this.data();
				if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
					render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>");
					return;
				}
			}

			if (search.val().length < opts.minimumInputLength) {
				if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
					render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
				} else {
					render("");
				}
				if (initial && this.showSearch) this.showSearch(true);
				return;
			}

			if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
				if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
					render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>");
				} else {
					render("");
				}
				return;
			}

			if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
				render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
			}

			search.addClass("select2-active");

			this.removeHighlight();

			// give the tokenizer a chance to pre-process the input
			input = this.tokenize();
			if (input != undefined && input != null) {
				search.val(input);
			}

			this.resultsPage = 1;

			opts.query({
				element: opts.element,
					term: search.val(),
					page: this.resultsPage,
					context: null,
					matcher: opts.matcher,
					callback: this.bind(function (data) {
				var def; // default choice

				// ignore old responses
				if (queryNumber != this.queryCount) {
				  return;
				}

				// ignore a response if the select2 has been closed before it was received
				if (!this.opened()) {
					this.search.removeClass("select2-active");
					return;
				}

				// save context, if any
				this.context = (data.context===undefined) ? null : data.context;
				// create a default choice and prepend it to the list
				if (this.opts.createSearchChoice && search.val() !== "") {
					def = this.opts.createSearchChoice.call(self, search.val(), data.results);
					if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
						if ($(data.results).filter(
							function () {
								return equal(self.id(this), self.id(def));
							}).length === 0) {
							data.results.unshift(def);
						}
					}
				}

				if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
					render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
					return;
				}

				results.empty();
				self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

				if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
					results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
					window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
				}

				this.postprocessResults(data, initial);

				postRender();

				this.opts.element.trigger({ type: "select2-loaded", items: data });
			})});
		},

		// abstract
		cancel: function () {
			this.close();
		},

		// abstract
		blur: function () {
			// if selectOnBlur == true, select the currently highlighted option
			if (this.opts.selectOnBlur)
				this.selectHighlighted({noFocus: true});

			this.close();
			this.container.removeClass("select2-container-active");
			// synonymous to .is(':focus'), which is available in jquery >= 1.6
			if (this.search[0] === document.activeElement) { this.search.blur(); }
			this.clearSearch();
			this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
		},

		// abstract
		focusSearch: function () {
			focus(this.search);
		},

		// abstract
		selectHighlighted: function (options) {
			var index=this.highlight(),
				highlighted=this.results.find(".select2-highlighted"),
				data = highlighted.closest('.select2-result').data("select2-data");

			if (data) {
				this.highlight(index);
				this.onSelect(data, options);
			} else if (options && options.noFocus) {
				this.close();
			}
		},

		// abstract
		getPlaceholder: function () {
			var placeholderOption;
			return this.opts.element.attr("placeholder") ||
				this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
				this.opts.element.data("placeholder") ||
				this.opts.placeholder ||
				((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
		},

		// abstract
		getPlaceholderOption: function() {
			if (this.select) {
				var firstOption = this.select.children('option').first();
				if (this.opts.placeholderOption !== undefined ) {
					//Determine the placeholder option based on the specified placeholderOption setting
					return (this.opts.placeholderOption === "first" && firstOption) ||
						   (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
				} else if (firstOption.text() === "" && firstOption.val() === "") {
					//No explicit placeholder option specified, use the first if it's blank
					return firstOption;
				}
			}
		},

		/**
		 * Get the desired width for the container element.  This is
		 * derived first from option `width` passed to select2, then
		 * the inline 'style' on the original element, and finally
		 * falls back to the jQuery calculated element width.
		 */
		// abstract
		initContainerWidth: function () {
			function resolveContainerWidth() {
				var style, attrs, matches, i, l, attr;

				if (this.opts.width === "off") {
					return null;
				} else if (this.opts.width === "element"){
					return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
				} else if (this.opts.width === "copy" || this.opts.width === "resolve") {
					// check if there is inline style on the element that contains width
					style = this.opts.element.attr('style');
					if (style !== undefined) {
						attrs = style.split(';');
						for (i = 0, l = attrs.length; i < l; i = i + 1) {
							attr = attrs[i].replace(/\s/g, '');
							matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
							if (matches !== null && matches.length >= 1)
								return matches[1];
						}
					}

					if (this.opts.width === "resolve") {
						// next check if css('width') can resolve a width that is percent based, this is sometimes possible
						// when attached to input type=hidden or elements hidden via css
						style = this.opts.element.css('width');
						if (style.indexOf("%") > 0) return style;

						// finally, fallback on the calculated width of the element
						return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
					}

					return null;
				} else if ($.isFunction(this.opts.width)) {
					return this.opts.width();
				} else {
					return this.opts.width;
			   }
			};

			var width = resolveContainerWidth.call(this);
			if (width !== null) {
				this.container.css("width", width);
			}
		}
	});

	SingleSelect2 = clazz(AbstractSelect2, {

		// single

		createContainer: function () {
			var container = $(document.createElement("div")).attr({
				"class": "select2-container"
			}).html([
				"<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>",
				"   <span class='select2-chosen'>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>",
				"   <span class='select2-arrow'><b></b></span>",
				"</a>",
				"<input class='select2-focusser select2-offscreen' type='text'/>",
				"<div class='select2-drop select2-display-none'>",
				"   <div class='select2-search'>",
				"       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'/>",
				"   </div>",
				"   <ul class='select2-results'>",
				"   </ul>",
				"</div>"].join(""));
			return container;
		},

		// single
		enableInterface: function() {
			if (this.parent.enableInterface.apply(this, arguments)) {
				this.focusser.prop("disabled", !this.isInterfaceEnabled());
			}
		},

		// single
		opening: function () {
			var el, range, len;

			if (this.opts.minimumResultsForSearch >= 0) {
				this.showSearch(true);
			}

			this.parent.opening.apply(this, arguments);

			if (this.showSearchInput !== false) {
				// IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
				// all other browsers handle this just fine

				this.search.val(this.focusser.val());
			}
			this.search.focus();
			// move the cursor to the end after focussing, otherwise it will be at the beginning and
			// new text will appear *before* focusser.val()
			el = this.search.get(0);
			if (el.createTextRange) {
				range = el.createTextRange();
				range.collapse(false);
				range.select();
			} else if (el.setSelectionRange) {
				len = this.search.val().length;
				el.setSelectionRange(len, len);
			}

			// initializes search's value with nextSearchTerm (if defined by user)
			// ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
			if(this.search.val() === "") {
				if(this.nextSearchTerm != undefined){
					this.search.val(this.nextSearchTerm);
					this.search.select();
				}
			}

			this.focusser.prop("disabled", true).val("");
			this.updateResults(true);
			this.opts.element.trigger($.Event("select2-open"));
		},

		// single
		close: function (params) {
			if (!this.opened()) return;
			this.parent.close.apply(this, arguments);

			params = params || {focus: true};
			this.focusser.removeAttr("disabled");

			if (params.focus) {
				this.focusser.focus();
			}
		},

		// single
		focus: function () {
			if (this.opened()) {
				this.close();
			} else {
				this.focusser.removeAttr("disabled");
				this.focusser.focus();
			}
		},

		// single
		isFocused: function () {
			return this.container.hasClass("select2-container-active");
		},

		// single
		cancel: function () {
			this.parent.cancel.apply(this, arguments);
			this.focusser.removeAttr("disabled");
			this.focusser.focus();
		},

		// single
		destroy: function() {
			$("label[for='" + this.focusser.attr('id') + "']")
				.attr('for', this.opts.element.attr("id"));
			this.parent.destroy.apply(this, arguments);
		},

		// single
		initContainer: function () {

			var selection,
				container = this.container,
				dropdown = this.dropdown;

			if (this.opts.minimumResultsForSearch < 0) {
				this.showSearch(false);
			} else {
				this.showSearch(true);
			}

			this.selection = selection = container.find(".select2-choice");

			this.focusser = container.find(".select2-focusser");

			// rewrite labels from original element to focusser
			this.focusser.attr("id", "s2id_autogen"+nextUid());

			$("label[for='" + this.opts.element.attr("id") + "']")
				.attr('for', this.focusser.attr('id'));

			this.focusser.attr("tabindex", this.elementTabIndex);

			this.search.on("keydown", this.bind(function (e) {
				if (!this.isInterfaceEnabled()) return;

				if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
					// prevent the page from scrolling
					killEvent(e);
					return;
				}

				switch (e.which) {
					case KEY.UP:
					case KEY.DOWN:
						this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
						killEvent(e);
						return;
					case KEY.ENTER:
						this.selectHighlighted();
						killEvent(e);
						return;
					case KEY.TAB:
						this.selectHighlighted({noFocus: true});
						return;
					case KEY.ESC:
						this.cancel(e);
						killEvent(e);
						return;
				}
			}));

			this.search.on("blur", this.bind(function(e) {
				// a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
				// without this the search field loses focus which is annoying
				if (document.activeElement === this.body().get(0)) {
					window.setTimeout(this.bind(function() {
						this.search.focus();
					}), 0);
				}
			}));

			this.focusser.on("keydown", this.bind(function (e) {
				if (!this.isInterfaceEnabled()) return;

				if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
					return;
				}

				if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
					killEvent(e);
					return;
				}

				if (e.which == KEY.DOWN || e.which == KEY.UP
					|| (e.which == KEY.ENTER && this.opts.openOnEnter)) {

					if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

					this.open();
					killEvent(e);
					return;
				}

				if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
					if (this.opts.allowClear) {
						this.clear();
					}
					killEvent(e);
					return;
				}
			}));


			installKeyUpChangeEvent(this.focusser);
			this.focusser.on("keyup-change input", this.bind(function(e) {
				if (this.opts.minimumResultsForSearch >= 0) {
					e.stopPropagation();
					if (this.opened()) return;
					this.open();
				}
			}));

			selection.on("mousedown", "abbr", this.bind(function (e) {
				if (!this.isInterfaceEnabled()) return;
				this.clear();
				killEventImmediately(e);
				this.close();
				this.selection.focus();
			}));

			selection.on("mousedown", this.bind(function (e) {

				if (!this.container.hasClass("select2-container-active")) {
					this.opts.element.trigger($.Event("select2-focus"));
				}

				if (this.opened()) {
					this.close();
				} else if (this.isInterfaceEnabled()) {
					this.open();
				}

				killEvent(e);
			}));

			dropdown.on("mousedown", this.bind(function() { this.search.focus(); }));

			selection.on("focus", this.bind(function(e) {
				killEvent(e);
			}));

			this.focusser.on("focus", this.bind(function(){
				if (!this.container.hasClass("select2-container-active")) {
					this.opts.element.trigger($.Event("select2-focus"));
				}
				this.container.addClass("select2-container-active");
			})).on("blur", this.bind(function() {
				if (!this.opened()) {
					this.container.removeClass("select2-container-active");
					this.opts.element.trigger($.Event("select2-blur"));
				}
			}));
			this.search.on("focus", this.bind(function(){
				if (!this.container.hasClass("select2-container-active")) {
					this.opts.element.trigger($.Event("select2-focus"));
				}
				this.container.addClass("select2-container-active");
			}));

			this.initContainerWidth();
			this.opts.element.addClass("select2-offscreen");
			this.setPlaceholder();

		},

		// single
		clear: function(triggerChange) {
			var data=this.selection.data("select2-data");
			if (data) { // guard against queued quick consecutive clicks
				var evt = $.Event("select2-clearing");
				this.opts.element.trigger(evt);
				if (evt.isDefaultPrevented()) {
					return;
				}
				var placeholderOption = this.getPlaceholderOption();
				this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
				this.selection.find(".select2-chosen").empty();
				this.selection.removeData("select2-data");
				this.setPlaceholder();

				if (triggerChange !== false){
					this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
					this.triggerChange({removed:data});
				}
			}
		},

		/**
		 * Sets selection based on source element's value
		 */
		// single
		initSelection: function () {
			var selected;
			if (this.isPlaceholderOptionSelected()) {
				this.updateSelection(null);
				this.close();
				this.setPlaceholder();
			} else {
				var self = this;
				this.opts.initSelection.call(null, this.opts.element, function(selected){
					if (selected !== undefined && selected !== null) {
						self.updateSelection(selected);
						self.close();
						self.setPlaceholder();
					}
				});
			}
		},

		isPlaceholderOptionSelected: function() {
			var placeholderOption;
			if (!this.getPlaceholder()) return false; // no placeholder specified so no option should be considered
			return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
				|| (this.opts.element.val() === "")
				|| (this.opts.element.val() === undefined)
				|| (this.opts.element.val() === null);
		},

		// single
		prepareOpts: function () {
			var opts = this.parent.prepareOpts.apply(this, arguments),
				self=this;

			if (opts.element.get(0).tagName.toLowerCase() === "select") {
				// install the selection initializer
				opts.initSelection = function (element, callback) {
					var selected = element.find("option").filter(function() { return this.selected });
					// a single select box always has a value, no need to null check 'selected'
					callback(self.optionToData(selected));
				};
			} else if ("data" in opts) {
				// install default initSelection when applied to hidden input and data is local
				opts.initSelection = opts.initSelection || function (element, callback) {
					var id = element.val();
					//search in data by id, storing the actual matching item
					var match = null;
					opts.query({
						matcher: function(term, text, el){
							var is_match = equal(id, opts.id(el));
							if (is_match) {
								match = el;
							}
							return is_match;
						},
						callback: !$.isFunction(callback) ? $.noop : function() {
							callback(match);
						}
					});
				};
			}

			return opts;
		},

		// single
		getPlaceholder: function() {
			// if a placeholder is specified on a single select without a valid placeholder option ignore it
			if (this.select) {
				if (this.getPlaceholderOption() === undefined) {
					return undefined;
				}
			}

			return this.parent.getPlaceholder.apply(this, arguments);
		},

		// single
		setPlaceholder: function () {
			var placeholder = this.getPlaceholder();

			if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {

				// check for a placeholder option if attached to a select
				if (this.select && this.getPlaceholderOption() === undefined) return;

				this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));

				this.selection.addClass("select2-default");

				this.container.removeClass("select2-allowclear");
			}
		},

		// single
		postprocessResults: function (data, initial, noHighlightUpdate) {
			var selected = 0, self = this, showSearchInput = true;

			// find the selected element in the result list

			this.findHighlightableChoices().each2(function (i, elm) {
				if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
					selected = i;
					return false;
				}
			});

			// and highlight it
			if (noHighlightUpdate !== false) {
				if (initial === true && selected >= 0) {
					this.highlight(selected);
				} else {
					this.highlight(0);
				}
			}

			// hide the search box if this is the first we got the results and there are enough of them for search

			if (initial === true) {
				var min = this.opts.minimumResultsForSearch;
				if (min >= 0) {
					this.showSearch(countResults(data.results) >= min);
				}
			}
		},

		// single
		showSearch: function(showSearchInput) {
			if (this.showSearchInput === showSearchInput) return;

			this.showSearchInput = showSearchInput;

			this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
			this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
			//add "select2-with-searchbox" to the container if search box is shown
			$(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
		},

		// single
		onSelect: function (data, options) {

			if (!this.triggerSelect(data)) { return; }

			var old = this.opts.element.val(),
				oldData = this.data();

			this.opts.element.val(this.id(data));
			this.updateSelection(data);

			this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });

			this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
			this.close();

			if (!options || !options.noFocus)
				this.focusser.focus();

			if (!equal(old, this.id(data))) { this.triggerChange({added:data,removed:oldData}); }
		},

		// single
		updateSelection: function (data) {

			var container=this.selection.find(".select2-chosen"), formatted, cssClass;

			this.selection.data("select2-data", data);

			container.empty();
			if (data !== null) {
				formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);
			}
			if (formatted !== undefined) {
				container.append(formatted);
			}
			cssClass=this.opts.formatSelectionCssClass(data, container);
			if (cssClass !== undefined) {
				container.addClass(cssClass);
			}

			this.selection.removeClass("select2-default");

			if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
				this.container.addClass("select2-allowclear");
			}
		},

		// single
		val: function () {
			var val,
				triggerChange = false,
				data = null,
				self = this,
				oldData = this.data();

			if (arguments.length === 0) {
				return this.opts.element.val();
			}

			val = arguments[0];

			if (arguments.length > 1) {
				triggerChange = arguments[1];
			}

			if (this.select) {
				this.select
					.val(val)
					.find("option").filter(function() { return this.selected }).each2(function (i, elm) {
						data = self.optionToData(elm);
						return false;
					});
				this.updateSelection(data);
				this.setPlaceholder();
				if (triggerChange) {
					this.triggerChange({added: data, removed:oldData});
				}
			} else {
				// val is an id. !val is true for [undefined,null,'',0] - 0 is legal
				if (!val && val !== 0) {
					this.clear(triggerChange);
					return;
				}
				if (this.opts.initSelection === undefined) {
					throw new Error("cannot call val() if initSelection() is not defined");
				}
				this.opts.element.val(val);
				this.opts.initSelection(this.opts.element, function(data){
					self.opts.element.val(!data ? "" : self.id(data));
					self.updateSelection(data);
					self.setPlaceholder();
					if (triggerChange) {
						self.triggerChange({added: data, removed:oldData});
					}
				});
			}
		},

		// single
		clearSearch: function () {
			this.search.val("");
			this.focusser.val("");
		},

		// single
		data: function(value) {
			var data,
				triggerChange = false;

			if (arguments.length === 0) {
				data = this.selection.data("select2-data");
				if (data == undefined) data = null;
				return data;
			} else {
				if (arguments.length > 1) {
					triggerChange = arguments[1];
				}
				if (!value) {
					this.clear(triggerChange);
				} else {
					data = this.data();
					this.opts.element.val(!value ? "" : this.id(value));
					this.updateSelection(value);
					if (triggerChange) {
						this.triggerChange({added: value, removed:data});
					}
				}
			}
		}
	});

	MultiSelect2 = clazz(AbstractSelect2, {

		// multi
		createContainer: function () {
			var container = $(document.createElement("div")).attr({
				"class": "select2-container select2-container-multi"
			}).html([
				"<ul class='select2-choices'>",
				"  <li class='select2-search-field'>",
				"    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
				"  </li>",
				"</ul>",
				"<div class='select2-drop select2-drop-multi select2-display-none'>",
				"   <ul class='select2-results'>",
				"   </ul>",
				"</div>"].join(""));
			return container;
		},

		// multi
		prepareOpts: function () {
			var opts = this.parent.prepareOpts.apply(this, arguments),
				self=this;

			// TODO validate placeholder is a string if specified

			if (opts.element.get(0).tagName.toLowerCase() === "select") {
				// install sthe selection initializer
				opts.initSelection = function (element, callback) {

					var data = [];

					element.find("option").filter(function() { return this.selected }).each2(function (i, elm) {
						data.push(self.optionToData(elm));
					});
					callback(data);
				};
			} else if ("data" in opts) {
				// install default initSelection when applied to hidden input and data is local
				opts.initSelection = opts.initSelection || function (element, callback) {
					var ids = splitVal(element.val(), opts.separator);
					//search in data by array of ids, storing matching items in a list
					var matches = [];
					opts.query({
						matcher: function(term, text, el){
							var is_match = $.grep(ids, function(id) {
								return equal(id, opts.id(el));
							}).length;
							if (is_match) {
								matches.push(el);
							}
							return is_match;
						},
						callback: !$.isFunction(callback) ? $.noop : function() {
							// reorder matches based on the order they appear in the ids array because right now
							// they are in the order in which they appear in data array
							var ordered = [];
							for (var i = 0; i < ids.length; i++) {
								var id = ids[i];
								for (var j = 0; j < matches.length; j++) {
									var match = matches[j];
									if (equal(id, opts.id(match))) {
										ordered.push(match);
										matches.splice(j, 1);
										break;
									}
								}
							}
							callback(ordered);
						}
					});
				};
			}

			return opts;
		},

		// multi
		selectChoice: function (choice) {

			var selected = this.container.find(".select2-search-choice-focus");
			if (selected.length && choice && choice[0] == selected[0]) {

			} else {
				if (selected.length) {
					this.opts.element.trigger("choice-deselected", selected);
				}
				selected.removeClass("select2-search-choice-focus");
				if (choice && choice.length) {
					this.close();
					choice.addClass("select2-search-choice-focus");
					this.opts.element.trigger("choice-selected", choice);
				}
			}
		},

		// multi
		destroy: function() {
			$("label[for='" + this.search.attr('id') + "']")
				.attr('for', this.opts.element.attr("id"));
			this.parent.destroy.apply(this, arguments);
		},

		// multi
		initContainer: function () {

			var selector = ".select2-choices", selection;

			this.searchContainer = this.container.find(".select2-search-field");
			this.selection = selection = this.container.find(selector);

			var _this = this;
			this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function (e) {
				//killEvent(e);
				_this.search[0].focus();
				_this.selectChoice($(this));
			});

			// rewrite labels from original element to focusser
			this.search.attr("id", "s2id_autogen"+nextUid());
			$("label[for='" + this.opts.element.attr("id") + "']")
				.attr('for', this.search.attr('id'));

			this.search.on("input paste", this.bind(function() {
				if (!this.isInterfaceEnabled()) return;
				if (!this.opened()) {
					this.open();
				}
			}));

			this.search.attr("tabindex", this.elementTabIndex);

			this.keydowns = 0;
			this.search.on("keydown", this.bind(function (e) {
				if (!this.isInterfaceEnabled()) return;

				++this.keydowns;
				var selected = selection.find(".select2-search-choice-focus");
				var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
				var next = selected.next(".select2-search-choice:not(.select2-locked)");
				var pos = getCursorInfo(this.search);

				if (selected.length &&
					(e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
					var selectedChoice = selected;
					if (e.which == KEY.LEFT && prev.length) {
						selectedChoice = prev;
					}
					else if (e.which == KEY.RIGHT) {
						selectedChoice = next.length ? next : null;
					}
					else if (e.which === KEY.BACKSPACE) {
						this.unselect(selected.first());
						this.search.width(10);
						selectedChoice = prev.length ? prev : next;
					} else if (e.which == KEY.DELETE) {
						this.unselect(selected.first());
						this.search.width(10);
						selectedChoice = next.length ? next : null;
					} else if (e.which == KEY.ENTER) {
						selectedChoice = null;
					}

					this.selectChoice(selectedChoice);
					killEvent(e);
					if (!selectedChoice || !selectedChoice.length) {
						this.open();
					}
					return;
				} else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)
					|| e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {

					this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
					killEvent(e);
					return;
				} else {
					this.selectChoice(null);
				}

				if (this.opened()) {
					switch (e.which) {
					case KEY.UP:
					case KEY.DOWN:
						this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
						killEvent(e);
						return;
					case KEY.ENTER:
						this.selectHighlighted();
						killEvent(e);
						return;
					case KEY.TAB:
						this.selectHighlighted({noFocus:true});
						this.close();
						return;
					case KEY.ESC:
						this.cancel(e);
						killEvent(e);
						return;
					}
				}

				if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
				 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
					return;
				}

				if (e.which === KEY.ENTER) {
					if (this.opts.openOnEnter === false) {
						return;
					} else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
						return;
					}
				}

				this.open();

				if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
					// prevent the page from scrolling
					killEvent(e);
				}

				if (e.which === KEY.ENTER) {
					// prevent form from being submitted
					killEvent(e);
				}

			}));

			this.search.on("keyup", this.bind(function (e) {
				this.keydowns = 0;
				this.resizeSearch();
			})
			);

			this.search.on("blur", this.bind(function(e) {
				this.container.removeClass("select2-container-active");
				this.search.removeClass("select2-focused");
				this.selectChoice(null);
				if (!this.opened()) this.clearSearch();
				e.stopImmediatePropagation();
				this.opts.element.trigger($.Event("select2-blur"));
			}));

			this.container.on("click", selector, this.bind(function (e) {
				if (!this.isInterfaceEnabled()) return;
				if ($(e.target).closest(".select2-search-choice").length > 0) {
					// clicked inside a select2 search choice, do not open
					return;
				}
				this.selectChoice(null);
				this.clearPlaceholder();
				if (!this.container.hasClass("select2-container-active")) {
					this.opts.element.trigger($.Event("select2-focus"));
				}
				this.open();
				this.focusSearch();
				e.preventDefault();
			}));

			this.container.on("focus", selector, this.bind(function () {
				if (!this.isInterfaceEnabled()) return;
				if (!this.container.hasClass("select2-container-active")) {
					this.opts.element.trigger($.Event("select2-focus"));
				}
				this.container.addClass("select2-container-active");
				this.dropdown.addClass("select2-drop-active");
				this.clearPlaceholder();
			}));

			this.initContainerWidth();
			this.opts.element.addClass("select2-offscreen");

			// set the placeholder if necessary
			this.clearSearch();
		},

		// multi
		enableInterface: function() {
			if (this.parent.enableInterface.apply(this, arguments)) {
				this.search.prop("disabled", !this.isInterfaceEnabled());
			}
		},

		// multi
		initSelection: function () {
			var data;
			if (this.opts.element.val() === "" && this.opts.element.text() === "") {
				this.updateSelection([]);
				this.close();
				// set the placeholder if necessary
				this.clearSearch();
			}
			if (this.select || this.opts.element.val() !== "") {
				var self = this;
				this.opts.initSelection.call(null, this.opts.element, function(data){
					if (data !== undefined && data !== null) {
						self.updateSelection(data);
						self.close();
						// set the placeholder if necessary
						self.clearSearch();
					}
				});
			}
		},

		// multi
		clearSearch: function () {
			var placeholder = this.getPlaceholder(),
				maxWidth = this.getMaxSearchWidth();

			if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
				this.search.val(placeholder).addClass("select2-default");
				// stretch the search box to full width of the container so as much of the placeholder is visible as possible
				// we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
				this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
			} else {
				this.search.val("").width(10);
			}
		},

		// multi
		clearPlaceholder: function () {
			if (this.search.hasClass("select2-default")) {
				this.search.val("").removeClass("select2-default");
			}
		},

		// multi
		opening: function () {
			this.clearPlaceholder(); // should be done before super so placeholder is not used to search
			this.resizeSearch();

			this.parent.opening.apply(this, arguments);

			this.focusSearch();

			this.updateResults(true);
			this.search.focus();
			this.opts.element.trigger($.Event("select2-open"));
		},

		// multi
		close: function () {
			if (!this.opened()) return;
			this.parent.close.apply(this, arguments);
		},

		// multi
		focus: function () {
			this.close();
			this.search.focus();
		},

		// multi
		isFocused: function () {
			return this.search.hasClass("select2-focused");
		},

		// multi
		updateSelection: function (data) {
			var ids = [], filtered = [], self = this;

			// filter out duplicates
			$(data).each(function () {
				if (indexOf(self.id(this), ids) < 0) {
					ids.push(self.id(this));
					filtered.push(this);
				}
			});
			data = filtered;

			this.selection.find(".select2-search-choice").remove();
			$(data).each(function () {
				self.addSelectedChoice(this);
			});
			self.postprocessResults();
		},

		// multi
		tokenize: function() {
			var input = this.search.val();
			input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
			if (input != null && input != undefined) {
				this.search.val(input);
				if (input.length > 0) {
					this.open();
				}
			}

		},

		// multi
		onSelect: function (data, options) {

			if (!this.triggerSelect(data)) { return; }

			this.addSelectedChoice(data);

			this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

			if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);

			if (this.opts.closeOnSelect) {
				this.close();
				this.search.width(10);
			} else {
				if (this.countSelectableResults()>0) {
					this.search.width(10);
					this.resizeSearch();
					if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
						// if we reached max selection size repaint the results so choices
						// are replaced with the max selection reached message
						this.updateResults(true);
					}
					this.positionDropdown();
				} else {
					// if nothing left to select close
					this.close();
					this.search.width(10);
				}
			}

			// since its not possible to select an element that has already been
			// added we do not need to check if this is a new element before firing change
			this.triggerChange({ added: data });

			if (!options || !options.noFocus)
				this.focusSearch();
		},

		// multi
		cancel: function () {
			this.close();
			this.focusSearch();
		},

		addSelectedChoice: function (data) {
			var enableChoice = !data.locked,
				enabledItem = $(
					"<li class='select2-search-choice'>" +
					"    <div></div>" +
					"    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
					"</li>"),
				disabledItem = $(
					"<li class='select2-search-choice select2-locked'>" +
					"<div></div>" +
					"</li>");
			var choice = enableChoice ? enabledItem : disabledItem,
				id = this.id(data),
				val = this.getVal(),
				formatted,
				cssClass;

			formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
			if (formatted != undefined) {
				choice.find("div").replaceWith("<div>"+formatted+"</div>");
			}
			cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));
			if (cssClass != undefined) {
				choice.addClass(cssClass);
			}

			if(enableChoice){
			  choice.find(".select2-search-choice-close")
				  .on("mousedown", killEvent)
				  .on("click dblclick", this.bind(function (e) {
				  if (!this.isInterfaceEnabled()) return;

				  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
					  this.unselect($(e.target));
					  this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
					  this.close();
					  this.focusSearch();
				  })).dequeue();
				  killEvent(e);
			  })).on("focus", this.bind(function () {
				  if (!this.isInterfaceEnabled()) return;
				  this.container.addClass("select2-container-active");
				  this.dropdown.addClass("select2-drop-active");
			  }));
			}

			choice.data("select2-data", data);
			choice.insertBefore(this.searchContainer);

			val.push(id);
			this.setVal(val);
		},

		// multi
		unselect: function (selected) {
			var val = this.getVal(),
				data,
				index;
			selected = selected.closest(".select2-search-choice");

			if (selected.length === 0) {
				throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
			}

			data = selected.data("select2-data");

			if (!data) {
				// prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
				// and invoked on an element already removed
				return;
			}

			while((index = indexOf(this.id(data), val)) >= 0) {
				val.splice(index, 1);
				this.setVal(val);
				if (this.select) this.postprocessResults();
			}

			var evt = $.Event("select2-removing");
			evt.val = this.id(data);
			evt.choice = data;
			this.opts.element.trigger(evt);

			if (evt.isDefaultPrevented()) {
				return;
			}

			selected.remove();

			this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
			this.triggerChange({ removed: data });
		},

		// multi
		postprocessResults: function (data, initial, noHighlightUpdate) {
			var val = this.getVal(),
				choices = this.results.find(".select2-result"),
				compound = this.results.find(".select2-result-with-children"),
				self = this;

			choices.each2(function (i, choice) {
				var id = self.id(choice.data("select2-data"));
				if (indexOf(id, val) >= 0) {
					choice.addClass("select2-selected");
					// mark all children of the selected parent as selected
					choice.find(".select2-result-selectable").addClass("select2-selected");
				}
			});

			compound.each2(function(i, choice) {
				// hide an optgroup if it doesnt have any selectable children
				if (!choice.is('.select2-result-selectable')
					&& choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
					choice.addClass("select2-selected");
				}
			});

			if (this.highlight() == -1 && noHighlightUpdate !== false){
				self.highlight(0);
			}

			//If all results are chosen render formatNoMAtches
			if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){
				if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
					if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
						this.results.append("<li class='select2-no-results'>" + self.opts.formatNoMatches(self.search.val()) + "</li>");
					}
				}
			}

		},

		// multi
		getMaxSearchWidth: function() {
			return this.selection.width() - getSideBorderPadding(this.search);
		},

		// multi
		resizeSearch: function () {
			var minimumWidth, left, maxWidth, containerLeft, searchWidth,
				sideBorderPadding = getSideBorderPadding(this.search);

			minimumWidth = measureTextWidth(this.search) + 10;

			left = this.search.offset().left;

			maxWidth = this.selection.width();
			containerLeft = this.selection.offset().left;

			searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

			if (searchWidth < minimumWidth) {
				searchWidth = maxWidth - sideBorderPadding;
			}

			if (searchWidth < 40) {
				searchWidth = maxWidth - sideBorderPadding;
			}

			if (searchWidth <= 0) {
			  searchWidth = minimumWidth;
			}

			this.search.width(Math.floor(searchWidth));
		},

		// multi
		getVal: function () {
			var val;
			if (this.select) {
				val = this.select.val();
				return val === null ? [] : val;
			} else {
				val = this.opts.element.val();
				return splitVal(val, this.opts.separator);
			}
		},

		// multi
		setVal: function (val) {
			var unique;
			if (this.select) {
				this.select.val(val);
			} else {
				unique = [];
				// filter out duplicates
				$(val).each(function () {
					if (indexOf(this, unique) < 0) unique.push(this);
				});
				this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
			}
		},

		// multi
		buildChangeDetails: function (old, current) {
			var current = current.slice(0),
				old = old.slice(0);

			// remove intersection from each array
			for (var i = 0; i < current.length; i++) {
				for (var j = 0; j < old.length; j++) {
					if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
						current.splice(i, 1);
						if(i>0){
							i--;
						}
						old.splice(j, 1);
						j--;
					}
				}
			}

			return {added: current, removed: old};
		},


		// multi
		val: function (val, triggerChange) {
			var oldData, self=this;

			if (arguments.length === 0) {
				return this.getVal();
			}

			oldData=this.data();
			if (!oldData.length) oldData=[];

			// val is an id. !val is true for [undefined,null,'',0] - 0 is legal
			if (!val && val !== 0) {
				this.opts.element.val("");
				this.updateSelection([]);
				this.clearSearch();
				if (triggerChange) {
					this.triggerChange({added: this.data(), removed: oldData});
				}
				return;
			}

			// val is a list of ids
			this.setVal(val);

			if (this.select) {
				this.opts.initSelection(this.select, this.bind(this.updateSelection));
				if (triggerChange) {
					this.triggerChange(this.buildChangeDetails(oldData, this.data()));
				}
			} else {
				if (this.opts.initSelection === undefined) {
					throw new Error("val() cannot be called if initSelection() is not defined");
				}

				this.opts.initSelection(this.opts.element, function(data){
					var ids=$.map(data, self.id);
					self.setVal(ids);
					self.updateSelection(data);
					self.clearSearch();
					if (triggerChange) {
						self.triggerChange(self.buildChangeDetails(oldData, self.data()));
					}
				});
			}
			this.clearSearch();
		},

		// multi
		onSortStart: function() {
			if (this.select) {
				throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
			}

			// collapse search field into 0 width so its container can be collapsed as well
			this.search.width(0);
			// hide the container
			this.searchContainer.hide();
		},

		// multi
		onSortEnd:function() {

			var val=[], self=this;

			// show search and move it to the end of the list
			this.searchContainer.show();
			// make sure the search container is the last item in the list
			this.searchContainer.appendTo(this.searchContainer.parent());
			// since we collapsed the width in dragStarted, we resize it here
			this.resizeSearch();

			// update selection
			this.selection.find(".select2-search-choice").each(function() {
				val.push(self.opts.id($(this).data("select2-data")));
			});
			this.setVal(val);
			this.triggerChange();
		},

		// multi
		data: function(values, triggerChange) {
			var self=this, ids, old;
			if (arguments.length === 0) {
				 return this.selection
					 .find(".select2-search-choice")
					 .map(function() { return $(this).data("select2-data"); })
					 .get();
			} else {
				old = this.data();
				if (!values) { values = []; }
				ids = $.map(values, function(e) { return self.opts.id(e); });
				this.setVal(ids);
				this.updateSelection(values);
				this.clearSearch();
				if (triggerChange) {
					this.triggerChange(this.buildChangeDetails(old, this.data()));
				}
			}
		}
	});

	$.fn.select2 = function () {

		var args = Array.prototype.slice.call(arguments, 0),
			opts,
			select2,
			method, value, multiple,
			allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
			valueMethods = ["opened", "isFocused", "container", "dropdown"],
			propertyMethods = ["val", "data"],
			methodsMap = { search: "externalSearch" };

		this.each(function () {
			if (args.length === 0 || typeof(args[0]) === "object") {
				opts = args.length === 0 ? {} : $.extend({}, args[0]);
				opts.element = $(this);

				if (opts.element.get(0).tagName.toLowerCase() === "select") {
					multiple = opts.element.prop("multiple");
				} else {
					multiple = opts.multiple || false;
					if ("tags" in opts) {opts.multiple = multiple = true;}
				}

				select2 = multiple ? new MultiSelect2() : new SingleSelect2();
				select2.init(opts);
			} else if (typeof(args[0]) === "string") {

				if (indexOf(args[0], allowedMethods) < 0) {
					throw "Unknown method: " + args[0];
				}

				value = undefined;
				select2 = $(this).data("select2");
				if (select2 === undefined) return;

				method=args[0];

				if (method === "container") {
					value = select2.container;
				} else if (method === "dropdown") {
					value = select2.dropdown;
				} else {
					if (methodsMap[method]) method = methodsMap[method];

					value = select2[method].apply(select2, args.slice(1));
				}
				if (indexOf(args[0], valueMethods) >= 0
					|| (indexOf(args[0], propertyMethods) && args.length == 1)) {
					return false; // abort the iteration, ready to return first matched value
				}
			} else {
				throw "Invalid arguments to select2 plugin: " + args;
			}
		});
		return (value === undefined) ? this : value;
	};

	// plugin defaults, accessible to users
	$.fn.select2.defaults = {
		width: "copy",
		loadMorePadding: 0,
		closeOnSelect: true,
		openOnEnter: true,
		containerCss: {},
		dropdownCss: {},
		containerCssClass: "",
		dropdownCssClass: "",
		formatResult: function(result, container, query, escapeMarkup) {
			var markup=[];
			markMatch(result.text, query.term, markup, escapeMarkup);
			return markup.join("");
		},
		formatSelection: function (data, container, escapeMarkup) {
			return data ? escapeMarkup(data.text) : undefined;
		},
		sortResults: function (results, container, query) {
			return results;
		},
		formatResultCssClass: function(data) {return undefined;},
		formatSelectionCssClass: function(data, container) {return undefined;},
		formatNoMatches: function () { return "No matches found"; },
		formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
		formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
		formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
		formatLoadMore: function (pageNumber) { return "Loading more results..."; },
		formatSearching: function () { return "Searching..."; },
		minimumResultsForSearch: 0,
		minimumInputLength: 0,
		maximumInputLength: null,
		maximumSelectionSize: 0,
		id: function (e) { return e.id; },
		matcher: function(term, text) {
			return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;
		},
		separator: ",",
		tokenSeparators: [],
		tokenizer: defaultTokenizer,
		escapeMarkup: defaultEscapeMarkup,
		blurOnChange: false,
		selectOnBlur: false,
		adaptContainerCssClass: function(c) { return c; },
		adaptDropdownCssClass: function(c) { return null; },
		nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; }
	};

	$.fn.select2.ajaxDefaults = {
		transport: $.ajax,
		params: {
			type: "GET",
			cache: false,
			dataType: "json"
		}
	};

	// exports
	window.Select2 = {
		query: {
			ajax: ajax,
			local: local,
			tags: tags
		}, util: {
			debounce: debounce,
			markMatch: markMatch,
			escapeMarkup: defaultEscapeMarkup,
			stripDiacritics: stripDiacritics
		}, "class": {
			"abstract": AbstractSelect2,
			"single": SingleSelect2,
			"multi": MultiSelect2
		}
	};

}(jQuery));
;

/*
 * Class that provides the top navbar functionality.
 *
 * @class MainNavbar
 */

(function() {
  PixelAdmin.MainNavbar = function() {
	this._scroller = false;
	this._wheight = null;
	this.scroll_pos = 0;
	return this;
  };


  /*
   * Initialize plugin.
   */

  PixelAdmin.MainNavbar.prototype.init = function() {
	var is_mobile;
	this.$navbar = $('#main-navbar');
	this.$header = this.$navbar.find('.navbar-header');
	this.$toggle = this.$navbar.find('.navbar-toggle:first');
	this.$collapse = $('#main-navbar-collapse');
	this.$collapse_div = this.$collapse.find('> div');
	is_mobile = false;
	$(window).on('pa.screen.small pa.screen.tablet', (function(_this) {
	  return function() {
		if (_this.$navbar.css('position') === 'fixed') {
		  _this._setupScroller();
		}
		return is_mobile = true;
	  };
	})(this)).on('pa.screen.desktop', (function(_this) {
	  return function() {
		_this._removeScroller();
		return is_mobile = false;
	  };
	})(this));
	return this.$navbar.on('click', '.nav-icon-btn.dropdown > .dropdown-toggle', function(e) {
	  if (is_mobile) {
		e.preventDefault();
		e.stopPropagation();
		document.location.href = $(this).attr('href');
		return false;
	  }
	});
  };


  /*
   * Attach scroller to navbar collapse.
   */

  PixelAdmin.MainNavbar.prototype._setupScroller = function() {
	if (this._scroller) {
	  return;
	}
	this._scroller = true;
	this.$collapse_div.pixelSlimScroll({});
	this.$navbar.on('shown.bs.collapse.mn_collapse', $.proxy(((function(_this) {
	  return function() {
		_this._updateCollapseHeight();
		return _this._watchWindowHeight();
	  };
	})(this)), this)).on('hidden.bs.collapse.mn_collapse', $.proxy(((function(_this) {
	  return function() {
		_this._wheight = null;
		return _this.$collapse_div.pixelSlimScroll({
		  scrollTo: '0px'
		});
	  };
	})(this)), this)).on('shown.bs.dropdown.mn_collapse', $.proxy(this._updateCollapseHeight, this)).on('hidden.bs.dropdown.mn_collapse', $.proxy(this._updateCollapseHeight, this));
	return this._updateCollapseHeight();
  };


  /*
   * Detach scroller from navbar collapse.
   */

  PixelAdmin.MainNavbar.prototype._removeScroller = function() {
	if (!this._scroller) {
	  return;
	}
	this._wheight = null;
	this._scroller = false;
	this.$collapse_div.pixelSlimScroll({
	  destroy: 'destroy'
	});
	this.$navbar.off('shown.bs.collapse.mn_collapse');
	this.$navbar.off('hidden.bs.collapse.mn_collapse');
	this.$navbar.off('shown.bs.dropdown.mn_collapse');
	this.$navbar.off('hidden.bs.dropdown.mn_collapse');
	return this.$collapse.attr('style', '');
  };


  /*
   * Update navbar collapse height.
   */

  PixelAdmin.MainNavbar.prototype._updateCollapseHeight = function() {
	var h_height, scrollTop, w_height;
	if (!this._scroller) {
	  return;
	}
	w_height = $(window).innerHeight();
	h_height = this.$header.outerHeight();
	scrollTop = this.$collapse_div.scrollTop();
	if ((h_height + this.$collapse_div.css({
	  'max-height': 'none'
	}).outerHeight()) > w_height) {
	  this.$collapse_div.css({
		'max-height': w_height - h_height
	  });
	} else {
	  this.$collapse_div.css({
		'max-height': 'none'
	  });
	}
	return this.$collapse_div.pixelSlimScroll({
	  scrollTo: scrollTop + 'px'
	});
  };


  /*
   * Detecting a change of the window height.
   */

  PixelAdmin.MainNavbar.prototype._watchWindowHeight = function() {
	var checkWindowInnerHeight;
	this._wheight = $(window).innerHeight();
	checkWindowInnerHeight = (function(_this) {
	  return function() {
		if (_this._wheight === null) {
		  return;
		}
		if (_this._wheight !== $(window).innerHeight()) {
		  _this._updateCollapseHeight();
		}
		_this._wheight = $(window).innerHeight();
		return setTimeout(checkWindowInnerHeight, 100);
	  };
	})(this);
	return window.setTimeout(checkWindowInnerHeight, 100);
  };

  PixelAdmin.MainNavbar.Constructor = PixelAdmin.MainNavbar;

  PixelAdmin.addInitializer(function() {
	return PixelAdmin.initPlugin('main_navbar', new PixelAdmin.MainNavbar);
  });

}).call(this);
;

/*
 * Class that provides the main menu functionality.
 *
 * @class MainMenu
 */

(function() {
  PixelAdmin.MainMenu = function() {
	this._screen = null;
	this._last_screen = null;
	this._animate = false;
	this._close_timer = null;
	this._dropdown_li = null;
	this._dropdown = null;
	return this;
  };


  /*
   * Initialize plugin.
   */

  PixelAdmin.MainMenu.prototype.init = function() {
	var self, state;
	this.$menu = $('#main-menu');
	if (!this.$menu.length) {
	  return;
	}
	this.$body = $('body');
	this.menu = this.$menu[0];
	this.$ssw_point = $('#small-screen-width-point');
	this.$tsw_point = $('#tablet-screen-width-point');
	self = this;
	if (PixelAdmin.settings.main_menu.store_state) {
	  state = this._getMenuState();
	  document.body.className += ' disable-mm-animation';
	  if (state !== null) {
		this.$body[state === 'collapsed' ? 'addClass' : 'removeClass']('mmc');
	  }
	  setTimeout((function(_this) {
		return function() {
		  return elRemoveClass(document.body, 'disable-mm-animation');
		};
	  })(this), 20);
	}
	this.setupAnimation();
	$(window).on('resize.pa.mm', $.proxy(this.onResize, this));
	this.onResize();
	this.$menu.find('.navigation > .mm-dropdown').addClass('mm-dropdown-root');
	if (PixelAdmin.settings.main_menu.detect_active) {
	  this.detectActiveItem();
	}
	if ($.support.transition) {
	  this.$menu.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', $.proxy(this._onAnimationEnd, this));
	}
	$('#main-menu-toggle').on('click', $.proxy(this.toggle, this));
	$('#main-menu-inner').slimScroll({
	  height: '100%'
	}).on('slimscrolling', (function(_this) {
	  return function() {
		return _this.closeCurrentDropdown(true);
	  };
	})(this));
	this.$menu.on('click', '.mm-dropdown > a', function() {
	  var li;
	  li = this.parentNode;
	  if (elHasClass(li, 'mm-dropdown-root') && self._collapsed()) {
		if (elHasClass(li, 'mmc-dropdown-open')) {
		  if (elHasClass(li, 'freeze')) {
			self.closeCurrentDropdown(true);
		  } else {
			self.freezeDropdown(li);
		  }
		} else {
		  self.openDropdown(li, true);
		}
	  } else {
		self.toggleSubmenu(li);
	  }
	  return false;
	});
	this.$menu.find('.navigation').on('mouseenter.pa.mm-dropdown', '.mm-dropdown-root', function() {
	  self.clearCloseTimer();
	  if (self._dropdown_li === this) {
		return;
	  }
	  if (self._collapsed() && (!self._dropdown_li || !elHasClass(self._dropdown_li, 'freeze'))) {
		return self.openDropdown(this);
	  }
	}).on('mouseleave.pa.mm-dropdown', '.mm-dropdown-root', function() {
	  return self._close_timer = setTimeout(function() {
		return self.closeCurrentDropdown();
	  }, PixelAdmin.settings.main_menu.dropdown_close_delay);
	});
	return this;
  };

  PixelAdmin.MainMenu.prototype._collapsed = function() {
	return (this._screen === 'desktop' && elHasClass(document.body, 'mmc')) || (this._screen !== 'desktop' && !elHasClass(document.body, 'mme'));
  };

  PixelAdmin.MainMenu.prototype.onResize = function() {
	this._screen = getScreenSize(this.$ssw_point, this.$tsw_point);
	this._animate = PixelAdmin.settings.main_menu.disable_animation_on.indexOf(screen) === -1;
	if (this._dropdown_li) {
	  this.closeCurrentDropdown(true);
	}
	if ((this._screen === 'small' && this._last_screen !== this._screen) || (this._screen === 'tablet' && this._last_screen === 'small')) {
	  document.body.className += ' disable-mm-animation';
	  setTimeout((function(_this) {
		return function() {
		  return elRemoveClass(document.body, 'disable-mm-animation');
		};
	  })(this), 20);
	}
	return this._last_screen = this._screen;
  };

  PixelAdmin.MainMenu.prototype.clearCloseTimer = function() {
	if (this._close_timer) {
	  clearTimeout(this._close_timer);
	  return this._close_timer = null;
	}
  };

  PixelAdmin.MainMenu.prototype._onAnimationEnd = function(e) {
	if (this._screen !== 'desktop' || e.target.id !== 'main-menu') {
	  return;
	}
	return $(window).trigger('resize');
  };

	PixelAdmin.MainMenu.prototype.toggle = function() {
		var cls, collapse;
		// cls = this._screen === 'small' || this._screen === 'tablet' ? 'mme' : 'mmc';
		cls = 'mme';
	
		if (elHasClass(document.body, cls)) {
			elRemoveClass(document.body, cls);
		} else {
			document.body.className += ' ' + cls;
		}
	
		if (cls === 'mmc') {
			if (PixelAdmin.settings.main_menu.store_state) {
				this._storeMenuState(elHasClass(document.body, 'mmc'));
			}
	
			if (!$.support.transition) {
				return $(window).trigger('resize');
			}
		} else {
			collapse = document.getElementById('');
			$('#main-navbar-collapse').stop().removeClass('in collapsing').addClass('collapse')[0].style.height = '0px';
			return $('#main-navbar .navbar-toggle').addClass('collapsed');
		}
	};

  PixelAdmin.MainMenu.prototype.toggleSubmenu = function(li) {
	this[elHasClass(li, 'open') ? 'collapseSubmenu' : 'expandSubmenu'](li);
	return false;
  };

  PixelAdmin.MainMenu.prototype.collapseSubmenu = function(li) {
	var $li, $ul;
	$li = $(li);
	$ul = $li.find('> ul');
	if (this._animate) {
	  $ul.animate({
		height: 0
	  }, PixelAdmin.settings.main_menu.animation_speed, (function(_this) {
		return function() {
		  elRemoveClass(li, 'open');
		  $ul.attr('style', '');
		  return $li.find('.mm-dropdown.open').removeClass('open').find('> ul').attr('style', '');
		};
	  })(this));
	} else {
	  elRemoveClass(li, 'open');
	}
	return false;
  };

  PixelAdmin.MainMenu.prototype.expandSubmenu = function(li) {
	var $li, $ul, h, ul;
	$li = $(li);
	if (PixelAdmin.settings.main_menu.accordion) {
	  this.collapseAllSubmenus(li);
	}
	if (this._animate) {
	  $ul = $li.find('> ul');
	  ul = $ul[0];
	  ul.className += ' get-height';
	  h = $ul.height();
	  elRemoveClass(ul, 'get-height');
	  ul.style.display = 'block';
	  ul.style.height = '0px';
	  li.className += ' open';
	  return $ul.animate({
		height: h
	  }, PixelAdmin.settings.main_menu.animation_speed, (function(_this) {
		return function() {
		  return $ul.attr('style', '');
		};
	  })(this));
	} else {
	  return li.className += ' open';
	}
  };

  PixelAdmin.MainMenu.prototype.collapseAllSubmenus = function(li) {
	var self;
	self = this;
	return $(li).parent().find('> .mm-dropdown.open').each(function() {
	  return self.collapseSubmenu(this);
	});
  };

  PixelAdmin.MainMenu.prototype.openDropdown = function(li, freeze) {
	var $li, $title, $ul, $wrapper, max_height, min_height, title_h, top, ul, w_height, wrapper;
	if (freeze == null) {
	  freeze = false;
	}
	if (this._dropdown_li) {
	  this.closeCurrentDropdown(freeze);
	}
	$li = $(li);
	$ul = $li.find('> ul');
	ul = $ul[0];
	this._dropdown_li = li;
	this._dropdown = ul;
	$title = $ul.find('> .mmc-title');
	if (!$title.length) {
	  $title = $('<div class="mmc-title"></div>').text($li.find('> a > .mm-text').text());
	  ul.insertBefore($title[0], ul.firstChild);
	}
	li.className += ' mmc-dropdown-open';
	ul.className += ' mmc-dropdown-open-ul';
	top = $li.position().top;
	if (elHasClass(document.body, 'main-menu-fixed')) {
	  $wrapper = $ul.find('.mmc-wrapper');
	  if (!$wrapper.length) {
		wrapper = document.createElement('div');
		wrapper.className = 'mmc-wrapper';
		wrapper.style.overflow = 'hidden';
		wrapper.style.position = 'relative';
		$wrapper = $(wrapper);
		$wrapper.append($ul.find('> li'));
		ul.appendChild(wrapper);
	  }
	  w_height = $(window).innerHeight();
	  title_h = $title.outerHeight();
	  min_height = title_h + $ul.find('.mmc-wrapper > li').first().outerHeight() * 3;
	  if ((top + min_height) > w_height) {
		max_height = top - $('#main-navbar').outerHeight();
		ul.className += ' top';
		ul.style.bottom = (w_height - top - title_h) + 'px';
	  } else {
		max_height = w_height - top - title_h;
		ul.style.top = top + 'px';
	  }
	  if (elHasClass(ul, 'top')) {
		ul.appendChild($title[0]);
	  } else {
		ul.insertBefore($title[0], ul.firstChild);
	  }
	  li.className += ' slimscroll-attached';
	  $wrapper[0].style.maxHeight = (max_height - 10) + 'px';
	  $wrapper.pixelSlimScroll({});
	} else {
	  ul.style.top = top + 'px';
	}
	if (freeze) {
	  this.freezeDropdown(li);
	}
	if (!freeze) {
	  $ul.on('mouseenter', (function(_this) {
		return function() {
		  return _this.clearCloseTimer();
		};
	  })(this)).on('mouseleave', (function(_this) {
		return function() {
		  return _this._close_timer = setTimeout(function() {
			return _this.closeCurrentDropdown();
		  }, PixelAdmin.settings.main_menu.dropdown_close_delay);
		};
	  })(this));
	  this;
	}
	return this.menu.appendChild(ul);
  };

  PixelAdmin.MainMenu.prototype.closeCurrentDropdown = function(force) {
	var $dropdown, $wrapper;
	if (force == null) {
	  force = false;
	}
	if (!this._dropdown_li || (elHasClass(this._dropdown_li, 'freeze') && !force)) {
	  return;
	}
	this.clearCloseTimer();
	$dropdown = $(this._dropdown);
	if (elHasClass(this._dropdown_li, 'slimscroll-attached')) {
	  elRemoveClass(this._dropdown_li, 'slimscroll-attached');
	  $wrapper = $dropdown.find('.mmc-wrapper');
	  $wrapper.pixelSlimScroll({
		destroy: 'destroy'
	  }).find('> *').appendTo($dropdown);
	  $wrapper.remove();
	}
	this._dropdown_li.appendChild(this._dropdown);
	elRemoveClass(this._dropdown, 'mmc-dropdown-open-ul');
	elRemoveClass(this._dropdown, 'top');
	elRemoveClass(this._dropdown_li, 'mmc-dropdown-open');
	elRemoveClass(this._dropdown_li, 'freeze');
	$(this._dropdown_li).attr('style', '');
	$dropdown.attr('style', '').off('mouseenter').off('mouseleave');
	this._dropdown = null;
	return this._dropdown_li = null;
  };

  PixelAdmin.MainMenu.prototype.freezeDropdown = function(li) {
	return li.className += ' freeze';
  };

  PixelAdmin.MainMenu.prototype.setupAnimation = function() {
	var $mm, $mm_nav, d_body, dsbl_animation_on;
	d_body = document.body;
	dsbl_animation_on = PixelAdmin.settings.main_menu.disable_animation_on;
	d_body.className += ' dont-animate-mm-content';
	$mm = $('#main-menu');
	$mm_nav = $mm.find('.navigation');
	$mm_nav.find('> .mm-dropdown > ul').addClass('mmc-dropdown-delay animated');
	$mm_nav.find('> li > a > .mm-text').addClass('mmc-dropdown-delay animated fadeIn');
	$mm.find('.menu-content').addClass('animated fadeIn');
	if (elHasClass(d_body, 'main-menu-right') || (elHasClass(d_body, 'right-to-left') && !elHasClass(d_body, 'main-menu-right'))) {
	  $mm_nav.find('> .mm-dropdown > ul').addClass('fadeInRight');
	} else {
	  $mm_nav.find('> .mm-dropdown > ul').addClass('fadeInLeft');
	}
	d_body.className += dsbl_animation_on.indexOf('small') === -1 ? ' animate-mm-sm' : ' dont-animate-mm-content-sm';
	d_body.className += dsbl_animation_on.indexOf('tablet') === -1 ? ' animate-mm-md' : ' dont-animate-mm-content-md';
	d_body.className += dsbl_animation_on.indexOf('desktop') === -1 ? ' animate-mm-lg' : ' dont-animate-mm-content-lg';
	return window.setTimeout(function() {
	  return elRemoveClass(d_body, 'dont-animate-mm-content');
	}, 500);
  };

  PixelAdmin.MainMenu.prototype.detectActiveItem = function() {
	return [];
	
	var a, bubble, links, nav, predicate, url, _i, _len, _results;
	url = (document.location + '').replace(/\#.*?$/, '');
	predicate = PixelAdmin.settings.main_menu.detect_active_predicate;
	nav = $('#main-menu .navigation');
	nav.find('li').removeClass('open active');
	links = nav[0].getElementsByTagName('a');
	bubble = (function(_this) {
	  return function(li) {
		li.className += ' active';
		if (!elHasClass(li.parentNode, 'navigation')) {
		  li = li.parentNode.parentNode;
		  li.className += ' open';
		  return bubble(li);
		}
	  };
	})(this);
	_results = [];
	for (_i = 0, _len = links.length; _i < _len; _i++) {
	  a = links[_i];
	  if (a.href.indexOf('#') === -1 && predicate(a.href, url)) {
		bubble(a.parentNode);
		break;
	  } else {
		_results.push(void 0);
	  }
	}
	return _results;
  };


  /*
   * Load menu state.
   */

  PixelAdmin.MainMenu.prototype._getMenuState = function() {
	return PixelAdmin.getStoredValue(PixelAdmin.settings.main_menu.store_state_key, null);
  };


  /*
   * Store menu state.
   */

  PixelAdmin.MainMenu.prototype._storeMenuState = function(is_collapsed) {
	if (!PixelAdmin.settings.main_menu.store_state) {
	  return;
	}
	return PixelAdmin.storeValue(PixelAdmin.settings.main_menu.store_state_key, is_collapsed ? 'collapsed' : 'expanded');
  };

  PixelAdmin.MainMenu.Constructor = PixelAdmin.MainMenu;

  PixelAdmin.addInitializer(function() {
	return PixelAdmin.initPlugin('main_menu', new PixelAdmin.MainMenu);
  });

}).call(this);
;

(function($) {

  jQuery.fn.extend({
	pixelSlimScroll: function(options) {

	  var defaults = {

		// width in pixels of the visible scroll area
		width : 'auto',

		// width in pixels of the scrollbar and rail
		size : '2px',

		// scrollbar color, accepts any hex/color value
		color: '#000',

		// distance in pixels between the side edge and the scrollbar
		distance : '1px',

		// default scroll position on load - top / bottom / $('selector')
		start : 'top',

		// sets scrollbar opacity
		opacity : .4,

		// sets rail color
		railColor : '#333',

		// sets rail opacity
		railOpacity : .2,

		// defautlt CSS class of the slimscroll rail
		railClass : 'slimScrollRail',

		// defautlt CSS class of the slimscroll bar
		barClass : 'slimScrollBar',

		// defautlt CSS class of the slimscroll wrapper
		wrapperClass : 'slimScrollDiv',

		// check if mousewheel should scroll the window if we reach top/bottom
		allowPageScroll : false,

		// scroll amount applied to each mouse wheel step
		wheelStep : 20,

		// scroll amount applied when user is using gestures
		touchScrollStep : 200,

		// sets border radius
		borderRadius: '0px',

		// sets border radius of the rail
		railBorderRadius : '0px'
	  };

	  var o = $.extend(defaults, options);

	  // do it for every element that matches selector
	  this.each(function(){

	  var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
		barHeight, percentScroll, lastScroll,
		divS = '<div></div>',
		minBarHeight = 30,
		releaseScroll = false;

		// used in event handlers and for better minification
		var me = $(this);

		// ensure we are not binding it again
		if (me.parent().hasClass(o.wrapperClass))
		{
			// start from last bar position
			var offset = me.scrollTop();

			// find bar and rail
			bar = me.parent().find('.' + o.barClass);
			rail = me.parent().find('.' + o.railClass);

			getBarHeight();

			// check if we should scroll existing instance
			if ($.isPlainObject(options))
			{
			  if ('scrollTo' in options)
			  {
				// jump to a static point
				offset = parseInt(o.scrollTo);
			  }
			  else if ('scrollBy' in options)
			  {
				// jump by value pixels
				offset += parseInt(o.scrollBy);
			  }
			  else if ('destroy' in options)
			  {
				// remove slimscroll elements
				bar.remove();
				rail.remove();
				me.unwrap();
				return;
			  }

			  // scroll content by the given offset
			  scrollContent(offset, false, true);
			}

			return;
		}

		// wrap content
		var wrapper = $(divS)
		  .addClass(o.wrapperClass)
		  .css({
			position: 'relative',
			overflow: 'hidden',
			width: o.width
		  });

		// update style for the div
		me.css({
		  overflow: 'hidden',
		  width: o.width
		});

		// create scrollbar rail
		var rail = $(divS)
		  .addClass(o.railClass)
		  .css({
			width: o.size,
			height: '100%',
			position: 'absolute',
			top: 0,
			display: 'none',
			'border-radius': o.railBorderRadius,
			background: o.railColor,
			opacity: o.railOpacity,
			zIndex: 90
		  });

		// create scrollbar
		var bar = $(divS)
		  .addClass(o.barClass)
		  .css({
			background: o.color,
			width: o.size,
			position: 'absolute',
			top: 0,
			opacity: o.opacity,
			display: 'block',
			'border-radius' : o.borderRadius,
			BorderRadius: o.borderRadius,
			MozBorderRadius: o.borderRadius,
			WebkitBorderRadius: o.borderRadius,
			zIndex: 99
		  });

		// set position
		rail.css({ right: o.distance });
		bar.css({ right: o.distance });

		// wrap it
		me.wrap(wrapper);

		// append to parent div
		me.parent().append(bar);
		me.parent().append(rail);

		// make it draggable and no longer dependent on the jqueryUI
		bar.bind("mousedown", function(e) {
		  var $doc = $(document);
		  isDragg = true;
		  t = parseFloat(bar.css('top'));
		  pageY = e.pageY;

		  $doc.bind("mousemove.slimscroll", function(e){
			currTop = t + e.pageY - pageY;
			bar.css('top', currTop);
			scrollContent(0, bar.position().top, false);// scroll content
		  });

		  $doc.bind("mouseup.slimscroll", function(e) {
			isDragg = false;hideBar();
			$doc.unbind('.slimscroll');
		  });
		  return false;
		}).bind("selectstart.slimscroll", function(e){
		  e.stopPropagation();
		  e.preventDefault();
		  return false;
		});

		// on rail over
		rail.hover(function(){
		  showBar();
		}, function(){
		  hideBar();
		});

		// on bar over
		bar.hover(function(){
		  isOverBar = true;
		}, function(){
		  isOverBar = false;
		});

		// show on parent mouseover
		me.hover(function(){
		  isOverPanel = true;
		  showBar();
		  hideBar();
		}, function(){
		  isOverPanel = false;
		  hideBar();
		});

		// support for mobile
		me.bind('touchstart', function(e,b){
		  if (e.originalEvent.touches.length)
		  {
			// record where touch started
			touchDif = e.originalEvent.touches[0].pageY;
		  }
		});

		me.bind('touchmove', function(e){
		  // prevent scrolling the page if necessary
		  if(!releaseScroll)
		  {
			  e.originalEvent.preventDefault();
			  }
		  if (e.originalEvent.touches.length)
		  {
			// see how far user swiped
			var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
			// scroll content
			scrollContent(diff, true);
			touchDif = e.originalEvent.touches[0].pageY;
		  }
		});

		// set up initial height
		getBarHeight();

		// attach scroll events
		attachWheel();

		function _onWheel(e)
		{
		  // use mouse wheel only when mouse is over
		  if (!isOverPanel) { return; }

		  var e = e || window.event;

		  var delta = 0;
		  if (e.wheelDelta) { delta = -e.wheelDelta/120; }
		  if (e.detail) { delta = e.detail / 3; }

		  var target = e.target || e.srcTarget || e.srcElement;
		  if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
			// scroll content
			scrollContent(delta, true);
		  }

		  // stop window scroll
		  if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
		  if (!releaseScroll) { e.returnValue = false; }
		}

		function scrollContent(y, isWheel, isJump)
		{
		  releaseScroll = false;
		  var delta = y;
		  var maxTop = me.outerHeight() - bar.outerHeight();

		  if (isWheel)
		  {
			// move bar with mouse wheel
			delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

			// move bar, make sure it doesn't go out
			delta = Math.min(Math.max(delta, 0), maxTop);

			// if scrolling down, make sure a fractional change to the
			// scroll position isn't rounded away when the scrollbar's CSS is set
			// this flooring of delta would happened automatically when
			// bar.css is set below, but we floor here for clarity
			delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

			// scroll the scrollbar
			bar.css({ top: delta + 'px' });
		  }

		  // calculate actual scroll amount
		  percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
		  delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

		  if (isJump)
		  {
			delta = y;
			var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
			offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
			bar.css({ top: offsetTop + 'px' });
		  }

		  // scroll content
		  me.scrollTop(delta);

		  // fire scrolling event
		  me.trigger('slimscrolling', ~~delta);

		  // ensure bar is visible
		  showBar();

		  // trigger hide when scroll is stopped
		  hideBar();
		}

		function attachWheel()
		{
		  if (window.addEventListener)
		  {
			this.addEventListener('DOMMouseScroll', _onWheel, false );
			this.addEventListener('mousewheel', _onWheel, false );
		  }
		  else
		  {
			document.attachEvent("onmousewheel", _onWheel)
		  }
		}

		function getBarHeight()
		{
		  // calculate scrollbar height and make sure it is not too small
		  barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
		  bar.css({ height: barHeight + 'px' });

		  // hide scrollbar if content is not long enough
		  var display = barHeight == me.outerHeight() ? 'none' : 'block';
		  bar.css({ display: display });
		}

		function showBar()
		{
		  // recalculate bar height
		  getBarHeight();
		  clearTimeout(queueHide);

		  // when bar reached top or bottom
		  if (percentScroll == ~~percentScroll)
		  {
			//release wheel
			releaseScroll = o.allowPageScroll;

			// publish approporiate event
			if (lastScroll != percentScroll)
			{
				var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
				me.trigger('slimscroll', msg);
			}
		  }
		  else
		  {
			releaseScroll = false;
		  }
		  lastScroll = percentScroll;

		  // show only when required
		  if(barHeight >= me.outerHeight()) {
			//allow window scroll
			releaseScroll = true;
			return;
		  }
		  bar.stop(true,true).fadeIn('fast');
		}

		function hideBar() { }

	  });

	  // maintain chainability
	  return this;
	}
  });

  jQuery.fn.extend({
	pixelslimscroll: jQuery.fn.pixelSlimScroll
  });

})(jQuery);
;
/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.2
 *
 */
(function($) {

  jQuery.fn.extend({
	slimScroll: function(options) {

	  var defaults = {

		// width in pixels of the visible scroll area
		width : 'auto',

		// height in pixels of the visible scroll area
		height : '250px',

		// width in pixels of the scrollbar and rail
		size : '7px',

		// scrollbar color, accepts any hex/color value
		color: '#000',

		// scrollbar position - left/right
		position : 'right',

		// distance in pixels between the side edge and the scrollbar
		distance : '1px',

		// default scroll position on load - top / bottom / $('selector')
		start : 'top',

		// sets scrollbar opacity
		opacity : .4,

		// enables always-on mode for the scrollbar
		alwaysVisible : false,

		// check if we should hide the scrollbar when user is hovering over
		disableFadeOut : false,

		// sets visibility of the rail
		railVisible : false,

		// sets rail color
		railColor : '#333',

		// sets rail opacity
		railOpacity : .2,

		// whether  we should use jQuery UI Draggable to enable bar dragging
		railDraggable : true,

		// defautlt CSS class of the slimscroll rail
		railClass : 'slimScrollRail',

		// defautlt CSS class of the slimscroll bar
		barClass : 'slimScrollBar',

		// defautlt CSS class of the slimscroll wrapper
		wrapperClass : 'slimScrollDiv',

		// check if mousewheel should scroll the window if we reach top/bottom
		allowPageScroll : false,

		// scroll amount applied to each mouse wheel step
		wheelStep : 20,

		// scroll amount applied when user is using gestures
		touchScrollStep : 200,

		// sets border radius
		borderRadius: '7px',

		// sets border radius of the rail
		railBorderRadius : '7px'
	  };

	  var o = $.extend(defaults, options);

	  // do it for every element that matches selector
	  this.each(function(){

	  var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
		barHeight, percentScroll, lastScroll,
		divS = '<div></div>',
		minBarHeight = 30,
		releaseScroll = false;

		// used in event handlers and for better minification
		var me = $(this);

		// ensure we are not binding it again
		if (me.parent().hasClass(o.wrapperClass))
		{
			// start from last bar position
			var offset = me.scrollTop();

			// find bar and rail
			bar = me.parent().find('.' + o.barClass);
			rail = me.parent().find('.' + o.railClass);

			getBarHeight();

			// check if we should scroll existing instance
			if ($.isPlainObject(options))
			{
			  // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
			  if ( 'height' in options && options.height == 'auto' ) {
				me.parent().css('height', 'auto');
				me.css('height', 'auto');
				var height = me.parent().parent().height();
				me.parent().css('height', height);
				me.css('height', height);
			  }

			  if ('scrollTo' in options)
			  {
				// jump to a static point
				offset = parseInt(o.scrollTo);
			  }
			  else if ('scrollBy' in options)
			  {
				// jump by value pixels
				offset += parseInt(o.scrollBy);
			  }
			  else if ('destroy' in options)
			  {
				// remove slimscroll elements
				bar.remove();
				rail.remove();
				me.unwrap();
				return;
			  }

			  // scroll content by the given offset
			  scrollContent(offset, false, true);
			}

			return;
		}

		// optionally set height to the parent's height
		o.height = (options.height == 'auto') ? me.parent().height() : options.height;

		// wrap content
		var wrapper = $(divS)
		  .addClass(o.wrapperClass)
		  .css({
			position: 'relative',
			overflow: 'hidden',
			width: o.width,
			height: o.height
		  });

		// update style for the div
		me.css({
		  overflow: 'hidden',
		  width: o.width,
		  height: o.height
		});

		// create scrollbar rail
		var rail = $(divS)
		  .addClass(o.railClass)
		  .css({
			width: o.size,
			height: '100%',
			position: 'absolute',
			top: 0,
			display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
			'border-radius': o.railBorderRadius,
			background: o.railColor,
			opacity: o.railOpacity,
			zIndex: 90
		  });

		// create scrollbar
		var bar = $(divS)
		  .addClass(o.barClass)
		  .css({
			background: o.color,
			width: o.size,
			position: 'absolute',
			top: 0,
			opacity: o.opacity,
			display: o.alwaysVisible ? 'block' : 'none',
			'border-radius' : o.borderRadius,
			BorderRadius: o.borderRadius,
			MozBorderRadius: o.borderRadius,
			WebkitBorderRadius: o.borderRadius,
			zIndex: 99
		  });

		// set position
		var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
		rail.css(posCss);
		bar.css(posCss);

		// wrap it
		me.wrap(wrapper);

		// append to parent div
		me.parent().append(bar);
		me.parent().append(rail);

		// make it draggable and no longer dependent on the jqueryUI
		if (o.railDraggable){
		  bar.bind("mousedown", function(e) {
			var $doc = $(document);
			isDragg = true;
			t = parseFloat(bar.css('top'));
			pageY = e.pageY;

			$doc.bind("mousemove.slimscroll", function(e){
			  currTop = t + e.pageY - pageY;
			  bar.css('top', currTop);
			  scrollContent(0, bar.position().top, false);// scroll content
			});

			$doc.bind("mouseup.slimscroll", function(e) {
			  isDragg = false;hideBar();
			  $doc.unbind('.slimscroll');
			});
			return false;
		  }).bind("selectstart.slimscroll", function(e){
			e.stopPropagation();
			e.preventDefault();
			return false;
		  });
		}

		// on rail over
		rail.hover(function(){
		  showBar();
		}, function(){
		  hideBar();
		});

		// on bar over
		bar.hover(function(){
		  isOverBar = true;
		}, function(){
		  isOverBar = false;
		});

		// show on parent mouseover
		me.hover(function(){
		  isOverPanel = true;
		  showBar();
		  hideBar();
		}, function(){
		  isOverPanel = false;
		  hideBar();
		});

		// support for mobile
		me.bind('touchstart', function(e,b){
		  if (e.originalEvent.touches.length)
		  {
			// record where touch started
			touchDif = e.originalEvent.touches[0].pageY;
		  }
		});

		me.bind('touchmove', function(e){
		  // prevent scrolling the page if necessary
		  if(!releaseScroll)
		  {
			  e.originalEvent.preventDefault();
			  }
		  if (e.originalEvent.touches.length)
		  {
			// see how far user swiped
			var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
			// scroll content
			scrollContent(diff, true);
			touchDif = e.originalEvent.touches[0].pageY;
		  }
		});

		// set up initial height
		getBarHeight();

		// check start position
		if (o.start === 'bottom')
		{
		  // scroll content to bottom
		  bar.css({ top: me.outerHeight() - bar.outerHeight() });
		  scrollContent(0, true);
		}
		else if (o.start !== 'top')
		{
		  // assume jQuery selector
		  scrollContent($(o.start).position().top, null, true);

		  // make sure bar stays hidden
		  if (!o.alwaysVisible) { bar.hide(); }
		}

		// attach scroll events
		attachWheel();

		function _onWheel(e)
		{
		  // use mouse wheel only when mouse is over
		  if (!isOverPanel) { return; }

		  var e = e || window.event;

		  var delta = 0;
		  if (e.wheelDelta) { delta = -e.wheelDelta/120; }
		  if (e.detail) { delta = e.detail / 3; }

		  var target = e.target || e.srcTarget || e.srcElement;
		  if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
			// scroll content
			scrollContent(delta, true);
		  }

		  // stop window scroll
		  if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
		  if (!releaseScroll) { e.returnValue = false; }
		}

		function scrollContent(y, isWheel, isJump)
		{
		  releaseScroll = false;
		  var delta = y;
		  var maxTop = me.outerHeight() - bar.outerHeight();

		  if (isWheel)
		  {
			// move bar with mouse wheel
			delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

			// move bar, make sure it doesn't go out
			delta = Math.min(Math.max(delta, 0), maxTop);

			// if scrolling down, make sure a fractional change to the
			// scroll position isn't rounded away when the scrollbar's CSS is set
			// this flooring of delta would happened automatically when
			// bar.css is set below, but we floor here for clarity
			delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

			// scroll the scrollbar
			bar.css({ top: delta + 'px' });
		  }

		  // calculate actual scroll amount
		  percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
		  delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

		  if (isJump)
		  {
			delta = y;
			var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
			offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
			bar.css({ top: offsetTop + 'px' });
		  }

		  // scroll content
		  me.scrollTop(delta);

		  // fire scrolling event
		  me.trigger('slimscrolling', ~~delta);

		  // ensure bar is visible
		  showBar();

		  // trigger hide when scroll is stopped
		  hideBar();
		}

		function attachWheel()
		{
		  if (window.addEventListener)
		  {
			this.addEventListener('DOMMouseScroll', _onWheel, false );
			this.addEventListener('mousewheel', _onWheel, false );
		  }
		  else
		  {
			document.attachEvent("onmousewheel", _onWheel)
		  }
		}

		function getBarHeight()
		{
		  // calculate scrollbar height and make sure it is not too small
		  barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
		  bar.css({ height: barHeight + 'px' });

		  // hide scrollbar if content is not long enough
		  var display = barHeight == me.outerHeight() ? 'none' : 'block';
		  bar.css({ display: display });
		}

		function showBar()
		{
		  // recalculate bar height
		  getBarHeight();
		  clearTimeout(queueHide);

		  // when bar reached top or bottom
		  if (percentScroll == ~~percentScroll)
		  {
			//release wheel
			releaseScroll = o.allowPageScroll;

			// publish approporiate event
			if (lastScroll != percentScroll)
			{
				var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
				me.trigger('slimscroll', msg);
			}
		  }
		  else
		  {
			releaseScroll = false;
		  }
		  lastScroll = percentScroll;

		  // show only when required
		  if(barHeight >= me.outerHeight()) {
			//allow window scroll
			releaseScroll = true;
			return;
		  }
		  bar.stop(true,true).fadeIn('fast');
		  if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
		}

		function hideBar()
		{
		  // only hide when options allow it
		  if (!o.alwaysVisible)
		  {
			queueHide = setTimeout(function(){
			  if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
			  {
				bar.fadeOut('slow');
				rail.fadeOut('slow');
			  }
			}, 1000);
		  }
		}

	  });

	  // maintain chainability
	  return this;
	}
  });

  jQuery.fn.extend({
	slimscroll: jQuery.fn.slimScroll
  });

})(jQuery);
