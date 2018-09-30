var dropdown = (function(){

    // internal variables
    var apiUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?key=79e0d5560e3f46bcb4d3cd8503750e94&days=7';
    var googleApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&key=AIzaSyCoAKAKHIHr6Sx2tkCgthYtZ3t2EQLKBNQ';
    
    // get dom elements
    var selectEl = document.getElementById('location-dropdown');

    // attach events
    selectEl.addEventListener('change', function(e) { changeLocationHandler(e.target.value) });

    // init
    fetchForecast();
    getUserLocation();


    // fetch weather information based on the passed city
    function fetchForecast(city) {
        var city = city ? city : selectEl.value;

        return fetch(apiUrl + '&city=' + city)
            .then(res => res.json())
            .then(res => {
                events.trigger('newDataReceived', res);
                return res;
            });
    }
    

    function changeLocationHandler(city) {
        fetchForecast(city);
        events.trigger('locationChanged');
    }

    // get user coordinates if device supports geolocation
    function getUserLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                // get city based on coordinates
                getCityByCoords(lat, lng);
            });
        } 
    }

    function getCityByCoords(lat, lng) {
        // get address/city by coordinates, reverse geocoding request 
        fetch(googleApiUrl + '&latlng=' + lat + ',' + lng)
            .then(res => res.json())
            .then(res => {
                // some crazy things to find a city from the response, dont't judge :)
                if (res.status === 'OK') {
                    if (res.results[1]) {
                        for (var i=0; i<res.results[0].address_components.length; i++) {
                            for (var b=0;b<res.results[0].address_components[i].types.length;b++) {
                                if (res.results[0].address_components[i].types[b] == 'administrative_area_level_1') {
                                    city= res.results[0].address_components[i];

                                    // set default location value after receiving gps and converting it to city name
                                    preselectCity(city.long_name);
                                    break;
                                }
                            }
                        }
                    }
                }
            })
    }

    function preselectCity(city) {
        var city = city.toLowerCase();
        selectEl.value = city;
        changeLocationHandler(city)
    }

})();
