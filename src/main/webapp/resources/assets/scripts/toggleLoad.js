var sidebarVisible = localStorage.getItem('wrapper');
var sidebarVisible2 = localStorage.getItem('wrapper-top');
var checkIMenu = $("#i-menu").html();
var checkToggleTop = $("#i-toggle-top").html();

$(document).ready(function () {

    toggleClick();

    toggleLoad();

    toggleClick2();

    toggleLoad2();

    new headerDateTime.setDateTimeTo("#time");

    if ("${CHECK}" == "1") {
        $('#sCHECK').prop('checked', true);
    }

});

function toggleLoad() {
	if (sidebarVisible != null && sidebarVisible == 1) {
        $("#wrapper").css({"-webkit-transition":"all 0.0s ease"},{"-moz-transition":"all 0.0s ease"},{"-o-transition":"all 0.0s ease"},{"transition":"all 0.0s ease"});
        $("#sidebar-wrapper").css({"-webkit-transition":"all 0.0s ease"},{"-moz-transition":"all 0.0s ease"},{"-o-transition":"all 0.0s ease"},{"transition":"all 0.0s ease"});
        $("#wrapper").toggleClass("toggled");
	    $("#i-menu").html("<i class=\"fa fa-chevron-circle-right\"> </i>");
    } 
        
    else {
        $("#i-menu").html("<i class=\"fa fa-chevron-circle-left\"> </i>");
    }
}

function toggleClick() {
	$("#menu-toggle").click(function(e) {

        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
            
        if ($("#i-menu").html() == "<i class=\"fa fa-chevron-circle-right\"> </i>") {
            $("#wrapper").css({"-webkit-transition":"all 0.5s ease"},{"-moz-transition":"all 0.5s ease"},{"-o-transition":"all 0.5s ease"},{"transition":"all 0.5s ease"});
            $("#sidebar-wrapper").css({"-webkit-transition":"all 0.5s ease"},{"-moz-transition":"all 0.5s ease"},{"-o-transition":"all 0.5s ease"},{"transition":"all 0.5s ease"});
            $("#i-menu").html("<i class=\"fa fa-chevron-circle-left\"> </i>");
            localStorage.setItem('wrapper', 0);
        }
            
        else {
            $("#i-menu").html("<i class=\"fa fa-chevron-circle-right\"> </i>");
            localStorage.setItem('wrapper', 1);
        }
        
    });
}

function toggleLoad2() {
    if (sidebarVisible2 != null && sidebarVisible2 == 1) {
        $("#wrapper-top").css({ "-webkit-transition": "all 0.0s ease" }, { "-moz-transition": "all 0.0s ease" }, { "-o-transition": "all 0.0s ease" }, { "transition": "all 0.0s ease" });
        $("#sidebar-wrapper-top").css({ "-webkit-transition": "all 0.0s ease" }, { "-moz-transition": "all 0.0s ease" }, { "-o-transition": "all 0.0s ease" }, { "transition": "all 0.0s ease" });
        $("#wrapper-top").toggleClass("toggled");
        $("#i-toggle-top").html("<b class=\"custom-text\">Show search</b>");
        // $("#set-height").css({"margin-top":"50px"});
    }

    else {
        $("#i-toggle-top").html("<b class=\"custom-text\">Hide search</b>");
    }
}

function toggleClick2() {
    $("#menu-toggle2").click(function (e) {

        e.preventDefault();
        $("#wrapper-top").toggleClass("toggled");

        if ($("#i-toggle-top").html() == "<b class=\"custom-text\">Show search</b>") {
            $("#wrapper-top").css({ "-webkit-transition": "all 0.5s ease" }, { "-moz-transition": "all 0.5s ease" }, { "-o-transition": "all 0.5s ease" }, { "transition": "all 0.5s ease" });
            $("#sidebar-wrapper-top").css({ "-webkit-transition": "all 0.5s ease" }, { "-moz-transition": "all 0.5s ease" }, { "-o-transition": "all 0.5s ease" }, { "transition": "all 0.5s ease" });
            $("#i-toggle-top").html("<b class=\"custom-text\">Hide search</b>");
            // $("#toggle-top").css({"margin-top":"0px"});
            localStorage.setItem('wrapper-top', 0);
        }

        else {
            $("#i-toggle-top").html("<b class=\"custom-text\">Show search</b>");
            // $("#toggle-top").css({"margin-top":"50px"});
            localStorage.setItem('wrapper-top', 1);
        }

    });
}