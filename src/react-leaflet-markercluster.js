import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';

import {LayerGroup} from 'react-leaflet';
import L from 'leaflet'
import 'leaflet.markercluster';

// TODO: remove from v1.2.0 because of deprecated wrapperOptions prop
import './style.scss';

export default class MarkerClusterGroup extends LayerGroup {

  componentWillMount() {
    // Override auto created leafletElement with L.markerClusterGroup element
    this.leafletElement = L.markerClusterGroup(this.props.options);

    // TODO: remove from v1.2.0 because of deprecated wrapperOptions prop
    this.initMapClasses();

    if (this.props.markers.length) {
      this.addLayersWithMarkersFromProps(this.props.markers);
    }

    // Init listeners for markerClusterGroup leafletElement only once
    this.initEventListeners(this.leafletElement);
  }

  componentWillReceiveProps(nextProps) {
    if (!isArraysEqual(this.props.markers, nextProps.markers)) {
      // Remove layer from map with previously rendered clustered markers
      this.layerContainer.removeLayer(this.leafletElement);
      // Remove layers with markers from markerClusterGroup
      this.leafletElement.clearLayers();

      nextProps.markers.length && this.addLayersWithMarkersFromProps(nextProps.markers);
    }
  }

  initMapClasses() {
    const {wrapperOptions} = this.props;
    if (wrapperOptions) {
      const mapClassName = this.context.map._container.className;
      const isStyledClassAppliyed = mapClassName.indexOf('marker-cluster-styled') !== -1;
      const isAnimatedClassAppliyed = mapClassName.indexOf('marker-cluster-animated') !== -1;

      wrapperOptions.enableDefaultStyle && !isStyledClassAppliyed && (
        this.context.map._container.className += ' marker-cluster-styled'
      );

      !wrapperOptions.disableDefaultAnimation && !isAnimatedClassAppliyed && (
        this.context.map._container.className += ' marker-cluster-animated'
      );
    }
  }

  removeMarkersWithSameCoordinates(markers) {
    // init filtered markers list with first marker from list
    let filteredMarkers = [markers[0]];

    markers.forEach((marker) => {
      if (!JSON.stringify(filteredMarkers).includes(JSON.stringify(marker))) {
        filteredMarkers.push(marker);
      }
    });

    return filteredMarkers;
  }

  addLayersWithMarkersFromProps(markers) {
    const {markerOptions, wrapperOptions, children} = this.props;

    let markersOptions = markerOptions
      ? Object.assign({}, markerOptions)
      : {};

    // TODO: remove from v1.2.0 because of deprecated wrapperOptions prop
    let filteredMarkers = wrapperOptions && wrapperOptions.removeDuplicates
      ? this.removeMarkersWithSameCoordinates(markers)
      : markers;

    let leafletMarkers = [];

    filteredMarkers.forEach((marker) => {
      let currentMarkerOptions = marker.options
        ? Object.assign({}, marker.options)
        : null ;

      let leafletMarker = L.marker(
        [marker.lat, marker.lng],
        currentMarkerOptions || markersOptions
      );

      marker.popup && leafletMarker.bindPopup(marker.popup);
      marker.tooltip && leafletMarker.bindTooltip(marker.tooltip);

      leafletMarkers.push(leafletMarker);
    });

    // Add markers leafletElements to the markerClusterGroup
    this.leafletElement.addLayers(leafletMarkers);
    // Add clustered markers to the leaflet map
    !children && this.layerContainer.addLayer(this.leafletElement);
  }

  initEventListeners(markerClusterGroup) {
    this.props.onMarkerClick && (
      markerClusterGroup.on('click', (marker) => {
        this.props.onMarkerClick(marker.layer);
      })
    );

    this.props.onClusterClick && (
      markerClusterGroup.on('clusterclick', (cluster) => {
        this.props.onClusterClick(cluster.layer);
      })
    );

    this.props.onPopupClose && (
      markerClusterGroup.on('popupclose', (map) => {
        this.props.onPopupClose(map.popup);
      })
    );
  }

  addLayersWithReactLeafletMarkers() {
    const leafletMarkers = [];

    // Map through all react-leaflet Markers and clone them with ref prop
    // ref prop required to get leafletElement of Marker
    return Children.map(this.props.children, (reactLeafletMarker, index) => (
      cloneElement(reactLeafletMarker, {
        ref: (marker) => {
          if (marker) {
            leafletMarkers.push(marker.leafletElement);

            if (
              (index === (this.props.children.length - 1)) ||
              // addClusteredMarkersToMap when there is only one marker
              !Array.isArray(this.props.children)
            ) {
              // Add markers leafletElements to the markerClusterGroup
              this.leafletElement.addLayers(leafletMarkers);
              // Add clustered markers to the leaflet map
              this.layerContainer.addLayer(this.leafletElement);
            }
          }
        },
        key: `react-leaflet-marker-${index}`
      })
    ));
  }

  getLeafletElement() {
    return this.leafletElement;
  }

  render() {
    return this.props.children
    ? (
      <section className="marker-cluster-group">
        {this.addLayersWithReactLeafletMarkers()}
      </section>
    )
    : null;
  }
}

function isArraysEqual(firstArray, secondArray) {
  return (JSON.stringify(firstArray) === JSON.stringify(secondArray));
}

MarkerClusterGroup.propTypes = {
  // List of markers with required lat and lng keys
  markers: PropTypes.arrayOf(PropTypes.object),
  // List of react-leaflet markers
  children: PropTypes.node,
  // All available options for Leaflet.markercluster
  options: PropTypes.object,
  // All available options for Leaflet.Marker
  markerOptions: PropTypes.object,
  // Options that are supporting by react-leaflet-markercluster wrapper
  wrapperOptions: PropTypes.object,
  // Events
  onMarkerClick: PropTypes.func,
  onClusterClick: PropTypes.func,
  onPopupClose: PropTypes.func
}

MarkerClusterGroup.defaultProps = {
  markers: [],
};
