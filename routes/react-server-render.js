'use strict';

var Iso = require('iso');
var React = require('react');
var Router = require('react-router');

var alt = require('../alt');
var clientRoutes = require('../client/routes.jsx');

module.exports = function (app) {

  /**
   * Handler that intercepts all routes defined in `clientRoutes` and server-renders
   * the corresponding component with the db's `msData` as props
   */

  app.use(function (req, res) {
    var iso = new Iso();
    var data = res.locals.msData || {};
    alt.bootstrap(JSON.stringify(data));

    Router.run(clientRoutes, req.url, function (Handler) {
      var content = React.renderToString(
        React.createElement(Handler, data)
      );
      iso.add(content, alt.flush());

      res.render('main', {
        html: iso.render()
      });
    });
  });

};
