
window.tourguide = tourguide = {

  dom: {},
   
  initialize: function($, hub) {

    this.$ = $;
    this.hub = hub;

    this.$tour = $('#tour');
    this.$dash = $('#dash');
    this.$list = $('#list');
    this.$details = $('#details');
    this.$into = $('#intro');

    this.bindEvents();

    this.fetch();
    this.hub.on('toursLoaded', function(tours) {
      this.tours = tours;
      this.populateList();
    }, this);

    this.showDash();
  },

  showDash: function() {
    this.$dash.show();
    this.$tour.hide();
  },

  showTour: function(tour) {
    this.$dash.hide();
    this.$tour.show();
    this.hub.trigger('showingTour', tour)
  },

  populateList: function() {
    this.$list.html('');
    this.tours.forEach(function(tour) {
      this.$list.append(this.$('<li><a href="#" rel="' + tour.id + '">' + tour.name + '</a></li>'));
    }, this);
  },

  fetch: function() {
    var hub = this.hub;
    return $.get('http://localhost:9393/tours', function(tours) {
      hub.trigger('toursLoaded', tours);
    });
  },

  bindEvents: function() {

    this.$list.on('click', 'a', function(e) {
      e.preventDefault();
      var id = e.target.getAttribute('rel');
      var tour = this.tours.filter(function(tour) { return tour.id === id; })[0];
      this.showTour(tour); 
    }.bind(this));

    this.$details.find('#back').on('click', function(e) {
      e.preventDefault();
      this.showDash();
    }.bind(this));
  }
}
