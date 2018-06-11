app.directive('uppercaseText', function ()
{
    return {
        require : 'ngModel',
        link : function ($scope, element, attrs, ngModelCtrl)
        {
            var setDataToUppercase = function (inputValue)
            {
                if (isUndefinedEmptyOrNull(inputValue))
                    inputValue = '';
                var uppercaseSet = inputValue.toUpperCase();
                if (uppercaseSet !== inputValue)
                {
                    ngModelCtrl.$setViewValue(uppercaseSet);
                    ngModelCtrl.$render();
                }
                return uppercaseSet;
            }
            ngModelCtrl.$parsers.push(setDataToUppercase);
            setDataToUppercase($scope[attrs.ngModel]); // setDataToUppercase() initial value
        }
    };
}
); // end uppercaseText directive

/**
 * Directive :: dateTimePicker
 * Ref. Doc. :: https://yaplex.com/blog/bootstrap-datetimepicker-with-angularjs
 */
app.directive('dateTimePicker', function ()
{
    // Runs during compile
    return {
        restrict : "A",
        require : "ngModel",
        link : function (scope, element, attrs, ngModelCtrl)
        {
            var parent = $(element).parent();
            var dtp = parent.datetimepicker(
                {
                    // format: "LL", // Old Ver. from ref. doc.
                    format : "DD/MM/YYYY",
                    // showTodayButton: true
                }
                );
            dtp.on("dp.change", function (e)
            {
                if (e.date != undefined && e.date != null)
                {
                    // ngModelCtrl.$setViewValue(moment(e.date).format("DD-MM-YYYY"));
                    ngModelCtrl.$setViewValue(moment(e.date).format("YYYYMMDD"));
                    scope.$apply();
                }
            }
            );
        }
    };
}
);

app.directive('dateFormat', function(){
    // Runs during compile
    return {
        require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: function($scope, iElm, iAttrs, controller) {
            controller.$setViewValue(moment($scope[iAttrs.ngModel]).format("YYYY/MM/DD"));
            controller.$render();
        }
    };
});

app.directive('textDateInput', function(){
  return {
    require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    link: function(scope, element, attributes, ngModel) {
      var dateTestRegex = /\d{1,2}\/\d{1,2}\/\d{2,4}/;
      var dateTestRegexDigit8 = /\d{8}/;

      ngModel.$parsers.push(parser);
      ngModel.$formatters.push(formatter);

      function parser(value) {
        var modelValue;
        // console.log(value, dateTestRegex.test(value), dateTestRegexDigit8.test(value));
        // Date.parse("MMDDYYYY")
        if (dateTestRegex.test(value)) {
          var v = value.split("/")[2] + "" + value.split("/")[1] + "" + value.split("/")[0];
          var d = value.split("/")[1] + "/" + value.split("/")[0] + "/" + value.split("/")[2]
          if (!isNaN(Date.parse(d))) {
            // Input value passes basic date format tests. Parse and store Date.
            modelValue = moment(v).format("YYYYMMDD");
            // Consider input valid.
            ngModel.$setValidity('textDate', true);
          } else {
            // Clear the model value.
            modelValue = null;
            // Mark input as invalid.
            ngModel.$setValidity('textDate', false);
          }
        } else if (dateTestRegexDigit8.test(value)) {
          // SET MM/DD/YYYY
          var d1 = value.substring(4,6) + "/" + value.substring(6,8) + "/" + value.substring(0,4);
          var d2 = value.substring(2,4) + "/" + value.substring(0,2) + "/" + value.substring(4,8);
          if (!isNaN(Date.parse(d1))) {
            modelValue = moment(d1, 'MM/DD/YYYY');
            ngModel.$setValidity('textDate', true);
          } else if ( !isNaN(Date.parse(d2)) ) {
            modelValue = moment(d2, 'MM/DD/YYYY');
            ngModel.$setValidity('textDate', true);
          } else  {
            modelValue = null;
            ngModel.$setValidity('textDate', false);
          }
        } else {
          modelValue = null;
          ngModel.$setValidity('textDate', false);
        }
        // Return value to store in model.
        return modelValue;
      }

      function formatter(value) {
        var formatted = '';
        // Check to see if model value is a date.
        if (moment(value).isValid()) {
          // Model value is a date, convert to string in
          // DD/MM/YYYY format.
          formatted = moment(value).format("DD/MM/YYYY");
        }
        return formatted;
      }
    }
  };
});


/***
* http://plnkr.co/edit/IqmLW9
***/
app.directive("maxNumbers", ["MaxNumbersService", function(MaxNumbersService){
  return {
      require : "ngModel",
      link : function(scope, element, attrs, modelCtrl){


          //parseInt removes spaces or ennucessary chars. To allow any falsy number
          var maxLength = parseInt(attrs.maxNumbers);
          var allowedIntegerLength = maxLength;
          var allowedDecimalLength = 0;

          if("decimals" in attrs){
              allowedDecimalLength = parseInt(attrs.decimals);
              allowedIntegerLength = maxLength - allowedDecimalLength;
          }

          if("min" in attrs){
              var minimumValue = parseFloat(attrs.min);
              modelCtrl.$validators.min = min;
          }

          if("max" in attrs){
              var maximumValue = parseFloat(attrs.max);
              modelCtrl.$validators.max = max;
          }




          modelCtrl.$parsers.unshift(function(val){
              var maxInteger = new MaxNumbersService(val, allowedIntegerLength, allowedDecimalLength);

              if(maxInteger.isNotANumber()){
                  maxInteger.handleIsNaN();
              }

              if(maxInteger.hasDecimals()){
                  if(allowedDecimalLength){
                      if(maxInteger.hasTooMuchDecimals()){
                          maxInteger.throwDecimals();
                      }
                  } else{
                      maxInteger.throwDecimals();
                  }
              }

              if(maxInteger.hasTooMuchIntegers()){
                  maxInteger.throwIntegers();
              }

              if(maxInteger.didItChanged()){
                  modelCtrl.$setViewValue(maxInteger.val);
              }

              modelCtrl.$render();
              return maxInteger.val;
          });

          modelCtrl.$parsers.unshift(function(view){
              return String(view);
          });

          modelCtrl.$parsers.push(function(view){
              if(!view) return view;
              return Number(view);
          });

          if(!("simpleLink") in attrs){
              modelCtrl.$formatters.unshift(function(val){
                  if(!val) return val;
                  return String(val);
              });

              modelCtrl.$formatters.push(function(val){
                  //On load, this pipeline is always called because view needs to has model
                  if(!val) return val;

                  var maxInteger = new MaxNumbersService(val, allowedIntegerLength, allowedDecimalLength);

                  if(maxInteger.isNotANumber()){
                      maxInteger.handleIsNaN();
                  }

                  if(maxInteger.hasDecimals()){
                      if(allowedDecimalLength){
                          if(maxInteger.hasTooMuchDecimals()){
                              maxInteger.throwDecimals();
                          }
                      } else{
                          maxInteger.throwDecimals();
                      }
                  }

                  if(maxInteger.hasTooMuchIntegers()){
                      maxInteger.throwIntegers();
                  }

                  if(maxInteger.didItChanged()){
                      modelCtrl.$setViewValue(val);
                  }
                  return maxInteger.val;
              });
          }

          function min(model){
              return model ? model >= minimumValue : true;
          }

          function max(model){
              return model ? model <= maximumValue  : true;
          }

      }
  };
}]);