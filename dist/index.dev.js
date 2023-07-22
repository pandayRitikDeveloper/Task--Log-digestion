"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fs = require('fs');

var moment = require('moment');

var Table = require('cli-table3'); // Function to count how many times each endpoint is called


function countEndpointCalls(logData) {
  var endpointCounts = {};
  logData.forEach(function (logEntry) {
    var endpoint = logEntry.split(' ')[1];
    endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1;
  });
  return endpointCounts;
} // Function to count API calls per minute


function countApiCallsPerMinute(logData) {
  var apiCallsPerMinute = {};
  logData.forEach(function (logEntry) {
    var timestamp = logEntry.split(' ')[0].slice(1, -1); // Remove square brackets from timestamp

    var minute = moment(timestamp).format('YYYY-MM-DD HH:mm');
    apiCallsPerMinute[minute] = (apiCallsPerMinute[minute] || 0) + 1;
  });
  return apiCallsPerMinute;
} // Function to count total API calls for each HTTP status code


function countApiCallsByStatusCode(logData) {
  var apiCallsByStatusCode = {};
  logData.forEach(function (logEntry) {
    var statusCode = logEntry.split(' ')[2];
    apiCallsByStatusCode[statusCode] = (apiCallsByStatusCode[statusCode] || 0) + 1;
  });
  return apiCallsByStatusCode;
} // Read the log file and parse its content


function readLogFile(filePath) {
  return new Promise(function (resolve, reject) {
    var logData = [];
    fs.createReadStream(filePath).on('data', function (data) {
      var lines = data.toString().split('\n');
      lines.forEach(function (line) {
        if (line.trim() !== '') {
          logData.push(line.trim());
        }
      });
    }).on('end', function () {
      return resolve(logData);
    }).on('error', function (error) {
      return reject(error);
    });
  });
} // Function to analyze a log file and display the results


function analyzeLogFile(logFilePath) {
  var logData, endpointCounts, apiCallsPerMinute, apiCallsByStatusCode, endpointTable, minuteTable, statusCodeTable;
  return regeneratorRuntime.async(function analyzeLogFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(readLogFile(logFilePath));

        case 3:
          logData = _context.sent;
          // Task 1: Count how many times each endpoint is called
          endpointCounts = countEndpointCalls(logData); // Task 2: Count API calls per minute

          apiCallsPerMinute = countApiCallsPerMinute(logData); // Task 3: Count total API calls for each HTTP status code

          apiCallsByStatusCode = countApiCallsByStatusCode(logData); // Display data in formatted tables

          endpointTable = new Table({
            head: ['Endpoint', 'Count'],
            colWidths: [25, 10]
          });
          Object.entries(endpointCounts).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                endpoint = _ref2[0],
                count = _ref2[1];

            endpointTable.push([endpoint, count]);
          });
          minuteTable = new Table({
            head: ['Minute', 'API Calls'],
            colWidths: [20, 12]
          });
          Object.entries(apiCallsPerMinute).forEach(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                minute = _ref4[0],
                count = _ref4[1];

            minuteTable.push([minute, count]);
          });
          statusCodeTable = new Table({
            head: ['Status Code', 'Count'],
            colWidths: [25, 10]
          });
          Object.entries(apiCallsByStatusCode).forEach(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
                statusCode = _ref6[0],
                count = _ref6[1];

            statusCodeTable.push([statusCode, count]);
          });
          console.log("\nEndpoint Counts for ".concat(logFilePath, ":\n"));
          console.log(endpointTable.toString());
          console.log("\nAPI Calls Per Minute for ".concat(logFilePath, ":\n"));
          console.log(minuteTable.toString());
          console.log("\nAPI Calls By Status Code for ".concat(logFilePath, ":\n"));
          console.log(statusCodeTable.toString());
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error("Error processing ".concat(logFilePath, ":"), _context.t0.message);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
} // Main function to run the CLI application for all log files


function main() {
  var logFiles, _i2, _logFiles, logFile;

  return regeneratorRuntime.async(function main$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          logFiles = ['api-dev-out.log', 'api-prod-out.log', 'prod-api-prod-out.log'];
          _i2 = 0, _logFiles = logFiles;

        case 2:
          if (!(_i2 < _logFiles.length)) {
            _context2.next = 9;
            break;
          }

          logFile = _logFiles[_i2];
          _context2.next = 6;
          return regeneratorRuntime.awrap(analyzeLogFile(logFile));

        case 6:
          _i2++;
          _context2.next = 2;
          break;

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}

main();