var dropdown = (function(){
    var apiUrl = "https://api.weatherbit.io/v2.0/forecast/daily?key=79e0d5560e3f46bcb4d3cd8503750e94&days=7";
    var googleApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&key=AIzaSyCoAKAKHIHr6Sx2tkCgthYtZ3t2EQLKBNQ"

    // get dom elements
    var selectEl = document.getElementById("location-dropdown");

    // attach events
    selectEl.addEventListener('change', changeLocationHandler);

    // init
    fetchForecast();
    getUserLocation();


    
    function fetchForecast(city) {
        var city = city ? city : 'yerevan';

        return fetch(`${apiUrl}&city=${city}`)
            .then(res => res.json())
            .then(res => {
                events.trigger('newDataReceived', res);
                return res;
            });
    }
    
    function changeLocationHandler(event) {
        var city = event.target.value;
        fetchForecast(city);
        events.trigger('locationChanged');
    }

    function getUserLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                fetch(`${googleApiUrl}&latlng=${lat},${lng}`)
                    .then(res => res.json())
                    .then(res => {
                        getCityByCoords(res)
                    })
            });
        } 
    }

    function getCityByCoords(data) {
        // some messy things to find a city by coordinates, dont't judje :)
        if (data.status === "OK") {
            if (data.results[1]) {
                for (var i=0; i<data.results[0].address_components.length; i++) {
                    for (var b=0;b<data.results[0].address_components[i].types.length;b++) {
                        if (data.results[0].address_components[i].types[b] == "administrative_area_level_1") {
                            city= data.results[0].address_components[i];
                            preselectCity(city.long_name);
                            break;
                        }
                    }
                }
            }
        }
    }

    function preselectCity(city) {
        var city = city.toLowerCase();
        selectEl.value = city;
    }

})();
