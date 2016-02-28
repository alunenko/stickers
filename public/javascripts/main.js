angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);

angular.module('ui.bootstrap.demo').controller('DatepickerDemoCtrl', function ($scope, $http, $location, socketio, $rootScope) {
  $scope.notes = [];
  $scope.monthPostCounter = {};

  $scope.today = function() {
    $scope.dt = new Date();
  }();

  $rootScope.totalPostCount;

  $scope.getNotes = function(date, mode) {
    $http({
      url: '/test',
      method: "GET",
      params: { date: (date).getTime() }
    }).then(function(response) {
      console.info('GET/test request success');
      $scope.notes = response.data.notes;
      $rootScope.totalPostCount = response.data.totalPostCount;

      $scope.events = [];
      $scope.events = Object.keys($rootScope.totalPostCount).map(function(key) {
        return {
          date: new Date($scope.dt.getFullYear(), $scope.dt.getMonth(), key),
          value: $rootScope.totalPostCount[key],
          status: 'postCounter'
        };
      });
    }, function() {
      console.error('*Create* GET request failed');
    });
  };

  angular.element(document).ready(function () {
    console.info('Page load');
    $scope.getNotes($scope.dt);
  });

  $scope.defaultLoad = function (date) {
    $http({
      url: '/',
      method: "GET",
      params: { date: (date).getTime() }
    }).then(function(response) {
      console.log('GET/ request success');
      $scope.notes = response.notes;
    }, function() {
      console.error('*Create* GET/ request failed');
    });
  }(new Date());

  $scope.events = [];

  $scope.$watch("dt", function() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    $scope.headerFormatdt = monthNames[$scope.dt.getMonth()] + ' ' + $scope.dt.getDate() + ', ' + $scope.dt.getFullYear();
    $scope.getNotes($scope.dt);
  });

  $scope.getMessages = function() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    $scope.headerFormatdt = monthNames[$scope.dt.getMonth()] + ' ' + $scope.dt.getDate() + ', ' + $scope.dt.getFullYear();
  }();

  $scope.createNewMessage = function() {
    var message = {
      date: $scope.data,
      subject: $scope.subject,
      message: $scope.message
    };

    var formSubmit = JSON.stringify(message);

    $http.post('/', formSubmit, '').then(function() {
      console.info('POST/ request success');
      $scope.getNotes($scope.dt);
    }, function() {
      console.error('*Create new post* POST request failed');
    });
  };

  socketio.on('newNote', function (msg) {
    console.info('newNote was created');
  });

  $scope.clear = function() {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  $scope.getDayClass = function(date, mode) {

    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
});

angular.module('ui.bootstrap.demo').factory('socketio', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
