javascript:/**CREATED BY: iwantwin, twscripts@iwantwin.nl at 29-03-2014, edited 22-02-2017 MAY NOT BE DISTRIBUTED WITHOUT THIS COMMENT**/
(function () {
  /**
   * This userscript will open a popup with certain village-name transformation options. The user can choose which
   * transformation he desires. The script will then ask for extra input, depending on the transformation options.
   * The script will then update all village names on the opened page (usually the combined overview).
   *
   * Village names can give tactical advantages over opposing players. You can make them attack their allies if they use
   * coordinate grabber scripts, this is done by using the semi-random coordinates method. You can also use the random
   * strings to make it impossible for players to talk about your village names. You can also change your village names
   * every 5 minutes (actually, how often you want) using this random string to confuse others even more.
   *
   * You can also use this script to give your villages meaningful names, you can sort your villages per continent,
   * square (10x10) or even in other ways.
   *
   * Future plans:
   * - Combine different methods to come up with even more creative solutions
   * - Combine with build-in coordinate grabber (as a user-script probably)
   * - Determine valid pages, so user is auto-redirect if this script was run in an incompatible page.
   */
  var constructor = function () {
    if ( $( ".iwan_scripts_popup" ).length == 0 ) {
      /* Script-global vars. Scoped to this script only, no interferences with external variables */
      var params = {};

      /******************************************************************************************************************/
      /************* SECTION VILLAGE RENAME FUNCTIONS Used to determine the name for a single village *******************/
      /******************************************************************************************************************/

      /**
       * Return the name the user has chosen for every village that we want to rename.
       * @param {jQuery} $villageEdit - Currently not used, but kept for consistency
       * @returns {string}
       */
      function nameOnly( $villageEdit ) {
        return params["name"];
      }

      /**
       * Returns the name the user has chosen, prefixed by a counter with 3 digits.
       * @param {jQuery} $villageEdit - Currently not used, but kept for consistency
       * @returns {string}
       */
      function nameWithNumber( $villageEdit ) {
        params["counter"]++;
        var villageName = '';
        if ( params["name_before"].trim() != '' ) {
          villageName += params["name_before"].trim();
        }
        villageName += padInteger( params["counter"], params["digits"] );
        if ( params["name_after"].trim() != '' ) {
          villageName += params["name_after"].trim();
        }
        return villageName;
      }

      /**
       * Returns a name based on the coordinates of the village that will be renamed.
       * @param {jQuery} $villageEdit - Used to retrieve data for the village that is being renamed
       * @returns {string}
       */
      function coordinateBasedName( $villageEdit ) {
        var name = params["coordBasedName"];
        var existingVillageString = $villageEdit.find( '.quickedit-label' ).html().trim();
        //Get coordinates from the current village data string.
        var aCoordStrings = existingVillageString.match( /\(\d\d\d\|\d\d\d\)|\(\d\d\|\d\d\d\)|\(\d\|\d\d\d\)|\(\d\d\d\|\d\d\)|\(\d\d\d\|\d\)|\(\d\d\|\d\d\)|\(\d\|\d\)/ );//Match coordinates: 1|1, 1|11, 1|111, 11|1, 111|1, 11|11, 111|111
        //A name can have multiple coordinates in one name, but we always target the last one since the last one is not user assignable
        var trueCoordOnly = aCoordStrings.length > 0 ? aCoordStrings.pop() : '000|000'; //Fallback to 000|000 if no coordinates are found for some reason (Known reasons: interference with other scripts, game updates)
        var coordParts = trueCoordOnly.split( '' );
        coordParts.reverse();

        var parsedCoordParts = [];
        var counter = 0;
        //Parse coördinates, do not allow partial coordinate, always require a format of xxx|yyy now.
        for ( var idx in coordParts ) {
          if ( coordParts.hasOwnProperty( idx ) ) {
            var coordPart = coordParts[idx];
            if ( !/\|/.test( coordPart ) && !/\(/.test( coordPart ) && !/\)/.test( coordPart ) ) {
              if ( /\d/.test( coordPart ) ) {
                parsedCoordParts.push( coordPart );
              } else {
                parsedCoordParts.push( '0' );
              }
              counter++;
            } else {
              if ( /\|/.test( coordPart ) ) {
                while ( counter < 3 ) {
                  parsedCoordParts.push( '0' );
                  counter++;
                }
              }
            }
          }
        }
        while ( counter < 6 ) {
          parsedCoordParts.push( '0' );
          counter++;
        }
        //We now have 6 values in the parsedCoordParts that corresponds to xxxyyy values of the coordinates.
        parsedCoordParts.reverse();
        var x1 = parsedCoordParts[0];
        var x2 = parsedCoordParts[1];
        var x3 = parsedCoordParts[2];
        var y1 = parsedCoordParts[3];
        var y2 = parsedCoordParts[4];
        var y3 = parsedCoordParts[5];
        //Now replace the user inputted name paramaters: {x1}, {x2} etc, case insensitive!
        name = name.replace( /\{x1\}/ig, x1 );
        name = name.replace( /\{x2\}/ig, x2 );
        name = name.replace( /\{x3\}/ig, x3 );
        name = name.replace( /\{y1\}/ig, y1 );
        name = name.replace( /\{y2\}/ig, y2 );
        name = name.replace( /\{y3\}/ig, y3 );
        return name;
      }

      /**
       * Give random coördinates to each village name, within the boundaries the user supplied in the popup.
       * @param {jQuery} $villageEdit - Currently not used, but kept for consistency
       * @returns {string}
       */
      function randomCoords( $villageEdit ) {
        var villageName = "000|000";
        try {
          var coord_min_x = parseInt( params["coord_min_x"] );
          var coord_min_y = parseInt( params["coord_min_y"] );
          var coord_max_x = parseInt( params["coord_max_x"] );
          var coord_max_y = parseInt( params["coord_max_y"] );
          var random_x = randomIntFromInterval( coord_min_x, coord_max_x );
          var random_y = randomIntFromInterval( coord_min_y, coord_max_y );
          villageName = padInteger( random_x, 3 ) + "|" + padInteger( random_y, 3 );
        } catch ( error ) {
          outputError( "Inputs were no numeric values!" );
        }
        return villageName;
      }

      /**
       * Give random coöordinates to each village name, but only choose random from a given list of coordinates.
       * @param {jQuery} $villageEdit - Currently not used, but kept for consistency
       * @returns {string}
       */
      function semiRandomCoords( $villageEdit ) {
        var randomIndex = randomIntFromInterval( 0, params["coordsArray"].length );
        return params["coordsArray"][randomIndex];
      }

      /**
       * Give a random string of characters to each village name. This will make the village name completely useless
       * for hostile players. Maximum of 32 characters is handled by processing the input, the maximum is set by the game
       * rules.
       * @param {jQuery} $villageEdit - Currently not used, but kept for consistency
       * @returns {string}
       */
      function randomString( $villageEdit ) {
        try {
          var amountOfChars = parseInt( params["amountOfChars"] );
        } catch ( error ) {
          outputError( "inputs were no numeric value" );
        }
        return getRandomString( amountOfChars );
      }

      /******************************************************************************************************************/
      /************* SECTION HELPER FUNCTIONS Retrieve data for the village rename functions ****************************/
      /******************************************************************************************************************/

      /**
       * Method that puts out error messages to the user.
       * @param message
       */
      function outputError( message ) {
        //TODO: Create nicer way of outputting errors.
        alert( message );
      }

      /**
       * This method returns a string of random characters based on the allowed subset of characters on the game
       * of Tribalwars.
       * @param {int} length
       * @returns {string}
       */
      function getRandomString( length ) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789|/?!@#$%*()_-=+";

        for ( var i = 0; i < length; i++ ) {
          text += possible.charAt( Math.floor( Math.random() * possible.length ) );
        }
        return text;
      }

      /**
       * Pick a random integer between two edge cases.
       * @param {int} min
       * @param {int} max
       * @returns {number}
       */
      function randomIntFromInterval( min, max ) {
        return Math.floor( Math.random() * (max - min + 1) + min );
      }

      /**
       * This method will pad an inputted integer to have the desired amount of characters.
       * NOTE: Integers that have more characters will not be made smaller
       * @param pInput - The integer to pad
       * @param pAmountOfCharacters - The amount of characters the input needs to get
       * @returns {*}
       */
      var padInteger = function ( pInput, pAmountOfCharacters ) {
        if ( !isNaN( parseInt( pInput ) ) ) {
          if ( typeof( pInput ) == 'string' ) {
            if ( pInput.length < pAmountOfCharacters ) {
              return padInteger( '0' + pInput, pAmountOfCharacters );
            } else {
              return pInput;
            }
          } else {
            return padInteger( pInput + '', pAmountOfCharacters );
          }
        } else {
          console.warn( "ERROR: Input was not a number: ", pInput );
          return pInput;
        }
      };

      /******************************************************************************************************************/
      /************* SECTION MAIN FUNCTIONS Show the script popup and actions, and process user interaction *************/
      /******************************************************************************************************************/
      /**
       * This method creates a popup and returns the popupId for future reference
       * @param {string} name
       * @param {int} popupWidth
       * @param {string} popupHtml
       * @returns {string}
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
        //Default popup styles, to blend in with the game styles
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

      //Create and define the popup upon using the script
      var popupHtml = '<STYLE type="text/css"> input[type=text] { width:429px; } textarea { width: 421px; } </STYLE> <div style="float:right;padding-right:9px;"> <a id="iwan_scripts_village_rename_popup_close" href="#">close</a> </div> <div><h2 style="text-align: center;margin-bottom:2px;">Village renamer</h2> <div style="text-align:center;margin-bottom:15px;">Click <a href="https://www.iwantwin.nl/scripts/tribalwars/stats.php" style="text-decoration:underline;">&gt;&gt;here&lt;&lt;</a> to see all the scripts that were made by <strong>iwantwin93</strong></div> </div> <div id="iwan_scripts_village_rename_popup_choices" style="float:left;width:441px;border:2px solid #7d510f;padding:0;margin:0;"> <table style="width:100%;"> <tbody> <tr> <th>How do you want to rename your villages?</th> </tr> <tr> <td><input type="radio" id="rename_method_1" name="rename_method" value="nameOnly"> Just a name</td> </tr> <tr id="rename_method_1_more" class="rename_method_detail"> <td style="border:1px solid #7d510f;"> <table> <tbody> <tr> <th>Choose the text for your name:</th> </tr> <tr> <td><input type="text" id="rename_method_1_text" placeholder="Enter village name here..."></td> </tr> </tbody> </table> </td> </tr> <tr> <td><input type="radio" id="rename_method_2" name="rename_method" value="nameWithNumber"> Name and number</td> </tr> <tr id="rename_method_2_more" class="rename_method_detail"> <td style="border:1px solid #7d510f;"> <table> <tbody> <tr> <th>1. Choose the text for your village names before the village number:</th> </tr> <tr> <td><input type="text" id="rename_method_2_text_front" placeholder="Enter first part of the village name here..."> </td> </tr> <tr> <th>2a. Amount of digit for your numbers:</th> </tr> <tr> <td><input type="number" id="rename_method_2_digits" value="3"> </td> </tr> <tr> <th>2b. First number:</th> </tr> <tr> <td><input type="number" id="rename_method_2_start_number" value="1"> </td> </tr> <tr> <th>3. Choose the text for your village names after the village number:</th> </tr> <tr> <td><input type="text" id="rename_method_2_text_behind" placeholder="Enter last part of the village name here..."> </td> </tr> </tbody> </table> </td> </tr> <tr> <td><input type="radio" id="rename_method_3" name="rename_method" value="randomCoords"> Random coordinates</td> </tr> <tr id="rename_method_3_more" class="rename_method_detail"> <td style="border:1px solid #7d510f;"> <table> <tbody> <tr> <th>What is the minimum coordinate count?</th> </tr> <tr> <td>x: <input type="text" id="rename_method_3_min_x" placeholder="x" size="5" value="0"> y: <input type="text" id="rename_method_3_min_y" placeholder="y" size="5" value="0"></td> </tr> <tr> <th>What is the maximum coordinate count?</th> </tr> <tr> <td>x: <input type="text" id="rename_method_3_max_x" placeholder="x" size="5" value="999"> y: <input type="text" id="rename_method_3_max_y" placeholder="y" size="5" value="999"></td> </tr> </tbody> </table> </td> </tr> <tr> <td><input type="radio" id="rename_method_4" name="rename_method" value="semiRandomCoords"> Random coordinates from coords input </td> </tr> <tr id="rename_method_4_more" class="rename_method_detail"> <td style="border:1px solid #7d510f;"> <table> <tbody> <tr> <th>Coordinates to random from?</th> </tr> <tr> <td><i>Input as following (space seperated): xxx|yyy xxx|yyy xxx|yyy</i></td> </tr> <tr> <td><textarea id="rename_method_4_coords_input" rows="10" cols="50"></textarea></td> </tr> </tbody> </table> </td> </tr> <tr> <td><input type="radio" id="rename_method_5" name="rename_method" value="randomString"> Random string</td> </tr> <tr id="rename_method_5_more" class="rename_method_detail"> <td style="border:1px solid #7d510f;"> <table> <tbody> <tr> <th>How many characters should your string consist of?</th> </tr> <tr> <td><input type="text" id="rename_method_5_text" placeholder="Enter amount of characters here..."> </td> </tr> </tbody> </table> </td> </tr> <tr> <td><input type="radio" id="rename_method_6" name="rename_method" value="coordinateBased"> Name based on coördinates </td> </tr> <tr id="rename_method_6_more" class="rename_method_detail"> <td style="border:1px solid #7d510f;"> <table> <tbody> <tr> <th>How should your string look like?</th> </tr> <tr> <td><i>Input as following: \'{X1}{X2}{X3}|{Y1}{Y2}{Y3}\'. If you want continent for example, use \'{Y1}{X1} -name-\'</i></td> </tr> <tr> <td> <input type="text" id="rename_method_6_text" placeholder="Enter village string with parameters here.. i.e. use \'C{y1}{x1} Custom name\'" value="C{y1}{x1} Custom name"> </td> </tr> </tbody> </table> </td> </tr> <tr> <td><input type="submit" id="namingMethodSubmit" value="Change all names" /></td> </tr> </tbody> </table> </div> <div id="iwan_scripts_village_rename_popup_examples" style="float:left;width:434px;border:2px solid #7d510f;padding:7px;margin:0;"> <b>Examples:</b> <div style="width:416px;border:2px solid #7d510f;padding:7px;margin:0;"> Sorry <br /> Not <br /> Yet <br /> Supported <br /></div> </div> <div style="clear:both;font-style:italic;width:100%;"><br /> <div style="float:left;width:50%;"><strong>Version:</strong> 1.8 <br /> <strong>Date:</strong> 22-02-2017<br /></div> <div style="float:left;width:50%;"><strong>Created by:</strong> iwantwin93 <br /> <strong>Email: </strong> <a href="mailto:twscripts@iwantwin.nl">twscripts@iwantwin.nl</a> <br /></div> <div style="clear:both;"></div> </div>';
      var popupId = openPopup( "rename_villages", 450, popupHtml );
      var $popup = $( "#" + popupId );
      $popup.find( "#iwan_scripts_village_rename_popup_examples" ).hide();
      var $rename_method_details = $popup.find( ".rename_method_detail" );
      $rename_method_details.hide();

      //When radio buttons are changed, we adapt the popup to show child-options
      var $radioButtons = $popup.find( 'input[type="radio"][name="rename_method"]' );
      $radioButtons.on( "change", function () {
        var $this = $( this );
        var $rename_method_detail = $( '#' + $this.attr( 'id' ) + '_more' );
        $rename_method_details.hide();
        if ( $rename_method_detail.length == 1 ) {
          $rename_method_detail.show();
        }
      } );

      //Handle user submission of the forms
      //Determine the chosen way to rename the users's villages
      //Set parameters for the way to rename villages
      $popup.find( "#namingMethodSubmit" ).on( "click", function () {
        var namingMethod = $radioButtons.andSelf().find( ':checked' ).val();
        var transformVillageNameMethod;
        switch ( namingMethod ) {
          case "nameOnly":
            params["name"] = $( "#rename_method_1_text" ).val();
            transformVillageNameMethod = nameOnly;
            break;
          case "nameWithNumber":
            var $renameMethod2Digits = $( "#rename_method_2_digits" );
            var $renameMethod2StartNumber = $( "#rename_method_2_start_number" );
            params["name_before"] = $( "#rename_method_2_text_front" ).val();
            params["name_after"] = $( "#rename_method_2_text_behind" ).val();
            params["digits"] = $renameMethod2Digits.val();
            if ( parseInt( params["digits"] ) <= 0 || isNaN( parseInt( params["digits"] ) ) ) {
              params["digits"] = 3;
              outputError( "Minimum amount of digits is 1. Changed it back to the default: 3" );
              $renameMethod2Digits.val( params["digits"] );
            }
            params["counter"] = parseInt( $renameMethod2StartNumber.val() );
            if ( parseInt( params["counter"] ) <= 0 || isNaN( parseInt( params["counter"] ) ) ) {
              params["counter"] = 1;
              outputError( "Minimum amount of first number is 1. Changed it back to the default: 1" );
              $renameMethod2StartNumber.val( params["startNumber"] );
            }
            //Because counter wants to start at zero.
            params["counter"] = params["counter"] - 1;
            transformVillageNameMethod = nameWithNumber;
            break;
          case "randomCoords":
            params["coord_min_x"] = $( "#rename_method_3_min_x" ).val();
            params["coord_min_y"] = $( "#rename_method_3_min_y" ).val();
            params["coord_max_x"] = $( "#rename_method_3_max_x" ).val();
            params["coord_max_y"] = $( "#rename_method_3_max_y" ).val();
            transformVillageNameMethod = randomCoords;
            break;
          case "semiRandomCoords":
            params["coordsArray"] = $( "#rename_method_4_coords_input" ).val().split( " " );
            transformVillageNameMethod = semiRandomCoords;
            break;
          case "randomString":
            var $rename_method_5_text = $( "#rename_method_5_text" );
            params["amountOfChars"] = $rename_method_5_text.val();
            if ( params["amountOfChars"] > 32 ) {
              params["amountOfChars"] = 32;
              outputError( "32 characters is the maximum value allowed by tribalwars. Changed it back to 32." );
              $rename_method_5_text.val( params["amountOfChars"] );
            }
            if ( params["amountOfChars"] < 3 ) {
              params["amountOfChars"] = 3;
              outputError( "3 characters is the minimum value required by tribalwars. Changed it to 3." );
              $rename_method_5_text.val( params["amountOfChars"] );
            }
            transformVillageNameMethod = randomString;
            break;
          case "coordinateBased":
            params["coordBasedName"] = $( "#rename_method_6_text" ).val();
            transformVillageNameMethod = coordinateBasedName;
            break;
        }
        //Now really rename the villages
        renameVillages( transformVillageNameMethod );
      } );

      //We should put the user in charge of when he wants to close the popup and play the game without interference of
      // this script.
      $popup.find( "#iwan_scripts_village_rename_popup_close" ).on( "click", function () {
        $popup.remove();
      } );

      /**
       * Renames each village on the page, one by one, using the chosen village name transformation for each village to
       * determine the new name. Async update the village names as allowed for village lists by Tribalwars (no async is
       * usually allowed!). Also updating the visual representation of the village name, but only after a successfull
       * update, so the user has visual confirmation of the updates.
       * @param {function} transformVillageNameMethod
       */
      function renameVillages( transformVillageNameMethod ) {
        $.each( $( ".quickedit-vn" ), function () {
          var $this = $( this );
          var newName = transformVillageNameMethod( $this );
          window.ISS.ActionManager.performAction( 'Iwantwin\'s village renamer', 'Rename village', function ( callback ) {
            var promise = $.ajax( {
                                    url: game_data.link_base_pure + "main&ajaxaction=change_name&village=" + $this.attr( "data-id" ) + "&h=" + game_data.csrf,
                                    data: {
                                      text: newName
                                    }
                                  } );
            promise.done( function () {
              callback();
            } );
            promise.fail( function () {
              callback();
            } );
          }, function () {
            $this.find( ".quickedit-label:first" ).text( newName )
          } );
        } );
      }
    } else {
      outputError( "Please close the currently opened script popups first!" );
    }
  };

  if ( !window.hasOwnProperty( 'ISS' ) ) {
    //Include ISS script, mainly for the ActionManager.
    (function () {
      var b = "undefined" != typeof window.main ? window.main.document : document, a = b.createElement( "script" );
      a.type = "text/javascript";
      a.src = "https://raw.githubusercontent.com/iwantwin/tribalwars-scripts/master/iwantwin_script_services/iwantwin_scripts_services.js?ts=" + (new Date).getTime() + Math.round( 1E3 * Math.random() );
      b.getElementsByTagName( "head" )[0].appendChild( a );
      void 0
    })();
    $( window ).on( 'ISSLoaded', function () {
      constructor();
    } );
  } else {
    constructor();
  }

  //Ouput void(0); ensures opera's allowance for userscripts, if we do not output void, it will output the latest
  // assigned variable, and since this is a function that auto-executes, which therefore creates a private scope,
  // there is nothing to output. With void(0) we force opera 8.12 (Legacy browser used by many Tribalwars players) to have a void
  // output, therefore preventing crashes.
  void(0);
})();