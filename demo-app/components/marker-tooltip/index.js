import React from 'react';
import Highlight from 'react-highlight'; // eslint-disable-line import/no-extraneous-dependencies

import MarkerTooltipEGOne from './example-one';

const MarkerTooltip = () => (
  <div className="marker-tooltip">
    <p>Set marker tooltip as easy, as set marker popup.</p>
    <p>Just define key <strong>tooltip</strong> for marker object:</p>

    <Highlight className="javascript">
      {`
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

// Setting tooltip according to Leaflet documentation
// http://leafletjs.com/reference-1.0.3.html#tooltip-l-tooltip
const tooltipWithOptions = L.tooltip({ direction: 'bottom' })
  .setContent('my tooltip text 2');

// If you would like to add tooltip for marker
// just pass tooltip key to marker object:
const markers = [
  { position: [49.8397, 24.0297], tooltip: 'my tooltip text 1' },
  { position: [50.4501, 30.5234] },
  { position: [52.2297, 21.0122] },
  { position: [50.0647, 19.9450] },
  { position: [48.9226, 24.7111] },
  { position: [48.7164, 21.2611] },
  { position: [51.5, -0.09], tooltip: tooltipWithOptions },
];

// Put <MarkerClusterGroup ... /> inside react-leaflet after <TileLayer />
<Map className="markercluster-map" center={[51.0, 19.0]} zoom={4} maxZoom={18}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  />

    <MarkerClusterGroup markers={markers} />
</Map>
      `}
    </Highlight>

    <MarkerTooltipEGOne />

    <div className="alert alert-warning" role="alert">
      <a
        href="https://github.com/YUzhva/react-leaflet-markercluster/blob/master/demo-app/components/marker-tooltip/example-one.js"
        className="alert-link"
        target="_blank"
        rel="noopener noreferrer"
      >

        Link to the full sample code
      </a>
    </div>
  </div>
);

export default MarkerTooltip;
