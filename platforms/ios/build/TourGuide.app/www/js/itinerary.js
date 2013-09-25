window.itinerary = itinerary = {

  initialize: function($, hub) {
    this.$ = $;
    this.hub = hub;
    this.$el = $('#itinerary');
    this.hub.on('showingTour', this.setTour, this);
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;
    
    this.$el.on('click', 'a', function(e) {
      e.preventDefault();
      var id = e.target.getAttribute('rel');
      self.tour.places.forEach(self.hub.trigger.bind(this.hub, 'unhighlightPlace'));
      self.hub.trigger('highlightPlace', self.tour.places.filter(function(p) { return p.id === id })[0]);
    });

    hub.on('highlightPlace', function(place) {
      self.$el.find('li').removeClass('active');
      self.$el.find('[rel="' + place.id + '"]').parent().addClass('active');
    });

    hub.on('unhighlightPlace', function(place) {
      self.$el.find('[rel="' + place.id + '"]').parent().removeClass('active');
    });
  },

  setTour: function(tour) {
    this.$el.html('');
    this.tour = tour;
    this.tour.places.forEach(function(place) {
      this.$el.append(this.$('<li><a href="#" rel="' + place.id + '">' + place.name + '</a></li>'));
    }, this);
  }
}

