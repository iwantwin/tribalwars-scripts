// ==UserScript==
// @name            Fix tribalwarse place
// @author          iwantwin93
// @version         1.2
// @description     Author iwantwin93. Fixes the templates on the tribalwars plaza.
// @include http://nl*.tribalwars.nl/game.php?*screen=place*
// ==/UserScript==

(function ( f ) {
    var d = document,
        s = d.createElement( 'script' );
    s.textContent = '$(document).ready(' + f.toString() + ')';
    (d.body || d.head || d.documentElement).appendChild( s );
})( function () {
        var $templateSelector = $( 'div.vis.float_left h4>a[href*="mode=templates"]' ).parent().parent();
        $( '#inputx' ).before( $templateSelector.removeClass( 'float_left' ) );
        void(0);
    }
);