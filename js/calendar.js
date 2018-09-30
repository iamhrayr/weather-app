var calendar = (function(){

    // internal variables
    var weekDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var selectedDayIndex = 0;
    var forecast = null;

    // get dom elements
    var daysWrapper = document.getElementById('days-wrapper');
    var dayTemplate = document.getElementById('day-template');

    // attach events
    events.on('newDataReceived', dataReceivedHandler);
    events.on('locationChanged', locationChangeHedler);


    // rerender view when new data received
    function dataReceivedHandler(data) {
        forecast = data;
        render();
    }

    // trigger day change event
    function changeActiveDay(index, data){
        selectedDayIndex = index;
        events.trigger('activeDayChanged', data);
    }

    // make current day active on location change 
    function locationChangeHedler() {
        selectedDayIndex = 0;
    }

    // click handler for the individual day 
    function singleDayClickHandler(e, index) {
        var activeDayEl = document.querySelector('.single-day.active');
        activeDayEl.classList.remove('active');
        e.currentTarget.classList.add('active');
        changeActiveDay(index, forecast.data[index]);
    }

    // render html
    function render() {
        var list = '';

        forecast.data.forEach(function(item, index) {
            // api returns timestamp in seconds, js works with miliseconds
            const date = new Date(item.ts * 1000);
            const activeClass = index === selectedDayIndex ? 'active' : '';

            var newDayEl = dayTemplate;
            // get template and do markup changes based on the current item value
            list += newDayEl.innerHTML
                .replace(/{{activeClass}}/g, activeClass)
                .replace(/{{date}}/g, date.getDate())
                .replace(/{{month}}/g, monthsList[date.getMonth()])
                .replace(/{{day}}/g, weekDaysList[date.getDay()])
        }.bind(this));

        daysWrapper.innerHTML = list;

        var days = document.getElementsByClassName('single-day');
        for (var i = 0; i < days.length; i++) {
            (function(index){
                days[i].addEventListener('click', function(e) { 
                    singleDayClickHandler(e, index)
                });
            })(i)
        }
    }

})();
