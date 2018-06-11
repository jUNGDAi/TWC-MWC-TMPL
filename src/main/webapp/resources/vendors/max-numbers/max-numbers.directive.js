(function(){
  
angular.module("plunker")


.directive("maxNumbers", ["MaxNumbersService", function(MaxNumbersService){
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

})();