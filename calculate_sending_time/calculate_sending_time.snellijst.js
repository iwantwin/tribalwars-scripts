javascript:/**CREATED BY: iwantwin93, iwantwin93@gmail.com at 25-05-2014 MAY NOT BE DISTRIBUTED WITHOUT THIS COMMENT**/
(function () {
  if ( $( ".iwan_scripts_popup" ).length == 0 ) {
    /**
     * This method creates a popup and returns the popupId
     */
    function openPopup( name, popupWidth, popupHtml ) {
      var popupId = "iwan_scripts_" + name + "_popup";
      var popup = document.createElement( "div" );
      popup.id = popupId;
      var totalWidth = $( document ).width();
      var leftWidth = ((totalWidth - popupWidth) / 2);
      if ( leftWidth < 0 ) {
        leftWidth = 0
      }
      popup.style.cssText = "background-color:#ecd6ad;border:2px solid #7d510f;top:130px;left:" + leftWidth + "px;position:absolute;padding:7px;width:" + popupWidth + "px;z-index:19;";
      var $body = $( "body" );
      popup.innerHTML = popupHtml;
      popup.className = "iwan_scripts_popup";
      $body.append( popup );
      var $popup = $( "#" + popupId );
      var popupHeight = $popup.height();
      var pageHeight = $body.height();
      if ( popupHeight >= (pageHeight - 75) ) {
        $body.height( popupHeight + 75 );
      }
      return popupId;
    }

    var popupHtml = '<div style="float:right;padding-right:9px;"><a id="iwan_scripts_popup_close" href="#" style="cursor:pointer;">close</a></div> <div><h2 style="text-align: center;">Calculate Sending time</h2></div> <div> <table> <tr> <th>Village</th> <th>Target</th> <th>Unit</th> <th>Arrival</th> <th></th> <th>Sending time</th> </tr> <tr> <td><input type="text" placeholder="xxx|yyy" id="source"></td> <td><input type="text" placeholder="xxx|yyy" id="target"></td> <td> <select id="unit" required="required"> <option value="" disabled selected>Select your unit</option> </select> </td> <td><input type="datetime-local" id="arrival"></td> <td><input type="submit" value="Calculate!" id="calculateSubmit"></td> <td><input type="datetime-local" id="sendtime"></td> </tr> </table> </div> <div style="clear:both;font-style:italic;width:100%;"><br/> <div style="float:left;width:50%;"><strong>Version:</strong> 1.0 <br/> <strong>Date:</strong> 25-05-2014<br/> </div> <div style="float:left;width:50%;"><strong>Created by:</strong> iwantwin93 <br/> <strong>Email: </strong> <a href="mailto:iwantwin93@gmail.com">iwantwin93@gmail.com</a><br/></div> <div style="clear:both;"></div> </div>';
    var popupId = openPopup( "CoordinatesFilter", 1080, popupHtml );
    var $popup = $( "#" + popupId );

    var unitInfo = {
    };
    var $unit = $( '#unit' );
    (function () {
      var URL_UnitInfo = "https://" + game_data.world + ".tribalwars.nl/interface.php?func=get_unit_info";
      $.ajax( {url : URL_UnitInfo, success : function ( data ) {
        var $unit_config = $( data ).find( 'config' );
        var optionHtml = $unit.html();
        $unit_config.children().each( function () {
          var $this = $( this );
          var nodeName = this.nodeName;
          optionHtml += '<option value="' + nodeName + '">' + nodeName + '</option>';
          unitInfo[nodeName] = {
            speed : (parseFloat( $this.find( "speed" ).html() ) * 60 * 1000) //Milliseconds per tile
          };
        } );
        $unit.html( optionHtml );
      }} );
      var currentDate = new Date();
      var dateWithManagedTimezone = new Date( currentDate.getTime() + ((-1 * currentDate.getTimezoneOffset()) * 60 * 1000) );
      var shortISOString = dateWithManagedTimezone.toISOString().substr( 0, 23 );
      $( "#arrival" ).val( shortISOString );
    })();

    var Coord = function ( coordString ) {
      var self = this;
      self.x = 0;
      self.y = 0;

      self.getString = function () {
        return self.x + '|' + self.y;
      };

      function constructor() {
        var splitCoords = coordString.split( "|" );
        self.x = splitCoords[0];
        self.y = splitCoords[1];
      }

      constructor();
    };

    $popup.find( "#calculateSubmit" ).on( "click", function () {
      var source = $( "#source" ).val();
      var target = $( "#target" ).val();
      var unit = $( "#unit" ).val();
      var arrival = $( "#arrival" ).val();
      var arrivalDateTemp = new Date( arrival );

      var arrivalDate = new Date( arrivalDateTemp.getTime() - ((-1 * arrivalDateTemp.getTimezoneOffset()) * 60 * 1000) );
      var sourceCoord = new Coord( source );
      var targetCoord = new Coord( target );

      var distance = Math.sqrt( Math.pow( (sourceCoord.x - targetCoord.x), 2 ) + Math.pow( (sourceCoord.y - targetCoord.y), 2 ) );
      var millisecondePerTile = unitInfo[unit].speed;
      var travelTime = distance * millisecondePerTile;
      var milliSecondsTravel = parseInt( travelTime );

      var sendingTime = new Date( arrivalDate.getTime() - milliSecondsTravel );

      var $sendTime = $('#sendtime');

      var dateWithManagedTimezone = new Date( sendingTime.getTime() + ((-1 * sendingTime.getTimezoneOffset()) * 60 * 1000) );
      var shortISOString = dateWithManagedTimezone.toISOString().substr( 0, 23 );

      $sendTime.val( shortISOString );
    } );

    $popup.find( "#iwan_scripts_popup_close" ).on( "click", function () {
      $popup.remove();
    } );
  } else {
    alert( "Please close the currently opened script popups first!" );
  }
  void(0);
})();