javascript:/**UPDATED BY: iwantwin, twscripts@iwantwin.nl at 20-04-2016. Original author: arni sendtrashtome@gmail.com. MAY NOT BE DISTRIBUTED WITHOUT THIS COMMENT**/
(function () {
  /**
   * This script came from an arni sendtrashtome@gmail.com, and was updated by iwantwin to comply with the 5 actions per second rule
   * that was introduced by tribalwars.
   */
  var init = function () {
    var scriptNaam = 'Jouw script naam';

    function resetChksLabels() {
      $( ".addFlag" ).each( function () {
        var a = $( this );
        a.prop( "checked", false );
        a.attr( "value", "" );
        a.next().html( "..." )
      } )
    }

    window.zetVlaggen = function () {
      $( ".addFlag:checked" ).each( function () {
        var a = $( this );
        var b = a.attr( "value" ).split( ";" );

        window.ISS.ActionManager.performAction( scriptNaam, 'Vlag toevoegen', function ( callback ) {
          window.FlagsOverview.assignFlag( b[0], b[1], b[2] );
          var $target = $( '#flag_info_' + b[2] );
          var checkTimeout = setInterval( function () {
            if ( $target.find( '.flag_present:visible' ).length > 0 && $target.find( '.flag_none:hidden' ).length > 0 ) {
              clearInterval( checkTimeout );
              callback();
            }
          }, 200 );
        }, function () {

        } );
      } );
      resetChksLabels()
    };

    var f = frames.main || self, c = f.document, k = c.getElementById( "overview" ), g = function ( b ) {return f.game_data.link_base_pure.replace( "n=", "n=" + b )};
    var j = c.location.href.match( /tech/g );
    var e = "Zet Vlaggen";
    var h = 0;

    function a() {
      var r = 0;
      var d = 0;
      var l = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ];
      var i = 0;

      function q() {return($( ".flag_tooltip" ).length > 0)}

      function p() {
        $( ".flag_tooltip" ).each( function ( w ) {
          var z = $( this );
          var u = $( this ).attr( "onclick" );
          var v = u.substring( u.indexOf( "(" ) + 1, u.indexOf( ")" ) ).split( "," );
          var y = new Array( v.length );
          for ( var x = 0; x < v.length; x++ ) {
            y[x] = +v[x]
          }
          i = y[2];
          if ( y[0] === +d ) {
            l[y[1] - 1] = +z.text().trim()
          }
        } );
        h = l.reduce( function ( v, u ) {return v + u} );
        $( ".popup_helper" ).remove()
      }

      function n() {
        if ( r >= 10 || q() ) {
          clearTimeout();
          p();
          o()
        } else {
          ++r;
          setTimeout( n, 50 )
        }
      }

      function b() {
        for ( var u = l.length - 1; u >= 0; u-- ) {
          if ( l[u] > 0 ) {
            l[u] = --l[u];
            return u + 1
          }
        }
        return 0
      }

      function s( u ) {$( "#bntZetVlaggen" ).attr( "value", e + " " + u + "/" + h )}

      function o() {
        var u = 0;
        s( u );
        $( ".flag_none:visible" ).each( function () {
          var x = $( this ).parent();
          var z = x.next().find( ".addFlag" );
          var y = x.attr( "id" );
          var v = y.lastIndexOf( "_" ) + 1;
          var A = y.substr( v, 99 );
          var w = b();
          if ( w === 0 ) {
            return false
          } else {
            z.prop( "checked", true );
            z.attr( "value", d + ";" + w + ";" + A );
            z.next().html( "Level: " + w );
            u = u + 1;
            s( u )
          }
        } )
      }

      function t() {
        $( ".addFlag" ).each( function () {
          var u = $( this );
          u.prop( "checked", false );
          u.attr( "value", "" );
          u.next().html( "..." )
        } )
      }

      function m() {
        var v = document.getElementsByClassName( "addFlag" );
        if ( v.length === 0 ) {
          var z = document.getElementById( "techs_table" ).rows;
          var A = z[0].insertCell( -1 );
          var u = document.createElement( "input" );
          u.type = "submit";
          u.id = "bntZetVlaggen";
          u.className = "btn";
          u.setAttribute( "onclick", "zetVlaggen(); return false;" );
          u.value = e;
          A.appendChild( u );
          for ( g = 1; g < z.length; g++ ) {
            var x = document.createElement( "input" );
            x.type = "checkbox";
            x.className = "addFlag";
            x.id = "id" + g;
            var y = document.createElement( "label" );
            y.setAttribute( "for", "id" + g );
            y.innerHTML = "...";
            y.className = "addFlaglbl";
            var w = z[g].insertCell( -1 );
            w.appendChild( x );
            w.appendChild( y )
          }
        } else {
          t()
        }
      }

      d = prompt( "Welke vlag selecteren?\n 1 = Grondstoffen \n 2 = Rekruteren \n 3 = Aanvalsterkte \n 4 = Verdedigingskracht \n 5 = Geluk \n 6 = Inwonersaantal \n 7 = Muntkosten \n 8 = Buit ", 0 );
      if ( 1 <= d && d <= 9 ) {
        $( ".flag_none" ).first().children( 0 ).click();
        m();
        n()
      }
    }

    if ( !k || !j ) {
      if ( confirm( "De vlaggen selectie werkt alleen bij Overzichten => Ontwikkeling.\n\n Wil je nu naar Overzichten => Ontwikkeling?" ) ) {
        location.href = g( "overview_villages&mode=tech" )
      }
    } else {
      a()
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