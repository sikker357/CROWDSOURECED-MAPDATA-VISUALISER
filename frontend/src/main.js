
import {
  Map,
  NavigationControl,
  Marker,
  Popup,
  setWorkerUrl
} from 'maplibre-gl';

import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';

// Tell MapLibre which worker file to use.
// Vite bundles the worker and resolves its URL.
setWorkerUrl(workerUrl);

const map = new Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [76.2144, 10.5276],
  zoom: 10,
  minZoom: 8,
  maxZoom: 18,
  maxBounds: [
    [75.9, 10.1],
    [76.8, 10.9]
  ]
});

map.addControl(new NavigationControl(), 'top-right');



const contributions = [
  {
    id: 'sample-1',
    name: 'Community Garden',
    activity: 'Urban gardening',
    description: 'A sample contribution for testing map pins.',
    coordinates: [76.2144, 10.5276]
  },
  {
    id: 'sample-2',
    name: 'Public Art Project',
    activity: 'Public art',
    description: 'Another sample contribution with its own popup.',
    coordinates: [76.23, 10.54]
  }
];

contributions.forEach((contribution) => {
  const popupContent = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = contribution.name;

  const activity = document.createElement('p');
  activity.textContent = contribution.activity;

  const description = document.createElement('p');
  description.textContent = contribution.description;

  popupContent.append(title, activity, description);

  const popup = new Popup({
    offset: 25,
    maxWidth: '280px'
  }).setDOMContent(popupContent);

  new Marker()
    .setLngLat(contribution.coordinates)
    .setPopup(popup)
    .addTo(map);
});



map.on('load', () => {
  console.log('Thrissur Grounds map loaded successfully.');
});

map.on('error', (event) => {
  console.error('MapLibre error:', event.error);
});



const chooseLocationButton = document.querySelector('#choose-location');
const locationStatus = document.querySelector('#location-status');
const coordinatesDisplay = document.querySelector('#coordinates');

let isSelectingLocation = false;
let selectedLocation = null;
let selectionMarker = null;

chooseLocationButton.addEventListener('click', () => {
  isSelectingLocation = true;

  locationStatus.textContent =
    'Location selection active. Click the map to place your pin.';

  map.getCanvas().style.cursor = 'crosshair';
});

map.on('click', (event) => {
  if (!isSelectingLocation) {
    return;
  }

  const { lng, lat } = event.lngLat;

  selectedLocation = [lng, lat];

  if (selectionMarker) {
    selectionMarker.setLngLat(selectedLocation);
  } else {
    selectionMarker = new Marker({ color: '#e4572e' })
      .setLngLat(selectedLocation)
      .addTo(map);
  }

  coordinatesDisplay.textContent =
    `Longitude: ${lng.toFixed(6)}, Latitude: ${lat.toFixed(6)}`;

  locationStatus.textContent = 'Location selected successfully.';

  isSelectingLocation = false;
  map.getCanvas().style.cursor = '';
});
