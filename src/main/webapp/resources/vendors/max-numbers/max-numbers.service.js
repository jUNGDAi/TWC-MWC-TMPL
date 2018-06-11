(function(){
  


angular.module("plunker")

.factory("MaxNumbersService", [function(){

  /**
   * Contructor
   */
  function MaxInteger(val, allowedIntegerLength, allowedDecimalLength){
      this.val = val;
      this.pointIndex = val.indexOf(".");
      this.integersLength = (this.pointIndex !== -1) ? (val.substring(0, this.pointIndex)).length : val.length;
      //TODO what if finishes by a point
      this.decimalsLength = (this.pointIndex !== -1) ? (val.substring(this.pointIndex + 1)).length : 0;

      this.allowedIntegerLength = allowedIntegerLength;
      this.allowedDecimalLength = allowedDecimalLength;

      this.hasChanged = false;
  }

  MaxInteger.prototype.isNotANumber = function(){
      return isNaN(Number(this.val));
  };

  MaxInteger.prototype.handleIsNaN = function(){
      while(true){
          if(isNaN(Number(this.val))){
              this.val = this.val.substr(0, this.val.length - 1);
          } else{
              break;
          }
      }
      this.hasChanged = true;
  };

  MaxInteger.prototype.throwDecimals = function(){
      var incrementer = (this.allowedDecimalLength) ? this.allowedDecimalLength + 1 : 0;
      this.val = this.val.substring(0, this.pointIndex + incrementer);
      this.hasChanged = true;
  };

  MaxInteger.prototype.hasDecimals = function(){
      return this.val.indexOf(".") !== -1;
  };

  MaxInteger.prototype.hasTooMuchDecimals = function(){
      return this.decimalsLength > this.allowedDecimalLength;
  };

  MaxInteger.prototype.hasTooMuchIntegers = function(){
      return this.integersLength > this.allowedIntegerLength;
  };

  MaxInteger.prototype.throwIntegers = function(){
      var integersLength = this.allowedIntegerLength;
      if(this.pointIndex !== -1){
          integersLength = (this.pointIndex <= this.allowedIntegerLength) ? this.pointIndex : this.allowedIntegerLength;
          this.val = this.val.substr(0, integersLength);
      } else{
          this.val = this.val.substr(0, integersLength);
      }

      this.hasChanged = true;
  };

  MaxInteger.prototype.didItChanged  = function(){
      return this.hasChanged;
  };

  return MaxInteger;


}]);

})();