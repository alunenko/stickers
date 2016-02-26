angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);

angular.module('ui.bootstrap.demo').controller('DatepickerDemoCtrl', function ($scope, $http, $location, socketio) {
  $scope.notes = [];
  $scope.monthPostCounter = {};

  $scope.today = function() {
    $scope.dt = new Date();
  }();

  $scope.getNotes = function(date) {
    $http({
      url: '/test',
      method: "GET",
      params: { date: (date).getTime() }
    }).then(function(response) {
      console.info(response, 'get request success');
      console.info(response.data, 'response.data');
      $scope.notes = response.data.notes;
      $scope.monthPostCounter = response.data.totalPostCount;
    }, function() {
      console.log(date, '*Create* GET request failed');
      console.error('*Create* GET request failed');
    });
  };

  $scope.defaultLoad = function (date) {
    $http({
      url: '/',
      method: "GET",
      params: { date: (date).getTime() }
    }).then(function(response) {
      console.log(response.data, 'GET/ request success');
      console.log('GET/ request success');
      $scope.notes = response.notes;
    }, function() {
      console.error('*Create* GET/ request failed');
    });
  }(new Date());

  $scope.$watch("dt", function() {
    console.log($scope.dt, 'watch');
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    $scope.headerFormatdt = monthNames[$scope.dt.getMonth()] + ' ' + $scope.dt.getDate() + ', ' + $scope.dt.getFullYear();
    console.log('call notes from watch');
    $scope.getNotes($scope.dt);
  });

  $scope.getMessages = function() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    $scope.headerFormatdt = monthNames[$scope.dt.getMonth()] + ' ' + $scope.dt.getDate() + ', ' + $scope.dt.getFullYear();

    console.log('call notes from getNotes');
    $scope.getNotes($scope.dt);
  }();

  $scope.createNewMessage = function() {
    var a = {
      date: $scope.data,
      subject: $scope.subject,
      message: $scope.message
    };

    var formSubmit = JSON.stringify(a);

    $http.post('/', formSubmit, '').then(function() {
      console.info(formSubmit, 'post request success');
      $scope.getNotes($scope.dt);
    }, function() {
      console.info(formSubmit, '*Create new post* POST request failed');
      console.error('*Create new post* POST request failed');
    });
  };

  socketio.on('newNote', function (msg) {
    console.log(msg, 'main.js');
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
    $scope.dt = new Date(year, month, day);;
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

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

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
