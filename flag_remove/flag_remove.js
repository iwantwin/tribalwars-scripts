javascript:/**UPDATED BY: iwantwin, twscripts@iwantwin.nl at 20-04-2016. Original author unknown. MAY NOT BE DISTRIBUTED WITHOUT THIS COMMENT**/
(function () {
  /**
   * This script came from an unknown source, and was updated by iwantwin to comply with the 5 actions per second rule
   * that was introduced by tribalwars.
   *
   * If the author of this original script would want his credits here, he should send an email to twscripts@iwantwin.nl
   */
  var init = function () {
    var scriptNaam = 'Vlaggen verwijderen';

    var x = document.getElementsByClassName( "flag_present" );
    var v = frames.main || self, b = v.document, d = b.getElementById( "overview" ), i = function ( f ) {return v.game_data.link_base_pure.replace( "n=", "n=" + f )};
    var xm = b.location.href.match( /tech/g );
    if ( !d || !xm ) {
      if ( confirm( "De vlaggen selectie werkt alleen bij Overzichten => Ontwikkeling.\n\n Wil je nu naar Overzichten => Ontwikkeling?" ) ) {
        location.href = i( "overview_villages&mode=tech" );
      }
    } else {
      var flg_type = prompt( "Welke vlagtype verwijderen?\n * = Alle \n 1 = Grondstoffen \n 2 = Rekruteren \n 3 = Aanvalsterkte \n 4 = Verdedigingskracht \n 5 = Geluk \n 6 = Inwonersaantal \n 7 = Muntkosten \n 8 = Buit ", "*" );
      var flg_type_text = "";
      if ( flg_type !== null ) {
        switch ( flg_type ) {
          case"1":
            flg_type_text = "GRONDSTOFFEN";
            break;
          case"2":
            flg_type_text = "REKRUTERING";
            break;
          case"3":
            flg_type_text = "AANVAL";
            break;
          case"4":
            flg_type_text = "VERDEDIGING";
            break;
          case"5":
            flg_type_text = "GELUK";
            break;
          case"6":
            flg_type_text = "BEVOLKING";
            break;
          case"7":
            flg_type_text = "MUNT";
            break;
          case"8":
            flg_type_text = "BUIT";
            break;
          case"*":
            flg_type_text = "";
            break;
        }
        for ( var i = 0; i < x.length; i++ ) {
          var trgt = x.item( i );
          if ( trgt.firstElementChild.innerHTML.toUpperCase().indexOf( flg_type_text ) > -1 ) {
            (function ( pTarget ) {
              window.ISS.ActionManager.performAction( scriptNaam, 'Vlag verwijderen', function ( callback ) {
                pTarget.lastElementChild.click();
                var $target = $( pTarget.parentNode );
                var amountOfChecks = 0;
                var maxTimeToWaitUntilFailAssumed = 5000;
                var checkTimeoutDelay = 50;
                var checkTimeout = setInterval( function () {
                  if ( $target.find( '.flag_present:hidden' ).length > 0 && $target.find( '.flag_none:visible' ).length > 0 ) {
                    clearInterval( checkTimeout );
                    callback();
                  } else {
                    if ( (amountOfChecks * checkTimeoutDelay) >= maxTimeToWaitUntilFailAssumed ) {
                      //We assume a fail after maxTimeToWaitUntilFailAssumed milliseconds to ensure that population limit was no problem.
                      clearInterval( checkTimeout );
                      callback();
                    }
                    amountOfChecks++;
                  }
                }, checkTimeoutDelay );
              }, function () {

              } );
            })( trgt )
          }
        }
      }
    }
  };

  if ( !window.hasOwnProperty( 'ISS' ) ) {
    //Include ISS script, mainly for the ActionManager.
    (function () {
      var b = "undefined" != typeof window.main ? window.main.document : document, a = b.createElement( "script" );
      a.type = "text/javascript"; 
      a.src = "https://cdn.jsdelivr.net/gh/iwantwin/tribalwars-scripts/iwantwin_script_services/iwantwin_scripts_services.js?ts=" + (new Date).getTime() + Math.round( 1E3 * Math.random() );
      b.getElementsByTagName( "head" )[0].appendChild( a );
      void 0
    })();
    $( document ).on( 'ISSLoaded', function () {
      init();
    } );
  } else {
    init();
  }

  //Ouput void(0); ensures opera's allowance for userscripts, if we do not output void, it will output the latest
  // assigned variable, and since this is a function that auto-executes, which therefore creates a private scope,
  // there is nothing to output. With void(0) we force opera 8.12 (Legacy browser used by many Tribalwars players) to have a void
  // output, therefore preventing crashes.
  void(0);
})();