(function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var id_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = void 0;

	/**
	 * Created by hustcc on 18/6/9.
	 * Contract: i@hust.cc
	 */
	var id = 1;
	/**
	 * generate unique id in application
	 * @return {string}
	 */

	var _default = function _default() {
	  return "".concat(id++);
	};

	exports["default"] = _default;
	});

	unwrapExports(id_1);

	var debounce = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = void 0;

	/**
	 * Created by hustcc on 18/6/9.
	 * Contract: i@hust.cc
	 */
	var _default = function _default(fn) {
	  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
	  var timer = null;
	  return function () {
	    var _this = this;

	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    clearTimeout(timer);
	    timer = setTimeout(function () {
	      fn.apply(_this, args);
	    }, delay);
	  };
	};

	exports["default"] = _default;
	});

	unwrapExports(debounce);

	var constant = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SensorTabIndex = exports.SensorClassName = exports.SensorStyle = exports.SizeSensorId = void 0;

	/**
	 * Created by hustcc on 18/6/9.
	 * Contract: i@hust.cc
	 */
	var SizeSensorId = 'size-sensor-id';
	exports.SizeSensorId = SizeSensorId;
	var SensorStyle = 'display:block;position:absolute;top:0;left:0;height:100%;width:auto;overflow:hidden;pointer-events:none;z-index:-1;opacity:0';
	exports.SensorStyle = SensorStyle;
	var SensorClassName = 'size-sensor-object';
	exports.SensorClassName = SensorClassName;
	var SensorTabIndex = '-1';
	exports.SensorTabIndex = SensorTabIndex;
	});

	unwrapExports(constant);
	var constant_1 = constant.SensorTabIndex;
	var constant_2 = constant.SensorClassName;
	var constant_3 = constant.SensorStyle;
	var constant_4 = constant.SizeSensorId;

	var object = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createSensor = void 0;

	var _debounce = _interopRequireDefault(debounce);



	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * Created by hustcc on 18/6/9.
	 * Contract: i@hust.cc
	 */
	var createSensor = function createSensor(element) {
	  var sensor = undefined; // callback

	  var listeners = [];
	  /**
	   * create object DOM of sensor
	   * @returns {HTMLObjectElement}
	   */

	  var newSensor = function newSensor() {
	    // adjust style
	    if (getComputedStyle(element).position === 'static') {
	      element.style.position = 'relative';
	    }

	    var obj = document.createElement('object');

	    obj.onload = function () {
	      obj.contentDocument.defaultView.addEventListener('resize', resizeListener); // 直接触发一次 resize

	      resizeListener();
	    };

	    obj.setAttribute('style', constant.SensorStyle);
	    obj.setAttribute('class', constant.SensorClassName);
	    obj.setAttribute('tabindex', constant.SensorTabIndex);
	    obj.type = 'text/html'; // append into dom

	    element.appendChild(obj); // for ie, should set data attribute delay, or will be white screen

	    obj.data = 'about:blank';
	    return obj;
	  };
	  /**
	   * trigger listeners
	   */


	  var resizeListener = (0, _debounce["default"])(function () {
	    // trigger all listener
	    listeners.forEach(function (listener) {
	      listener(element);
	    });
	  });
	  /**
	   * listen with one callback function
	   * @param cb
	   */

	  var bind = function bind(cb) {
	    // if not exist sensor, then create one
	    if (!sensor) {
	      sensor = newSensor();
	    }

	    if (listeners.indexOf(cb) === -1) {
	      listeners.push(cb);
	    }
	  };
	  /**
	   * destroy all
	   */


	  var destroy = function destroy() {
	    if (sensor && sensor.parentNode) {
	      if (sensor.contentDocument) {
	        // remote event
	        sensor.contentDocument.defaultView.removeEventListener('resize', resizeListener);
	      } // remove dom


	      sensor.parentNode.removeChild(sensor); // initial variable

	      sensor = undefined;
	      listeners = [];
	    }
	  };
	  /**
	   * cancel listener bind
	   * @param cb
	   */


	  var unbind = function unbind(cb) {
	    var idx = listeners.indexOf(cb);

	    if (idx !== -1) {
	      listeners.splice(idx, 1);
	    } // no listener, and sensor is exist
	    // then destroy the sensor


	    if (listeners.length === 0 && sensor) {
	      destroy();
	    }
	  };

	  return {
	    element: element,
	    bind: bind,
	    destroy: destroy,
	    unbind: unbind
	  };
	};

	exports.createSensor = createSensor;
	});

	unwrapExports(object);
	var object_1 = object.createSensor;

	var resizeObserver = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createSensor = void 0;

	var _debounce = _interopRequireDefault(debounce);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * Created by hustcc on 18/7/5.
	 * Contract: i@hust.cc
	 */
	var createSensor = function createSensor(element) {
	  var sensor = undefined; // callback

	  var listeners = [];
	  /**
	   * trigger listeners
	   */

	  var resizeListener = (0, _debounce["default"])(function () {
	    // trigger all
	    listeners.forEach(function (listener) {
	      listener(element);
	    });
	  });
	  /**
	   * create ResizeObserver sensor
	   * @returns
	   */

	  var newSensor = function newSensor() {
	    var s = new ResizeObserver(resizeListener); // listen element

	    s.observe(element); // trigger once

	    resizeListener();
	    return s;
	  };
	  /**
	   * listen with callback
	   * @param cb
	   */


	  var bind = function bind(cb) {
	    if (!sensor) {
	      sensor = newSensor();
	    }

	    if (listeners.indexOf(cb) === -1) {
	      listeners.push(cb);
	    }
	  };
	  /**
	   * destroy
	   */


	  var destroy = function destroy() {
	    sensor.disconnect();
	    listeners = [];
	    sensor = undefined;
	  };
	  /**
	   * cancel bind
	   * @param cb
	   */


	  var unbind = function unbind(cb) {
	    var idx = listeners.indexOf(cb);

	    if (idx !== -1) {
	      listeners.splice(idx, 1);
	    } // no listener, and sensor is exist
	    // then destroy the sensor


	    if (listeners.length === 0 && sensor) {
	      destroy();
	    }
	  };

	  return {
	    element: element,
	    bind: bind,
	    destroy: destroy,
	    unbind: unbind
	  };
	};

	exports.createSensor = createSensor;
	});

	unwrapExports(resizeObserver);
	var resizeObserver_1 = resizeObserver.createSensor;

	var sensors = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createSensor = void 0;





	/**
	 * Created by hustcc on 18/7/5.
	 * Contract: i@hust.cc
	 */

	/**
	 * sensor strategies
	 */
	// export const createSensor = createObjectSensor;
	var createSensor = typeof ResizeObserver !== 'undefined' ? resizeObserver.createSensor : object.createSensor;
	exports.createSensor = createSensor;
	});

	unwrapExports(sensors);
	var sensors_1 = sensors.createSensor;

	var sensorPool = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeSensor = exports.getSensor = void 0;

	var _id = _interopRequireDefault(id_1);





	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * Created by hustcc on 18/6/9.
	 * Contract: i@hust.cc
	 */

	/**
	 * all the sensor objects.
	 * sensor pool
	 */
	var Sensors = {};
	/**
	 * get one sensor
	 * @param element
	 * @returns {*}
	 */

	var getSensor = function getSensor(element) {
	  var sensorId = element.getAttribute(constant.SizeSensorId); // 1. if the sensor exists, then use it

	  if (sensorId && Sensors[sensorId]) {
	    return Sensors[sensorId];
	  } // 2. not exist, then create one


	  var newId = (0, _id["default"])();
	  element.setAttribute(constant.SizeSensorId, newId);
	  var sensor = (0, sensors.createSensor)(element); // add sensor into pool

	  Sensors[newId] = sensor;
	  return sensor;
	};
	/**
	 * 移除 sensor
	 * @param sensor
	 */


	exports.getSensor = getSensor;

	var removeSensor = function removeSensor(sensor) {
	  var sensorId = sensor.element.getAttribute(constant.SizeSensorId); // remove attribute

	  sensor.element.removeAttribute(constant.SizeSensorId); // remove event, dom of the sensor used

	  sensor.destroy(); // exist, then remove from pool

	  if (sensorId && Sensors[sensorId]) {
	    delete Sensors[sensorId];
	  }
	};

	exports.removeSensor = removeSensor;
	});

	unwrapExports(sensorPool);
	var sensorPool_1 = sensorPool.removeSensor;
	var sensorPool_2 = sensorPool.getSensor;

	var lib = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ver = exports.clear = exports.bind = void 0;



	/**
	 * Created by hustcc on 18/6/9.[高考时间]
	 * Contract: i@hust.cc
	 */

	/**
	 * bind an element with resize callback function
	 * @param {*} element
	 * @param {*} cb
	 */
	var bind = function bind(element, cb) {
	  var sensor = (0, sensorPool.getSensor)(element); // listen with callback

	  sensor.bind(cb); // return unbind function

	  return function () {
	    sensor.unbind(cb);
	  };
	};
	/**
	 * clear all the listener and sensor of an element
	 * @param element
	 */


	exports.bind = bind;

	var clear = function clear(element) {
	  var sensor = (0, sensorPool.getSensor)(element);
	  (0, sensorPool.removeSensor)(sensor);
	};

	exports.clear = clear;
	var ver = "0.2.7";
	exports.ver = ver;
	});

	unwrapExports(lib);
	var lib_1 = lib.ver;
	var lib_2 = lib.clear;
	var lib_3 = lib.bind;

	var utils = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by hustcc on 18/6/23.
	 * Contract: i@hust.cc
	 */

	var requestAnimationFrame = exports.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (func) {
	  return window.setTimeout(func, 1000 / 60);
	};

	var cancelAnimationFrame = exports.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || window.clearTimeout;

	var range = exports.range = function range(n) {
	  return new Array(n).fill(0).map(function (e, idx) {
	    return idx;
	  });
	};

	var canvasStyle = exports.canvasStyle = function canvasStyle(config) {
	  return "display:block;position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:" + config.zIndex + ";opacity:" + config.opacity;
	};
	});

	unwrapExports(utils);
	var utils_1 = utils.requestAnimationFrame;
	var utils_2 = utils.cancelAnimationFrame;
	var utils_3 = utils.range;
	var utils_4 = utils.canvasStyle;

	var CanvasNest_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by hustcc on 18/6/23.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Contract: i@hust.cc
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */





	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CanvasNest = function () {
	  function CanvasNest(el, config) {
	    var _this = this;

	    _classCallCheck(this, CanvasNest);

	    this.randomPoints = function () {
	      return (0, utils.range)(_this.c.count).map(function () {
	        return {
	          x: Math.random() * _this.canvas.width,
	          y: Math.random() * _this.canvas.height,
	          xa: 2 * Math.random() - 1, // 随机运动返现
	          ya: 2 * Math.random() - 1,
	          max: 6000 // 沾附距离
	        };
	      });
	    };

	    this.el = el;

	    this.c = _extends({
	      zIndex: -1, // z-index
	      opacity: 0.5, // opacity
	      color: '0,0,0', // color of lines
	      pointColor: '0,0,0', // color of points
	      count: 99 }, config);

	    this.canvas = this.newCanvas();
	    this.context = this.canvas.getContext('2d');

	    this.points = this.randomPoints();
	    this.current = {
	      x: null, // 当前鼠标x
	      y: null, // 当前鼠标y
	      max: 20000 // 圈半径的平方
	    };
	    this.all = this.points.concat([this.current]);

	    this.bindEvent();

	    this.requestFrame(this.drawCanvas);
	  }

	  _createClass(CanvasNest, [{
	    key: 'bindEvent',
	    value: function bindEvent() {
	      var _this2 = this;

	      (0, lib.bind)(this.el, function () {
	        _this2.canvas.width = _this2.el.clientWidth;
	        _this2.canvas.height = _this2.el.clientHeight;
	      });

	      this.onmousemove = window.onmousemove;
	      window.onmousemove = function (e) {
	        _this2.current.x = e.clientX - _this2.el.offsetLeft + document.scrollingElement.scrollLeft; // 当存在横向滚动条时，x坐标再往右移动滚动条拉动的距离
	        _this2.current.y = e.clientY - _this2.el.offsetTop + document.scrollingElement.scrollTop; // 当存在纵向滚动条时，y坐标再往下移动滚动条拉动的距离
	        _this2.onmousemove && _this2.onmousemove(e);
	      };

	      this.onmouseout = window.onmouseout;
	      window.onmouseout = function () {
	        _this2.current.x = null;
	        _this2.current.y = null;
	        _this2.onmouseout && _this2.onmouseout();
	      };
	    }
	  }, {
	    key: 'newCanvas',
	    value: function newCanvas() {
	      if (getComputedStyle(this.el).position === 'static') {
	        this.el.style.position = 'relative';
	      }
	      var canvas = document.createElement('canvas'); // 画布
	      canvas.style.cssText = (0, utils.canvasStyle)(this.c);

	      canvas.width = this.el.clientWidth;
	      canvas.height = this.el.clientHeight;

	      this.el.appendChild(canvas);
	      return canvas;
	    }
	  }, {
	    key: 'requestFrame',
	    value: function requestFrame(func) {
	      var _this3 = this;

	      this.tid = (0, utils.requestAnimationFrame)(function () {
	        return func.call(_this3);
	      });
	    }
	  }, {
	    key: 'drawCanvas',
	    value: function drawCanvas() {
	      var _this4 = this;

	      var context = this.context;
	      var width = this.canvas.width;
	      var height = this.canvas.height;
	      var current = this.current;
	      var points = this.points;
	      var all = this.all;

	      context.clearRect(0, 0, width, height);
	      // 随机的线条和当前位置联合数组
	      var e = void 0,
	          i = void 0,
	          d = void 0,
	          x_dist = void 0,
	          y_dist = void 0,
	          dist = void 0; // 临时节点
	      // 遍历处理每一个点
	      points.forEach(function (r, idx) {
	        r.x += r.xa;
	        r.y += r.ya; // 移动
	        r.xa *= r.x > width || r.x < 0 ? -1 : 1;
	        r.ya *= r.y > height || r.y < 0 ? -1 : 1; // 碰到边界，反向反弹
	        context.fillStyle = 'rgba(' + _this4.c.pointColor + ')';
	        context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1); // 绘制一个宽高为1的点
	        // 从下一个点开始
	        for (i = idx + 1; i < all.length; i++) {
	          e = all[i];
	          // 当前点存在
	          if (null !== e.x && null !== e.y) {
	            x_dist = r.x - e.x; // x轴距离 l
	            y_dist = r.y - e.y; // y轴距离 n
	            dist = x_dist * x_dist + y_dist * y_dist; // 总距离, m

	            dist < e.max && (e === current && dist >= e.max / 2 && (r.x -= 0.03 * x_dist, r.y -= 0.03 * y_dist), // 靠近的时候加速
	            d = (e.max - dist) / e.max, context.beginPath(), context.lineWidth = d / 2, context.strokeStyle = 'rgba(' + _this4.c.color + ',' + (d + 0.2) + ')', context.moveTo(r.x, r.y), context.lineTo(e.x, e.y), context.stroke());
	          }
	        }
	      });
	      this.requestFrame(this.drawCanvas);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      // 清除事件
	      (0, lib.clear)(this.el);

	      // mouse 事件清除
	      window.onmousemove = this.onmousemove; // 回滚方法
	      window.onmouseout = this.onmouseout;

	      // 删除轮询
	      (0, utils.cancelAnimationFrame)(this.tid);

	      // 删除 dom
	      this.canvas.parentNode.removeChild(this.canvas);
	    }
	  }]);

	  return CanvasNest;
	}();

	CanvasNest.version = '2.0.4';
	exports.default = CanvasNest;
	module.exports = exports['default'];
	});

	unwrapExports(CanvasNest_1);

	var lib$1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});



	var _CanvasNest2 = _interopRequireDefault(CanvasNest_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _CanvasNest2.default; /**
	                                         * Created by hustcc on 18/6/23.
	                                         * Contract: i@hust.cc
	                                         */

	module.exports = exports['default'];
	});

	var CanvasNest = unwrapExports(lib$1);

	const _header = document.querySelector('header');
	const _menu = document.querySelector('.menu');
	const _container = document.querySelector('.container');
	init();

	function init () {
	    const linkArray = document.querySelectorAll('a.item');
	    const background = document.querySelector('.background');
	    const canvasNests = initNests(background);
	    linkHandler(linkArray);
	}

	function initNests(element) {
	    const config = {
	        color: '255,255,255',
	        pointColor: '125, 125, 125',
	        count: 120,
	    };
	    return new CanvasNest(element, config);
	}

	function linkHandler (links) {
	    links.forEach(link => {
	        link.addEventListener('click', (e) => {
	            const demo = createIframe(e.target.href);
	            _menu.classList.toggle('active');
	            _header.classList.toggle('back');
	            setTimeout(() => {
	                _container.appendChild(demo);
	                _menu.classList.toggle('inactive');
	                demo.classList.toggle('active--demo');
	            }, 300);
	            handleReturn(demo);
	            e.preventDefault();
	        });
	    });
	}

	function createIframe (href) {
	    const section = document.createElement('section');
	    const iFrame = document.createElement('iframe');
	    section.classList.add('demo');
	    iFrame.src = href;
	    section.append(iFrame);
	    return section
	}

	function handleReturn(demo) {
	    _header.addEventListener ( 'click',  function _handler(e) {
	        _header.classList.toggle('back');
	        demo.classList.toggle('active');
	        setTimeout(() => {
	            demo.remove();
	        },300);
	        _menu.classList.remove(..._menu.classList);
	        _menu.classList.add('active', 'menu');
	        e.currentTarget.removeEventListener(e.type, _handler);
	        e.preventDefault ();
	    });
	}

}());
