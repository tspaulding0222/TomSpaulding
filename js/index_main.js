$(document).ready(function(){
    $("#navbar-container").load("templates/navbar.html", function(){
        setActivePageOnNavbar();
    });
});

function setActivePageOnNavbar(){
    $("#homeNavLink").addClass("active");
    $("#frontEndToolsNavLink").removeClass("active");
    $("#bounceJsNavLink").removeClass("active");
    $("#codeEditorNavLink").removeClass("active");
}