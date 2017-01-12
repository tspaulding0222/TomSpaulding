$(document).ready(function(){
    $("#navbar-container").load("../../templates/navbar.html", function(){
        setActivePageOnNavbar();
    });
});

function setActivePageOnNavbar(){
    $("#homeNavLink").removeClass("active");
    $("#frontEndToolsNavLink").addClass("active");
    $("#bounceJsNavLink").removeClass("active");
    $("#codeEditorNavLink").removeClass("active");
}