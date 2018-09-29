var calendar = (function(){

    const weekDaysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var selectedDayIndex = 0;

    // get dom elements
    var daysWrapper = document.getElementById("days-wrapper");
    var dayTemplate = document.getElementById("day-template");

    // attach events
    events.on('newDataReceived', dataReceivedHandler);


    
    function dataReceivedHandler(data) {
        render(data);
    }

    function changeActiveDay(index, info){
        selectedDayIndex = index;
        events.trigger('activeDayChanged', {
            index: index,
            info: info,
        });
    }

    function render(forecast) {
        let list = '';

        forecast.data.forEach(function(item, index) {
            // api returns timestamp in seconds, js works with miliseconds
            const date = new Date(item.ts * 1000);
            const activeClass = index === selectedDayIndex ? 'active' : '';

            var newDayEl = dayTemplate;
            list += newDayEl.innerHTML
                .replace(/{{activeClass}}/g, activeClass)
                .replace(/{{date}}/g, date.getDate())
                .replace(/{{month}}/g, monthsList[date.getMonth()])
                .replace(/{{day}}/g, weekDaysList[date.getDay()])
        }.bind(this));

        daysWrapper.innerHTML = list;

        var days = document.getElementsByClassName('single-day');
        for (var i=0; i<days.length; i++) {
            (function(index){
                days[i].addEventListener('click', function(e){
                    var activeDayEl = document.querySelector('.single-day.active');
                    activeDayEl.classList.remove('active');
                    e.currentTarget.classList.add("active");
                    changeActiveDay(index, forecast.data[index]);
                })
            })(i)
        }
    }

})();
