// ==UserScript==
// @namespace       iwantwin//TW//SCRIPTS
// @name            Native Tagger Format Editor
// @author          iwantwin93
// @version         1.0
// @description     Author iwantwin93. Gives option to make sure the tagger works as desired. Currently only supports one format, but will be changed later.
// @include http://nl*.tribalwars.nl/game.php?*screen=overview_villages*mode=incomings*
// @include http://nl*.tribalwars.nl/game.php?*mode=incomings*screen=overview_villages*
// ==/UserScript==

(function ( f ) {
    var d = document,
        s = d.createElement( 'script' );
    s.textContent = '$(document).ready(' + f.toString() + ')';
    (d.body || d.head || d.documentElement).appendChild( s );
})( function () {
        var scriptVersion = 1;
        //Supports: %unit% %distance% %coords% %duration% %return% %sent% %arrival% %player% %origin% %destination%
        var format = '%unit% %player% F%distance%';
        $('input[name=label_format]').val(format );
    }
);