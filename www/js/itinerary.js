window.itinerary = itinerary = {

  initialize: function($, hub) {
    this.$ = $;
    this.hub = hub;
    this.$el = $('#itinerary ul');
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
      var $a = self.$el.find('[rel="' + place.id + '"]');
      var $li = $a.closest('li');
      var $ul = $li.closest('ul');
      var $div = $ul.closest('div');
      var lis = $ul.find('li');
      self.$el.find('li').removeClass('active');
      $li.addClass('active')
      var offset = lis.slice(0, lis.indexOf($li[0])).reduce(function(width, li) { return width + $(li).width(); }, $li.width())
      var width = $div.width();
      console.log(offset, width);
      var left = offset > width ? offset - width : 0;
      $div.css({ left: left * -1 });
    });

    hub.on('unhighlightPlace', function(place) {
      self.$el.find('[rel="' + place.id + '"]').parent().removeClass('active');
    });
  },

  setTour: function(tour) {
    this.$el.html('');
    this.tour = tour;
    var widths = this.tour.places.map(function(place) {
      var li = this.$('<li><a href="#" rel="' + place.id + '">' + place.name + '</a></li>');
      this.$el.append(li);
      return $(li).width();
    }, this);
    var width = widths.reduce(function(sum, w) { return sum + w });
    this.$el.css({ width: width });
  }
}

