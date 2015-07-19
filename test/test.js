var restMap = new RestaurantApp();

describe('RestaurantApp', function () {

  describe('RestaurantMap', function () {

    it('should remember member variables', function () {
      expect(restMap).to.be.a(RestaurantApp)
      expect(restMap.map).to.be.ok();
      expect(restMap.map).to.be.an('object');
    });

  });


  describe('getLocation', function () {
    
    it('should return an array of lat, lon', function () {
      restMap.getLocation().then( function (geo) {
        expect(geo).to.be.an('array');
        expect(geo).to.have.length(2);
      });
    });

    it('should store geo in local storage', function () {
      
      localStorage.removeItem('location');
      expect(localStorage.getItem('location')).to.be(null);

      restMap.getLocation().then( function (geo) {
        expect(localStorage.getItem('location')).to.be.ok();
      });

    });
  });

  describe('getData', function () {
    it('returns an array of open restaurant objects', function () {
      restMap.getData().then(function (data) {
        expect(data).to.be.ok();
        expect(data).to.be.an('array');
        expect(data[0]).to.be.an('object');
      });
    });

    it('returns an objects with the correct properties', function () {
      restMap.getData().then(function (data) {
        expect(data[0]).to.have.key('Name');
        expect(data[0]).to.have.key('Address');
        expect(data[0]).to.have.key('Cuisines');
        expect(data[0].Cuisines).to.be.an('array');

        expect(data[0]).to.have.key('RatingDetails');
        expect(data[0]).to.have.key('LogoUrl');

        expect(data[0].Address).to.have.key('Latitude');
        expect(data[0].Address).to.have.key('Longitude');

        expect(data[0].RatingDetails).to.have.key('Count');
        expect(data[0].RatingDetails).to.have.key('StarRating');
      });
    });
  });

  describe('renderMarkers', function () {

  });

  describe('getDistance', function () {
    it('returns a the distance in km between two markers', function () {
      var marker   = L.marker([51.5233, -0.093295]);
      
      // Requires a marker LatLng object
      var from     = marker.getLatLng();
      var to       = [51.899971099999995, -2.0711333]
      var distance = restMap.getDistance(from, to);

      expect(distance).to.be('142.72');
      expect(distance).to.be.a('string');
    });

    it('returns a 0 for two markers the same', function () {
      var marker   = L.marker([0, 0]);
      
      // Requires a marker LatLng object
      var from     = marker.getLatLng();
      var to       = [0, 0]
      var distance = restMap.getDistance(from, to);

      expect(distance).to.be('0.00');
      expect(distance).to.be.a('string');
    });
  });

  describe('getHeaderContent', function () {
    it('returns a string with name and logo', function () {
      var content = restMap.getHeaderContent("Test", "test.gif");
      var expected = '<h2>Test</h2><img src="test.gif">'
    });
  });

  describe('getRatingContent', function () {
    it('returns a string with "vote" for 1 vote', function () {
      var rating = {
        StarRating: 4,
        Count: 1
      };
      var content  = restMap.getRatingContent(rating);
      var expected = '<p class="rating">4/6 (1 vote)</p>'
      expect(content).to.be(expected);
    });

    it('returns a string with "votes" for 0 or more than 1 votes', function () {
      var rating = {
        StarRating: 6,
        Count: 50
      };
      var content  = restMap.getRatingContent(rating);
      var expected = '<p class="rating">6/6 (50 votes)</p>'
      expect(content).to.be(expected);
    });
  });

  describe('getCuisinesContent', function () {
    it('returns a list of cuisines', function () {
      var cuisines = ['Italian', 'Pizza']
      var content  = restMap.getCuisinesContent(cuisines);
      var expected = '<ul><li>Italian</li><li>Pizza</li></ul>'
      expect(content).to.be(expected);
    });
  });

  describe('getDistanceContent', function () {
    it('returns a string with the distance', function () {
      var content  = restMap.getDistanceContent('100');
      var expected = '<p class="distance">100km from you.</p>'
      expect(content).to.be(expected);
    });
  });
});



