// ==UserScript==
// @name            Hide incommings
// @namespace       Hide_incommings
// @author          Hardcode
// @description     Geeft de optie om incommings te verstoppen bij het dorpsoverzicht pagina
// @include         http://*.tribalwars.nl/game.php?*&screen=info_village
// @version         1.0
// ==/UserScript==

function hide_incommings() {
    var show = true;
    var $head = $( ".vis:contains('Aankomend')" );
    var $text = $( "th:contains('Aankomst:')" ).attr( "id", "text" );

    $head.on( "click", function () {
        var $noIgnoredCommand = $( ".no_ignored_command" );
        if ( show === true ) {
            $noIgnoredCommand.hide();
            $text.html( "Hidden" );
            show = false;
        } else {
            $noIgnoredCommand.show();
            $text.html( "Aankomend:" );
            show = true;
        }
    } );
}

function injectScript( func ) {
    var script = document.createElement( 'script' );
    script.setAttribute( "type", "application/javascript" );
    script.textContent = '(' + func + ');';
    document.body.appendChild( script );
    document.body.removeChild( script );
}

injectScript( hide_incommings() ); //voer alles uit