var RestaurantApp = (function (){

  L.mapbox.accessToken = 'pk.eyJ1IjoiZGlua3lkYW5pIiwiYSI6Ijk1NjAyOWNkMDRkMGNhNGU4ZWRiODJjMDliMzU3MTYzIn0.qk7QqCITMJVzPGW0oqLgvQ';

  var centerLondon = [51.507351, -0.127758];
  

  var RestaurantMap = function () {
    this.map = L.mapbox.map('map', 'mapbox.streets')
                .setView(centerLondon, 13);
    this.initialise();
  };

  RestaurantMap.prototype.initialise = function () {
    
    $.when(this.getData(), this.getLocation())
      .then(this.renderMarkers.bind(this))
      .fail(function (e) {
        console.error(e);
      });
  };

  RestaurantMap.prototype.getLocation = function () {

    var promise = $.Deferred();

    var location = JSON.parse(localStorage.getItem('location'));
    if(location) {
      return promise.resolve(location);
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var latlng = [pos.coords.latitude, pos.coords.longitude];
        localStorage.setItem('location', JSON.stringify(latlng));
        promise.resolve(latlng);
      });
    } else {
      promise.reject('Sorry, your browser does not support geolocation services');
    }
    return promise;
  };

  RestaurantMap.prototype.getData = function () {
    return $.getJSON('restaurants.json')
      .then(function (d) {
        return d.OpenRestaurants;
      });
  };

  RestaurantMap.prototype.renderMarkers = function (restaurants, geo) {

    restaurants.forEach( function (restaurant) {

      var lat = restaurant.Address.Latitude;
      var lon = restaurant.Address.Longitude;

      if (lat && lon) {
        var icon = L.mapbox.marker.icon({
                  'marker-color': '#c50409',
                  'marker-size': 'medium',
                  'marker-symbol': 'restaurant'
                });

        var marker = L.marker([lat, lon], {icon: icon});
        
        var name   = restaurant.Name;
        var logo   = restaurant.LogoUrl;
        var rating = restaurant.RatingDetails;

        // Get only the cuisine names as an array
        var cuisines = restaurant.Cuisines.reduce(function (p, v) {
          return p.concat(v.Name);
        }, []);

        var distance = this.getDistance(marker.getLatLng(), geo);
        
        var content  = this.getContent(name, logo, rating, cuisines, distance);

        marker.bindPopup(content);
        marker.addTo(this.map);
      }
    }, this);
  };

  RestaurantMap.prototype.getDistance = function (from, to) {
    return (from.distanceTo(to) / 1000).toFixed(2);
  };

  RestaurantMap.prototype.getContent = function (name, logo, rating, cuisines, distance) {
    var content = '';

    content += this.getHeaderContent(name, logo);
    content += this.getRatingContent(rating);
    content += this.getCuisinesContent(cuisines);
    content += this.getDistanceContent(distance);

    return content;
  };

  RestaurantMap.prototype.getDistanceContent = function(distance) {
    return '<p class="distance">' + distance + 'km from you.</p>';
  };

  RestaurantMap.prototype.getHeaderContent = function (name, logo) {
    return '<h2>' + name  + '</h2><img src="' + logo + '">';
  };

  RestaurantMap.prototype.getCuisinesContent = function (cuisines) {
    var content = '<ul>';
    cuisines.forEach( function (cuisine) {
      content += ('<li>' + cuisine + '</li>');
    });
    content += '</ul>';
    return content;
  };

  RestaurantMap.prototype.getRatingContent = function (rating) {
    var content = '';
    content += '<p class="rating">' + rating.StarRating + '/6';
    content += ' (' + rating.Count;
    content += (rating.Count == 1 ? ' vote' : ' votes') + ')';
    content += '</p>';
    return content;
  };

  return RestaurantMap;

}());