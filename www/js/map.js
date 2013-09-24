window.map = map = {

  // map stuff
  el: document.getElementById('map'),
  name: 'bbarr.map-tvg4iseh',
  options: {
    center: new L.LatLng(41.7898354, -69.9897323),
    zoom: 15,
    zoomControl: false,
    maxBounds: new L.LatLngBounds(
      new L.LatLng(41.7380, -70.031),
      new L.LatLng(41.8107, -69.919)
    ).pad(.2)
  },

  // tour stuff
  tour: null,
  markers: [],
  polylines: [],

  setTour: function(tour) {
    this.tour = tour;
    this.clear();
    this.render();
  },

  clear: function() {
    this.markers.concat(this.polylines).forEach(this.mapbox.removeLayer, this.mapbox);
  },

  render: function() {

    var bounds = this.tour.places.map(function(place, i) {

      var pos = [place.location.latitude, place.location.longitude];

      var marker = L.marker(pos);
      marker.id = place.id;
      marker.bindPopup(this.tour.notes[i][0]);
      this.markers.push(marker.addTo(this.mapbox));

      marker.on('mouseover', function() {
        this.hub.trigger('highlightPlace', place);
      }, this);

      marker.on('mouseout', function() {
        this.hub.trigger('unhighlightPlace', place);
      }, this);

      var last = this.markers[i - 1];
      if (last) {

        var polyline = L.polyline([ last.getLatLng(), pos ]);
        polyline.bindPopup(this.tour.notes[i - 1][1] || 'no comment');
        this.polylines.push(polyline.addTo(this.mapbox));

        polyline.on('mouseover', function(e) {
          var center = e.target.getBounds().getCenter();
          polyline.openPopup(center);
        }, this);

        polyline.on('mouseout', function() {
          polyline.closePopup();
        }, this);
      }

      return pos;
    }, this);

    this.mapbox
      .invalidateSize()
      .fitBounds(bounds);
  },

  bindEvents: function() {
    this.hub.on('highlightPlace', function(place) {
      var marker = this.markers.filter(function(m) { return m.id === place.id; })[0];
      marker.openPopup();
    }, this);
    this.hub.on('unhighlightPlace', function(place) {
      var marker = this.markers.filter(function(m) { return m.id === place.id; })[0];
      marker.closePopup();
    }, this);
  },

  initialize: function($, hub) {
    this.$ = $;
    this.hub = hub;
    this.mapbox = new L.mapbox.map(this.el, this.name, this.options); 
    this.hub.on('showingTour', this.setTour, this);
    this.bindEvents();
  }
}
