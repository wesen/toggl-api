/**
 * Interface to the toggl.com API
 *
 * @class Toggl
 * @param apikey The toggl apikey
 */

var rest = require('restler'),
Backbone = require('backbone'),
_ = require('underscore'),
querystring = require("querystring");

var TOGGL_API_VERSION = exports.TOGGL_API_VERSION = 'v6';

function mixin(target, source) {
  Object.keys(source).forEach(function(key) {
    target[key] = source[key];
  });

  return target;
}

var TogglModel = Backbone.Model.extend(
{
  type: 'none',
  types: 'nones',

  url: function () {
    return '/api/' + TOGGL_API_VERSION + '/' + this.types + '/' + this.id + '.json';
  },

  toJSON: function () {
    var data = Backbone.Model.prototype.toJSON.apply(this);
    var result = {};
    result[this.type] = data;
    return result;
  },

  parse: function (response) {
    if (response[this.type]) {
      return response[this.type];
    } else {
      return response;
    }
  }
});

function togglModel(type, types) {
  return TogglModel.extend(
  {type: type,
    types: types || (type + 's')
  });
}

var TogglCollection = Backbone.Collection.extend(
{
  url: function () {
    return '/api/' + TOGGL_API_VERSION + '/' + this.model.prototype.types + '.json';
  }
});

function togglCollection(model) {
  return TogglCollection.extend(
  {
    model: model
  });
}

var Client = exports.Client = togglModel('client');
var Clients = exports.Clients = togglCollection(Client);
var Project = exports.Project = togglModel('project');
var Projects = exports.Projects = togglCollection(Project);
var ProjectUser = exports.ProjectUser = togglModel('project_user');
var ProjectUserss = exports.ProjectUsers = togglCollection(ProjectUser);
var Task = exports.Task = togglModel('task');
var Tasks = exports.Tasks = togglCollection(Task);
var Tag = exports.Tag = togglModel('tag');
var Tags = exports.Tags = togglCollection(Tag);
var User = exports.User = togglModel('user');
var Users = exports.Users = togglCollection(User);
var Workspace = exports.Workspace = togglModel('workspace');
var Workspaces = exports.Workspaces = togglCollection(Workspace);
var TimeEntry = exports.TimeEntry = togglModel('time_entry', 'time_entries');
var TimeEntries = exports.TimeEntries = togglCollection(TimeEntry);

var Toggl = rest.service(
function (api_key) {
  this.api_key = api_key;
  this.defaults = {
    username: api_key,
    password: "api_token"
  };
}, {
  baseURL: 'https://www.toggl.com'
},
  {});
exports.Toggl = Toggl;

var toggl;

var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'delete': 'DELETE',
  'read':   'GET'
};

Backbone.sync = function (method, model, options) {
  var type = methodMap[method];
  var _options = options || {};
  _options.data = _options.data || {};

  // Ensure that we have the appropriate request data.
  if (model && (method == 'create' || method == 'update')) {
    _options = mixin(_options, {
      data: JSON.stringify(model.toJSON()),
      headers: { 'Content-type': 'application/json' }
    });
  }

  var url = model.url();

  if (type === 'POST') {
    return toggl.post(url, _options).on('complete', _options.success).on('error', _options.error);
  } else if (type === 'PUT') {
      return toggl.put(url, _options)
      .on('complete',
          function (data) {
            if (!data.data) {
              _options.error(data);
            } else {
              _options.success(data.data);
            }
          })
      .on('error',
          function (error) {
            _options.error(error);
          });
  } else if (type === 'DELETE') {
        return toggl.delete(url, _options).on('complete', _options.success).on('error', _options.error);
  } else if (type === 'GET') {
    return toggl.get(url + '?' + querystring.stringify(_options.data), _options)
    .on('complete',
        function (data) {
          _options.success(data.data);
        })
    .on('error',
        function (foobar) {
          console.dir(foobar);
          _options.error(foobar);
        });
  }
};

exports.init = function (api_key) {
  toggl = new Toggl(api_key);
}

