function getTime() {
	$.get('../Clock',{action:'gettime'},function(responseText) {
        $('#time').html(responseText);
    });
}

function upperCase(a){
    setTimeout(function(){
        a.value = a.value.toUpperCase();
    }, 1);
}

// Customize Function :: jUNG-DAi
var headerDateTime = {
    setDateTo : function (id) {
        return $(id).text(moment().format("DD/MM/YYYY"));;
    },
    setTimeTo : function (id) {
        return setInterval(function () { $(id).text(moment().format("HH:mm:ss")); }, 0);
    },
    setDateTimeTo : function (id) {
        return setInterval(function () { $(id).text(moment().format("DD/MM/YYYY  HH:mm:ss")); }, 0);
    }
}

var isUndefinedEmptyOrNull = function (val) {
    if (_.isUndefined(val) || _.isEmpty(val) || _.isNull(val)) { return true; }
    return false;
}

var SERVER = {
    PROTOCAL : function () {
        return "http:"
    },
    HOSTNAME : function () {
        return window.location.hostname
    },
    PORT : function () {
        return window.location.port
    }
}

var _GET = (function () {
    var _get = {};
    var re = /[?&]([^=&]+)(=?)([^&]*)/g;
    while (m = re.exec(location.search))
        _get[decodeURIComponent(m[1])] = (m[2] == '=' ? decodeURIComponent(m[3]) : true);
    return _get;
})();