// ==UserScript==
// @namespace       iwantwin//TW//SCRIPTS
// @name            Apply CSS Files
// @author          iwantwin93
// @version         1.0
// @description     Author iwantwin93
// @include http://nl*.tribalwars.nl/game.php*
// @include https://nl*.tribalwars.nl/game.php*
// ==/UserScript==

(function ( f ) {
    var d = document,
        s = d.createElement( 'script' );
    s.textContent = '$(document).ready(' + f.toString() + ')';
    (d.body || d.head || d.documentElement).appendChild( s );
})( function () {
        var scriptVersion = 1;
        var d = document;
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", 'https://raw.githubusercontent.com/iwantwin/tribalwars-scripts/master/hide_unnecessary/hide_unnecessary.css');
        (d.body || d.head || d.documentElement).appendChild( fileref );
    }
);