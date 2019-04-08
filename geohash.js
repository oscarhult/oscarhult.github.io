// geohash.js
// Geohash library for Javascript
// (c) 2008 David Troy
// Distributed under the MIT License
PRECISION = 10;
BITS = [16, 8, 4, 2, 1];
BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
function refine_interval(interval, cd, mask) {
  if (cd & mask) interval[0] = (interval[0] + interval[1]) / 2;
  else interval[1] = (interval[0] + interval[1]) / 2;
}
function decodeGeoHash(geohash) {
  var is_even = 1;
  var lat = [];
  var lon = [];
  lat[0] = -90.0;
  lat[1] = 90.0;
  lon[0] = -180.0;
  lon[1] = 180.0;
  lat_err = 90.0;
  lon_err = 180.0;
  for (i = 0; i < geohash.length; i++) {
    c = geohash[i];
    cd = BASE32.indexOf(c);
    for (j = 0; j < 5; j++) {
      mask = BITS[j];
      if (is_even) {
        lon_err /= 2;
        refine_interval(lon, cd, mask);
      } else {
        lat_err /= 2;
        refine_interval(lat, cd, mask);
      }
      is_even = !is_even;
    }
  }
  return { lat: (lat[0] + lat[1]) / 2, lng: (lon[0] + lon[1]) / 2 };
}
function encodeGeoHash(latitude, longitude) {
  var is_even = 1;
  var lat = [];
  var lon = [];
  var bit = 0;
  var ch = 0;
  lat[0] = -90.0;
  lat[1] = 90.0;
  lon[0] = -180.0;
  lon[1] = 180.0;
  geohash = "";
  while (geohash.length < PRECISION) {
    if (is_even) {
      mid = (lon[0] + lon[1]) / 2;
      if (longitude > mid) {
        ch |= BITS[bit];
        lon[0] = mid;
      } else lon[1] = mid;
    } else {
      mid = (lat[0] + lat[1]) / 2;
      if (latitude > mid) {
        ch |= BITS[bit];
        lat[0] = mid;
      } else lat[1] = mid;
    }
    is_even = !is_even;
    if (bit < 4) bit++;
    else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}
