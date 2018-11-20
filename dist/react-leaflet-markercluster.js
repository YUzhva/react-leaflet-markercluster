'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactLeaflet = require('react-leaflet');

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('leaflet.markercluster');

_leaflet2.default.MarkerClusterGroup.include({
  _flushLayerBuffer: function _flushLayerBuffer() {
    this.addLayers(this._layerBuffer);
    this._layerBuffer = [];
  },
  addLayer: function addLayer(layer) {
    if (this._layerBuffer.length === 0) {
      setTimeout(this._flushLayerBuffer.bind(this), 50);
    }
    this._layerBuffer.push(layer);
  }
});

_leaflet2.default.MarkerClusterGroup.addInitHook(function () {
  this._layerBuffer = [];
});

var MarkerClusterGroup = function (_MapLayer) {
  _inherits(MarkerClusterGroup, _MapLayer);

  function MarkerClusterGroup() {
    _classCallCheck(this, MarkerClusterGroup);

    return _possibleConstructorReturn(this, (MarkerClusterGroup.__proto__ || Object.getPrototypeOf(MarkerClusterGroup)).apply(this, arguments));
  }

  _createClass(MarkerClusterGroup, [{
    key: 'createLeafletElement',
    value: function createLeafletElement(_ref) {
      var children = _ref.children,
          map = _ref.leaflet.map,
          props = _objectWithoutProperties(_ref, ['children', 'leaflet']);

      var clusterProps = {};
      var clusterEvents = {};

      // Splitting props and events to different objects
      Object.entries(props).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            propName = _ref3[0],
            prop = _ref3[1];

        return propName.startsWith('on') ? clusterEvents[propName] = prop : clusterProps[propName] = prop;
      });

      // Creating markerClusterGroup Leaflet element
      var markerClusterGroup = new _leaflet2.default.markerClusterGroup(clusterProps);
      this.contextValue = { layerContainer: markerClusterGroup, map: map };

      // Initializing event listeners
      Object.entries(clusterEvents).forEach(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            eventAsProp = _ref5[0],
            callback = _ref5[1];

        var clusterEvent = 'cluster' + eventAsProp.substring(2).toLowerCase();
        markerClusterGroup.on(clusterEvent, callback);
      });

      return markerClusterGroup;
    }
  }]);

  return MarkerClusterGroup;
}(_reactLeaflet.MapLayer);

exports.default = (0, _reactLeaflet.withLeaflet)(MarkerClusterGroup);