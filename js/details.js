var details = (function(){

    var activeDayData = null;

    // get dom elements
    this.weatherDetails = document.getElementById("weather-details");
    this.detailsTemplate = document.getElementById("details-template");

    // attach events
    events.on('newDataReceived', dataReceivedHandler);
    events.on('activeDayChanged', dayChangeHandler);


    function dataReceivedHandler(forecast) {
        activeDayData = forecast.data[0];
        renderDetails();
    }

    function dayChangeHandler(data) {
        activeDayData = data.info;
        renderDetails();
    }

    function renderDetails() {
        let html = detailsTemplate.innerHTML
            .replace(/{{temperature}}/g, activeDayData.temp)
            .replace(/{{description}}/g, activeDayData.weather.description)
            .replace(/{{icon}}/g, activeDayData.weather.icon);

        this.weatherDetails.innerHTML = html;
    }

})();
