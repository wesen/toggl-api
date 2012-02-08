# toggl.com javascript API

## Usage

Creates backbone models for the toggl.com api objects.

```javascript
var toggl = require('./toggl');

var entries = new toggl.TimeEntries();
entries.on('reset', function () {
  console.log(this.toJSON());
  var entry = entries.at(0);
  console.log(entry.get("description") + " " + entry.get("start_date"));
  entry.set("duration", entry.get("duration") + 10);
  entry.save();
});
entries.fetch();
```

## Classes

Refer to https://www.toggl.com/public/api for required parameters and more information.

* Client
* Clients
* Project
* Projects
* ProjectUser
* ProjectUserss
* Task
* Tasks
* Tag
* Tags
* User
* Users
* Workspace
* Workspaces
* TimeEntry
* TimeEntries
