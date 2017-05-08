'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api_router = require('../api_router');

var _api_router2 = _interopRequireDefault(_api_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use('/', _api_router2.default);

app.listen(4000, function () {
	console.log('Server listening at http://localhost:4000');
});