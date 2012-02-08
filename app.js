var Toggl = require('./toggl');

Toggl.init(process.env.API_KEY);

var entries = new Toggl.TimeEntries();
var tasks = new Toggl.Tasks();

tasks.bind('reset', function () {
  var task = tasks.at(0);

  entries.bind('reset', function () {
    var i = 0;
    entries.each(function (entry) {
      var eTask = entry.get("task") || {id: 'none'};
      if (eTask.id !== task.id) {
        if (entry.get("duration") > 200000) {
          entry.set({ duration: 200000 });
        }
        console.log("update " + entry.get("description") + " from " + eTask.id + " to " + task.id  + ", duration " + entry.get("duration"));
        entry.set("task", {id: task.id});
        entry.bind('sync', function (entry) {
          console.log('synced ' + this.get("description") + ', ' + this.get("task").id);
        });
        entry.save();
      }
    });
  })
  entries.fetch({data: {start_date: '2010-02-08', end_date: '2012-02-12'}});
});

tasks.fetch();