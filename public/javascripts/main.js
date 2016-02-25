angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);

angular.module('ui.bootstrap.demo').controller('DatepickerDemoCtrl', function ($scope, $http, $location) {
  $scope.$watch("dt", function() {
    $location.path = $location + $scope.dt.getTime();
    /*$scope.allFormData = [];
    $scope.submit = function() {
      if ($scope.text) {
        $scope.list.push(this.text);
        $scope.text = '';
      }
    };

    var data = JSON.stringify({
      data: $scope.dt
    });

    var config = '';

    $http.post('/', data, config).then(function() {
      console.log('post request success');
    }, function() {
      console.log('post request failed');
    });*/
  });

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.getMessages = function() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    $scope.headerFormatdt = monthNames[$scope.dt.getMonth()] + ' ' + $scope.dt.getDate() + ', ' + $scope.dt.getFullYear();

    console.log($scope.dt.getTime(), 'here');

    $http({
      url: '/test',
      method: "GET",
      params: { date: (new Date()).getTime() }
    }).then(function(docs) {
      console.log($scope.dt);
      console.log('get request success');
    }, function() {
      console.log($scope.dt);
      console.error('*Create* GET request failed');
    });
  }();

  $scope.createNewMessage = function() {
    var a = {
      date: $scope.data,
      subject: $scope.subject,
      message: $scope.message
    };

    var formSubmit = JSON.stringify(a);

    $http.post('/', formSubmit, '').then(function() {
      console.log(formSubmit);
      console.log('post request success');
    }, function() {
      console.log(formSubmit);
      console.error('*Create new post* POST request failed');
    });
  };

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