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
  popupHTML: function(place, note) {
    var img;
    if (place.photos && place.photos.value) {
      var item = place.photos.value.groups[0].items[0];
      img = item.prefix + '100x100' + item.suffix;
    }
    var prev = this.tour.places.indexOf(place) > 0;
    var next = this.tour.places.indexOf(place) < this.tour.places.length - 1;
    return [
      "<div class='place' id='" + place.id + "'>",
        "<h3>" + place.name + "</h3>",
        "<p>Note: " + note + "</p>",
        (img ? "<img src='" + img + "' />" : ""),
        "<p>" + ((prev) ? "<a href='#' class='previous'>previous</a>" : "") + " " + ((next) ? "<a href='#' class='next'>next</a></p>" : ""),
      "</div>"
    ].join('');
  },

  // tour stuff
  tour: null,
  markers: [],

  setTour: function(tour) {
    this.tour = tour;
    this.clear();
    this.render();
  },

  clear: function() {
    this.markers.forEach(this.mapbox.removeLayer, this.mapbox);
  },

  render: function() {

    var bounds = this.tour.places.map(function(place, i) {

      var pos = [ place.location.latitude, place.location.longitude ];

      var marker = L.marker(pos);
      marker.id = place.id;

      marker
        .bindPopup(this.popupHTML(place, this.tour.notes[i][0]))
        // trash the default action
        .off('click', this.togglePopup);

      this.markers.push(marker.addTo(this.mapbox));

      marker.on('click', function() {
        this.tour.places.forEach(this.hub.trigger.bind(this.hub, 'unhighlightPlace'));
        this.hub.trigger('highlightPlace', place);
      }, this);

      marker.on('popupclose', function() {
        this.hub.trigger('unhighlightPlace', place);
      }, this);

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
    var self = this;
    this.$('body')
      .on('click', '.next', function(e) {
        var id = self.$(e.target).closest('.place').attr('id');
        var place = self.tour.places.filter(function(p) { return p.id === id; })[0];
        var nextPlace = self.tour.places[self.tour.places.indexOf(place) + 1] || self.tour.places[0];
        self.hub.trigger('highlightPlace', nextPlace);
      })
      .on('click', '.previous', function(e) {
        var id = $(e.target).closest('.place').attr('id');
        var place = self.tour.places.filter(function(p) { return p.id === id; })[0];
        var previousPlace = self.tour.places[self.tour.places.indexOf(place) - 1] || self.tour.places[self.tour.places.length - 1];
        self.hub.trigger('highlightPlace', previousPlace);
      });
  },

  initialize: function($, hub) {
    this.$ = $;
    this.hub = hub;
    this.mapbox = new L.mapbox.map(this.el, this.name, this.options); 
    this.hub.on('showingTour', this.setTour, this);
    this.bindEvents();
  }
}
