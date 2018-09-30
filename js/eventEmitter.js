var events = {
    events: {},
    on: function (name, fn) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(fn);
    },
    trigger: function (name, data) {
        if (this.events[name]) {
            this.events[name].forEach(function(fn) {
                fn(data);
            });
        }
    }
};
