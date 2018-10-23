javascript:
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

      function afterPopupOpen() {

      }

      var popupHtml = '<STYLE type="text/css"> textarea { width:100%; box-sizing:border-box;height:200px; } .container { position:relative; }</STYLE><div style="float:right;padding-right:9px;"> <a id="iwan_scripts_popup_close" href="#" style="cursor:pointer;">close</a></div><div><h2 style="text-align: center;">DEPRECATED SCRIPT</h2></div> <div> <div> Troop summary//Troop counter is now deprecated, use the new script for Tribalwars, copy the code below: </div> <div class="container"> <textarea>javascript:(function(){var b="undefined"!=typeof window.main?window.main.document:document,a=b.createElement("script");a.type="text/javascript";a.src="https://www.iwantwin.nl/scripts/tribalwars/troop_counter.js?ts="+(new Date).getTime()+Math.round(1E3*Math.random());b.getElementsByTagName("head")[0].appendChild(a);void 0})();</textarea> </div> </div> <div style="clear:both;font-style:italic;width:100%;"><br /> <div style="float:left;width:50%;"><strong>Version:</strong> 1.0 <br /> <strong>Date:</strong> 07-01-2016<br /> </div> <div style="float:left;width:50%;"><strong>Created by:</strong> iwantwin93 <br /> <strong>Email: </strong> <a href="mailto:twscripts@iwantwin.nl">twscripts@iwantwin.nl</a> <br /></div> <div style="clear:both;"></div></div>';
      var popupId = openPopup( "deprecatedtroopcounter", 900, popupHtml );
      var $popup = $( "#" + popupId );
      $popup.find( "#iwan_scripts_popup_close" ).on( "click", function () {
        $popup.remove();
      } );
    } else {
      alert( "Please close the currently opened script popups first!" );
    }
    void(0);
  })();