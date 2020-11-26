import { createPathComponent } from '@react-leaflet/core';
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

L.MarkerClusterGroup.addInitHook(function () {
  this._layerBuffer = [];
});

const MarkerClusterGroup = createPathComponent(
  ({ children: _c, ...props }, ctx) => {
    const clusterProps = {};
    const clusterEvents = {};

    // Splitting props and events to different objects
    Object.entries(props).forEach(([propName, prop]) =>
      propName.startsWith('on')
        ? (clusterEvents[propName] = prop)
        : (clusterProps[propName] = prop)
    );

    // Creating markerClusterGroup Leaflet element
    const markerClusterGroup = new L.markerClusterGroup(clusterProps);

    // Initializing event listeners
    Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
      const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
      markerClusterGroup.on(clusterEvent, callback);
    });

    return {
      instance: markerClusterGroup,
      context: { ...ctx, layerContainer: markerClusterGroup },
    };
  }
);

export default MarkerClusterGroup;
