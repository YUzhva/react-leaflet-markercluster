import { MapLayer, withLeaflet } from 'react-leaflet';
import L from 'leaflet';

require('leaflet.markercluster');

L.MarkerClusterGroup.include({
  _flushLayerBuffer() {
    this.addLayers(this._layerBuffer);
    this._layerBuffer = [];
  },

  addLayer(layer) {
    if (this._layerBuffer.length === 0) {
      setTimeout(this._flushLayerBuffer.bind(this), 50);
    }
    this._layerBuffer.push(layer);
  },
});

L.MarkerClusterGroup.addInitHook(function() {
  this._layerBuffer = [];
});

class MarkerClusterGroup extends MapLayer {
  createLeafletElement({ children, leaflet: { map }, ...props }) {
    const clusterProps = {};
    const clusterEvents = {};

    // Splitting props and events to different objects
    Object.entries(props).forEach(
      ([propName, prop]) => propName.startsWith('on')
        ? clusterEvents[propName] = prop
        : clusterProps[propName] = prop
    );

    // Creating markerClusterGroup Leaflet element
    const markerClusterGroup = new L.markerClusterGroup(clusterProps);
    this.contextValue = { layerContainer: markerClusterGroup, map };

    // Initializing event listeners
    Object.entries(clusterEvents).forEach(
      ([eventAsProp, callback]) => {
        const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
        markerClusterGroup.on(clusterEvent, callback);
      }
    );

    return markerClusterGroup;
  }
}

export default withLeaflet(MarkerClusterGroup);
