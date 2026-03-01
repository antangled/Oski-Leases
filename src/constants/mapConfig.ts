import type { ReferencePoint } from '../types/listing';

export const CAMPUS_CENTER: ReferencePoint = {
  lat: 37.8719,
  lng: -122.2585,
};

export const MAP_CONFIG = {
  center: [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng] as [number, number],
  zoom: 15,
  minZoom: 13,
  maxZoom: 18,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

export const CAMPUS_NAME = 'UC Berkeley';
