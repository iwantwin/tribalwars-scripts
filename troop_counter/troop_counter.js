/*
 Author	: Dale McKay
 Redistributed: by iwantwin at 09-07-2015 22:44
 Edited: by iwantwin at 07-01-2015 01:11
 Last update: 07-01-2016 00:44
 Email	: dalesmckay@gmail.com
 Notes	: thanks to slowtarget for some initial ideas/functions

 TODO	:
 * Display foreign troop summary

 UPDATE LOG :
 - 09-07-2015
 * HTTPS support
 - 07-01-2016
 * Tribalwars in Chrome won't open popup with results, therefor ingame popup produced by iwantwin93 is added
 ____________________________________________________________

 Copyright (C) 2010 Dale McKay, all rights reserved
 version 1.0, 9 April 2010

 This software is provided 'as-is', without any express or implied warranty. In no event will the author be held liable for any damages arising from the use of this software.

 Permission is granted to anyone to use this software for any purpose, including commercial applications, and to alter it and redistribute it freely, subject to the following restrictions:
 The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use this software in a product, an acknowledgment in the product documentation would be appreciated but is not required.
 Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
 This notice may not be removed or altered from any source distribution.
 ____________________________________________________________
 */
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

      function fnExecuteScript() {
        try {
          var strVersion = "v7.7";

          var unitDesc = {
            "spear": "Spear fighters",
            "sword": "Swordsmen",
            "axe": "Axemen",
            "archer": "Archers",
            "spy": "Scouts",
            "light": "Light cavalry",
            "marcher": "Mounted archers",
            "heavy": "Heavy cavalry",
            "ram": "Rams",
            "catapult": "Catapults",
            "knight": "Paladin",
            "snob": "Noblemen",
            "militia": "Militia",
            "offense": "Offensive",
            "defense": "Defensive"
          };

          function fnTranslate( id ) {
            var translation = {
              "en": [
                // GROUP NAMES
                "Full Train Nukes",
                "Full Defense Trains",
                "Other Nobles",
                "Full Nukes",
                "3/4 Nukes",
                "2/4 Nukes",
                "1/4 Nukes",
                "Catapult Nukes",
                "Full Defense",
                "3/4 Defense",
                "2/4 Defense",
                "1/4 Defense",
                "Full Scouts",
                "3/4 Scouts",
                "2/4 Scouts",
                "1/4 Scouts",
                "Other",

                // OTHER DESCRIPTIONS
                "Troop Summary",
                "Noble Armies",
                "Offensive Armies",
                "Defensive Armies",
                "Scout Armies",
                "Other Armies",
                "Offensive Units",
                "Defensive Units",
                "Other Units",
                "Total Units",
                "Co-ordinates"
              ]
            };

            /* Default to English "en". */
            var lang = typeof(translation[win.game_data.market] == "undefined") ? "en" : win.game_data.market;
            if ( typeof(translation[lang][id]) == "undefined" ) {
              return "";
            }

            return translation[lang][id];
          }

          function fnDebugLog( msg ) {win.$( "body" ).append( "<span>" + msg + "</span><br/>" );}

          /* sendMethod = "GET" || "POST", params = json, type = xml,json,text */
          function fnAjaxRequest( url, sendMethod, params, type ) {
            var error = null, payload = null;

            win.$.ajax( {
                          "async": false,
                          "url": url,
                          "data": params,
                          "dataType": type,
                          "type": String( sendMethod || "GET" ).toUpperCase(),
                          "error": function ( req, status, err ) {error = "ajax: " + status;},
                          "success": function ( data, status, req ) {payload = data;}
                        } );

            if ( error ) {
              throw(error);
            }

            return payload;
          }

          function fnCreateConfig( name ) {return win.$( fnAjaxRequest( "/interface.php", "GET", {"func": name}, "xml" ) ).find( "config" );}

          function fnCreateWorldConfig() {return fnCreateConfig( "get_config" );}

          function fnCreateBuildingConfig() {return fnCreateConfig( "get_building_info" );}

          function fnCreateUnitConfig() {return fnCreateConfig( "get_unit_info" );}

          function fnHasArchers() {return (parseInt( win.game_data.worldConfig.find( "game archer" ).text() || "0", 10 ) > 0);}

          function fnHasChurch() {return (parseInt( win.game_data.worldConfig.find( "game church" ).text() || "0", 10 ) > 0);}

          function fnHasNotebook() {return (win.$( '[src*="note.png"],[class*="note-icon"]' ).length > 0);}

          function fnHasPaladin() {return (parseInt( win.game_data.worldConfig.find( "game knight" ).text() || "0", 10 ) > 0);}

          function fnHasMilitia() {return (win.game_data.unitConfig.find( "militia" ).length > 0);}

          function fnGetTroopCount() {
            /* returns an array of: {"x":"xxx","y":"yyy","coords":"xxx|yyy","troops":[0,0,0,0,0,0,0,0,0,0,0,0,0]} */

            /* Number of Columns - VillageColumn - ActionColumn */
            var gameVersion = parseFloat( win.game_data.version.match( /[\d|\.]+/g )[1] );
            var colCount = win.$( '#units_table ' + ((gameVersion >= 7.1) ? 'thead' : 'tbody:eq(0)') + ' th' ).length - 2;
            var villageTroopInfo = [];

            win.$( '#units_table tbody' + ((gameVersion < 7.1) ? ':gt(0)' : '') ).each( function ( row, eleRow ) {
              /* Reset for next Village */
              var villageData = {"troops": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ]};

              /* Village */
              coords = win.$( eleRow ).find( "td:eq(0)" ).text().match( /\d+\|\d+/g );
              coords = (coords ? coords[coords.length - 1].match( /(\d+)\|(\d+)/ ) : null);
              villageData.x = parseInt( coords[1], 10 );
              villageData.y = parseInt( coords[2], 10 );
              villageData.coords = coords[0];

              /* Skip the Village Cell */
              win.$( eleRow ).find( "td:gt(0):not(:has(>a))" ).each( function ( cell, eleCell ) {
                /* Skip the RowType Cell */
                if ( cell % colCount ) {
                  /* Ignore In the village (your own + foreign) */
                  if ( Math.floor( cell / colCount ) != 1 ) {
                    villageData.troops[cell % colCount - 1] += parseInt( win.$( eleCell ).text() || "0", 10 );
                  }
                }
              } );

              /* Cache the Data */
              villageTroopInfo.push( villageData );
            } );

            return villageTroopInfo;
          }

          function fnLogVersionInfo() {
            fnDebugLog( "" );
            fnDebugLog( "=========================" );
            fnDebugLog( "dalesmckay's Troop Summary: " + strVersion );
            fnDebugLog( "=========================" );
            fnDebugLog( "Premium: " + (win.game_data.isPremium ? "yes" : "no") );
            fnDebugLog( "Church : " + (fnHasChurch() ? "yes" : "no") );
            fnDebugLog( "Statue : " + (fnHasPaladin() ? "yes" : "no") );
            fnDebugLog( "Archer : " + (fnHasArchers() ? "yes" : "no") );
            fnDebugLog( "Militia: " + (fnHasMilitia() ? "yes" : "no") );
            fnDebugLog( "Sitter : " + (win.location.href.match( /t\=\d+/i ) ? "yes" : "no") );
            fnDebugLog( "=========================" );
            fnDebugLog( "Version: " + win.game_data.version );
            fnDebugLog( "World  : " + win.game_data.world );
            fnDebugLog( "Screen : " + win.game_data.screen );
            fnDebugLog( "Mode   : " + win.game_data.mode );
            fnDebugLog( "URL    : " + win.location.href );
            fnDebugLog( "Browser: " + navigator.userAgent );
            fnDebugLog( "=========================" );

            return true;
          }

          function fnCriteriaToStr( criteria ) {
            var valueStr = "";

            if ( criteria && (criteria.length > 0) ) {
              for ( var ii = 0; ii < criteria.length; ii++ ) {
                if ( typeof(criteria[ii].minpop) != "undefined" ) {
                  valueStr += (valueStr ? " and " : "") + "(" + unitDesc[criteria[ii].unit] + "[pop] >= " + criteria[ii].minpop + ")";
                }
                if ( typeof(criteria[ii].maxpop) != "undefined" ) {
                  valueStr += (valueStr ? " and " : "") + "(" + unitDesc[criteria[ii].unit] + "[pop] < " + criteria[ii].maxpop + ")";
                }
              }
            }

            return valueStr;
          }

          function fnCalculateTroopCount() {
            var maxGroups = 0;
            var outputSummary = {
              "Full Train Nuke": {
                "group": "Nobles",
                "criteria": [
                  {"unit": "snob", "minpop": 400},
                  {"unit": "offense", "minpop": 19600}
                ],
                "descID": maxGroups++
              },
              "Full Defense Train": {
                "group": "Nobles",
                "criteria": [
                  {"unit": "snob", "minpop": 400},
                  {"unit": "defense", "minpop": 19600}
                ],
                "descID": maxGroups++
              },
              "Other Nobles": {
                "group": "Nobles",
                "criteria": [
                  {"unit": "snob", "minpop": 100},
                  {"unit": "defense", "maxpop": 19600},
                  {"unit": "offense", "maxpop": 19600}
                ],
                "descID": maxGroups++
              },
              "Full Nuke": {
                "group": "Offensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "offense", "minpop": 20000}
                ],
                "descID": maxGroups++
              },
              "Semi Nuke": {
                "group": "Offensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "offense", "minpop": 15000, "maxpop": 20000}
                ],
                "descID": maxGroups++
              },
              "Half Nuke": {
                "group": "Offensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "offense", "minpop": 10000, "maxpop": 15000}
                ],
                "descID": maxGroups++
              },
              "Quarter Nuke": {
                "group": "Offensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "offense", "minpop": 5000, "maxpop": 10000}
                ],
                "descID": maxGroups++
              },
              "Cat Nuke": {
                "group": "Offensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "catapult", "minpop": 800},
                  {"unit": "offense", "minpop": 20000}
                ],
                "descID": maxGroups++
              },
              "Full Defense": {
                "group": "Defensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "defense", "minpop": 19500}
                ],
                "descID": maxGroups++
              },
              "Semi Defense": {
                "group": "Defensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "defense", "minpop": 15000, "maxpop": 19500}
                ],
                "descID": maxGroups++
              },
              "Half Defense": {
                "group": "Defensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "defense", "minpop": 10000, "maxpop": 15000}
                ],
                "descID": maxGroups++
              },
              "Quarter Defense": {
                "group": "Defensive",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "defense", "minpop": 5000, "maxpop": 10000}
                ],
                "descID": maxGroups++
              },
              "Full Scout": {
                "group": "Scouts",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "spy", "minpop": 20000}
                ],
                "descID": maxGroups++
              },
              "Semi Scout": {
                "group": "Scouts",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "spy", "minpop": 15000, "maxpop": 20000}
                ],
                "descID": maxGroups++
              },
              "Half Scout": {
                "group": "Scouts",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "spy", "minpop": 10000, "maxpop": 15000}
                ],
                "descID": maxGroups++
              },
              "Quarter Scout": {
                "group": "Scouts",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "spy", "minpop": 5000, "maxpop": 10000}
                ],
                "descID": maxGroups++
              },
              "Other": {
                "group": "Other",
                "criteria": [
                  {"unit": "snob", "maxpop": 100},
                  {"unit": "spy", "maxpop": 5000},
                  {"unit": "defense", "maxpop": 5000},
                  {"unit": "offense", "maxpop": 5000}
                ],
                "descID": maxGroups++
              }
            };

            var ii, jj, village, total, index, count, unit, item, key, criteria, condition, isValid;
            var defense = [
              "spear",
              "sword",
              "heavy",
              "catapult"
            ];
            var offense = [
              "axe",
              "light",
              "ram",
              "catapult"
            ];

            if ( fnHasMilitia() ) {
              defense.push( "militia" );
            }

            if ( fnHasArchers() ) {
              defense.push( "archer" );
              offense.push( "marcher" );
            }
            /*
             if(fnHasPaladin()){
             offense.push("knight");
             }
             */

            /* Initialize */
            var summary = {
              unitTotal: {"tally": 0, "population": 0},
              defense: {"tally": 0, "count": 0, "population": 0, "coords": []},
              offense: {"tally": 0, "count": 0, "population": 0, "coords": []}
            };

            win.$( win.game_data.unitConfig ).children().each( function ( i, e ) {
              summary[e.nodeName] = {"tally": 0, "count": 0, "population": 0, "coords": []};
            } );

            for ( item in outputSummary ) {
              if ( outputSummary.hasOwnProperty( item ) ) {
                summary[item] = {"tally": 0, "count": 0, "population": 0, "coords": []};
              }
            }

            var villageTroops = fnGetTroopCount();
            for ( ii = 0; ii < villageTroops.length; ii++ ) {
              village = villageTroops[ii];
              total = {
                defense: {"tally": 0, "count": 0, "population": 0, "coords": []},
                offense: {"tally": 0, "count": 0, "population": 0, "coords": []}
              };

              win.$( win.game_data.unitConfig ).children().each( function ( i, e ) {
                total[e.nodeName] = {"tally": 0, "count": 0, "population": 0, "coords": []};
              } );

              /* Calculate total count & population for each unit type */
              index = 0;
              win.$( win.game_data.unitConfig ).children().each( function ( i, e ) {
                var unit = e.nodeName;
                total[unit].count += village.troops[index];
                total[unit].population += village.troops[index] * parseInt( win.$( e ).find( "pop" ).text(), 10 );

                /* Defense */
                if ( new RegExp( '^(' + defense.join( '|' ) + ')$' ).test( unit ) ) {
                  total.defense.count += total[unit].count;
                  total.defense.population += total[unit].population;
                }

                /* Offense */
                if ( new RegExp( '^(' + offense.join( '|' ) + ')$' ).test( unit ) ) {
                  total.offense.count += total[unit].count;
                  total.offense.population += total[unit].population;
                }

                /* Units */
                summary[unit].count += total[unit].count;
                summary[unit].population += total[unit].population;

                /* All Units */
                summary.unitTotal.tally += total[unit].count;
                summary.unitTotal.population += total[unit].population;

                index++;
              } );

              summary.defense.count += total.defense.count;
              summary.defense.population += total.defense.population;

              summary.offense.count += total.offense.count;
              summary.offense.population += total.offense.population;

              /* Calculate other summaries */
              for ( item in outputSummary ) {
                if ( outputSummary.hasOwnProperty( item ) ) {
                  isValid = true;

                  for ( jj = 0; jj < outputSummary[item].criteria.length; jj++ ) {
                    criteria = outputSummary[item].criteria[jj];

                    if ( !((typeof(criteria.minpop) == "undefined") || !criteria.minpop || (total[criteria.unit].population >= criteria.minpop)) ) {
                      isValid = false;
                    }

                    if ( !((typeof(criteria.maxpop) == "undefined") || !criteria.maxpop || (total[criteria.unit].population < criteria.maxpop)) ) {
                      isValid = false;
                    }
                  }

                  if ( isValid ) {
                    summary[item].coords.push( village.coords );
                    summary[item].tally++;
                  }
                }
              }
            }

            var groupSummary = {};
            for ( item in outputSummary ) {
              if ( outputSummary.hasOwnProperty( item ) ) {
                if ( typeof(groupSummary[outputSummary[item].group]) == "undefined" ) {
                  groupSummary[outputSummary[item].group] = [];
                }

                groupSummary[outputSummary[item].group].push( item );
              }
            }

            var curGroup = maxGroups;

            var docSource = "";
            docSource += "\t\t<script type=\"text/javascript\">\n";
            docSource += "\t\t\t<!--\n";
            docSource += "\t\t\tfunction fnShowCoords(id,description){\n";
            docSource += "\t\t\t\tvar coords={};\n";
            for ( item in outputSummary ) {
              if ( outputSummary.hasOwnProperty( item ) ) {
                if ( summary[item].coords.length ) {
                  docSource += "\t\t\t\tcoords[\"" + item + "\"] = \"" + summary[item].coords.join( " " ) + "\";\n";
                }
              }
            }
            docSource += "\t\t\t\tdocument.getElementById(\"coords_group\").innerHTML = description;\n";
            docSource += "\n";
            docSource += "\t\t\t\tvar eleCoords = document.getElementById(\"coords_container\");\n";
            docSource += "\t\t\t\teleCoords.value = coords[id]?coords[id]:\"\";\n";
            docSource += "\t\t\t\teleCoords.focus();\n";
            docSource += "\t\t\t\teleCoords.select();\n";
            docSource += "\t\t\t}\n";
            docSource += "\t\t\t-->\n";
            docSource += "\t\t</script>\n";

            docSource += '<div style="float:right;padding-right:9px;"> <a id="iwan_scripts_popup_close" href="#" style="cursor:pointer;">close</a> </div>';
            docSource += '<div><h2 style="text-align: center;">' + fnTranslate( curGroup++ ) + '</h2></div>';

            docSource += "\t\t<table align=\"center\"><tr><td>\n";
            docSource += "\t\t\t<table><tr><td>\n";
            docSource += "\t\t\t\t<table class=\"main\" width=\"100%\" align=\"center\">\n";
            docSource += "\t\t\t\t\t<tr>\n";
            docSource += "\t\t\t\t\t\t<td id=\"content_value\">\n";

            docSource += "\t\t\t\t\t\t\t<table>\n";
            docSource += "\t\t\t\t\t\t\t\t<tr><td width=\"450\" valign=\"top\"><table class=\"vis\" width=\"100%\">\n";
            for ( item in groupSummary ) {
              if ( groupSummary.hasOwnProperty( item ) ) {
                count = 0;
                docSource += "<tr><th colspan=\"2\">" + fnTranslate( curGroup++ ) + "</th></tr>\n";
                for ( jj = 0; jj < groupSummary[item].length; jj++ ) {
                  docSource += "\t\t\t\t\t\t\t\t<tr class=\"" + ((count++ % 2) ? "row_b" : "row_a") + "\">\n";
                  docSource += "\t\t\t\t\t\t\t\t\t<td width=\"240\" style=\"white-space:nowrap;\"><a href=\"#\" onclick=\"fnShowCoords('" + groupSummary[item][jj] + "','" + fnTranslate( outputSummary[groupSummary[item][jj]].descID ) + "');\" title=\"" + fnCriteriaToStr( outputSummary[groupSummary[item][jj]].criteria ) + "\">&raquo;&nbsp; " + fnTranslate( outputSummary[groupSummary[item][jj]].descID ) + "</a></td>\n";
                  docSource += "\t\t\t\t\t\t\t\t\t<td width=\"240\"" + ((summary[groupSummary[item][jj]].tally > 0) ? "" : " class=\"hidden\"") + " style=\"text-align:right;\"><span>" + summary[groupSummary[item][jj]].tally + "</span></td>\n";
                  docSource += "\t\t\t\t\t\t\t\t</tr>\n";
                }
              }
            }
            docSource += "\t\t\t\t\t\t\t</table>\n";
            docSource += "\t\t\t\t\t\t\t<td valign=\"top\">\n";

            /* Offensive Units */
            docSource += "\t\t\t\t\t\t\t\t<table class=\"vis\" width=\"100%\">\n";
            docSource += "\t\t\t\t\t\t\t\t\t<tr><th colspan=\"2\" style=\"white-space:nowrap;\">" + fnTranslate( curGroup++ ) + "</th></tr>\n";
            count = 0;
            for ( key in offense ) {
              if ( offense.hasOwnProperty( key ) ) {
                docSource += "\t\t\t\t\t\t\t\t\t<tr class=\"" + ((count++ % 2) ? "row_b" : "row_a") + "\"><td><img src=\"http://" + win.location.hostname + "/graphic/unit/unit_" + offense[key] + ".png?1\" alt=\"\"/></td><td style=\"white-space:nowrap;\"><span> " + summary[offense[key]].count + " " + unitDesc[offense[key]] + "</span></td></tr>\n";
              }
            }
            docSource += "\t\t\t\t\t\t\t\t</table>\n";

            /* Defensive Units */
            docSource += "\t\t\t\t\t\t\t\t<table class=\"vis\" width=\"100%\">\n";
            docSource += "\t\t\t\t\t\t\t\t\t<tr><th colspan=\"2\" style=\"white-space:nowrap;\">" + fnTranslate( curGroup++ ) + "</th></tr>\n";
            count = 0;
            for ( key in defense ) {
              if ( defense.hasOwnProperty( key ) ) {
                docSource += "\t\t\t\t\t\t\t\t\t<tr class=\"" + ((count++ % 2) ? "row_b" : "row_a") + "\"><td><img src=\"http://" + win.location.hostname + "/graphic/unit/unit_" + defense[key] + ".png?1\" alt=\"\"/></td><td style=\"white-space:nowrap;\"><span> " + summary[defense[key]].count + " " + unitDesc[defense[key]] + "</span></td></tr>\n";
              }
            }
            docSource += "\t\t\t\t\t\t\t\t</table>\n";

            /* Other Units */
            docSource += "\t\t\t\t\t\t\t\t<table class=\"vis\" width=\"100%\">\n";
            docSource += "\t\t\t\t\t\t\t\t\t<tr><th colspan=\"2\" style=\"white-space:nowrap;\">" + fnTranslate( curGroup++ ) + "</th></tr>\n";
            count = 0;
            win.$( win.game_data.unitConfig ).children().each( function ( i, e ) {
              var unit = e.nodeName;
              if ( !new RegExp( '^(' + defense.join( '|' ) + '|' + offense.join( '|' ) + ')$' ).test( unit ) ) {
                docSource += "\t\t\t\t\t\t\t\t\t<tr class=\"" + ((count++ % 2) ? "row_b" : "row_a") + "\"><td><img src=\"http://" + win.location.hostname + "/graphic/unit/unit_" + unit + ".png?1\" alt=\"\"/></td><td style=\"white-space:nowrap;\"><span> " + summary[unit].count + " " + unitDesc[unit] + "</span></td></tr>\n";
              }
            } );
            docSource += "\t\t\t\t\t\t\t\t</table>\n";

            /* Total Units */
            docSource += "\t\t\t\t\t\t\t\t<table class=\"vis\" width=\"100%\">\n";
            docSource += "\t\t\t\t\t\t\t\t\t<tr><th colspan=\"2\" style=\"white-space:nowrap;\">" + fnTranslate( curGroup++ ) + "</th></tr>\n";
            docSource += "\t\t\t\t\t\t\t\t\t<tr class=\"" + "row_a" + "\"><td><span>Count:</span></td><td style=\"white-space:nowrap;\"><span> " + summary.unitTotal.tally + "</span></td></tr>\n";
            docSource += "\t\t\t\t\t\t\t\t\t<tr class=\"" + "row_b" + "\"><td><span>Pop:</span></td><td style=\"white-space:nowrap;\"><span> " + summary.unitTotal.population + "</span></td></tr>\n";
            docSource += "\t\t\t\t\t\t\t\t</table>\n";

            docSource += "\t\t\t\t\t\t\t</td>\n";
            docSource += "\t\t\t\t\t\t</td>\n";
            docSource += "\t\t\t\t\t</tr>\n";
            docSource += "\t\t\t\t</table>\n";
            docSource += "\t\t\t\t<hr>\n";
            docSource += "\t\t\t\t<table id=\"coordinate_table\" class=\"vis\" style=\"width:100%;\">\n";
            docSource += "\t\t\t\t\t<tr><th>" + fnTranslate( curGroup++ ) + ": <span id=\"coords_group\" style=\"font-weight:100;\"></span>\n";
            docSource += "\t\t\t\t\t<tr><td style=\"padding:1em;\"><textarea id=\"coords_container\" style=\"width:100%;\"></textarea></td></tr>\n";
            docSource += "\t\t\t\t</table>\n";
            docSource += "\t\t\t</table>\n";
            docSource += "\t\t</table>\n";

            docSource += '<div style="clear:both;font-style:italic;width:100%;"><br />';
            docSource += '<div style="float:left;width:50%;"><strong>Version:</strong> 7.8 <br /> <strong>Date:</strong> 07-01-2016<br />';
            docSource += '</div>';
            docSource += '<div style="float:left;width:50%;"><strong>Edited and served by:</strong> iwantwin93 <br /> <strong>Email: </strong>';
            docSource += '<a href="mailto:twscripts@iwantwin.nl">twscripts@iwantwin.nl</a>';
            docSource += '<br /><strong>Original troop counting logic by:</strong> <a href="mailto:dalesmckay@gmail.com">Dale McKay</a>';
            docSource += '<br /></div>';
            docSource += '<div style="clear:both;"></div>';
            docSource += '</div>';

            var popupId = openPopup( "CoordinatesFilter", 900, docSource );
            afterPopupOpen();
            var $popup = $( "#" + popupId );

            $popup.find( "#iwan_scripts_popup_close" ).on( "click", function () {
              $popup.remove();
            } );
          }

          var win = (window.main || self);

          if ( win.game_data.mode != "units" || win.game_data.screen != 'overview_villages' ) {
            alert( "The script will redirect you to the following page:\nOverviews->Troops\nPlease select the group you want to count and activate the script again." );
            win.location = win.game_data.link_base_pure + 'overview_villages&mode=units';
            throw('CUSTOMCLOSE');
          }

          // Check Permissions.
          if ( win.game_data.world == 'zz2' ) {
            if ( [16467].indexOf( parseInt( win.game_data.player.id, 10 ) ) < 0 ) {
              throw('Hi ' + win.game_data.player.name + '!\n\nYour scripts have been disabled by dalesmckay\nSend him a mail if you wish to help with testing');
            }
          }

          /* HACK: fix null mode */
          if ( !win.game_data.mode ) {
            var vmode = win.$( "#overview_menu td[class=selected] a" ).attr( "href" ).match( /mode\=(\w*)/i );
            if ( vmode ) {
              win.game_data.mode = vmode[1];
            }
          }

          win.game_data.isPremium = (win.$( "#quickbar_outer" ).length > 0);

          if ( typeof(win.game_data.worldConfig) == "undefined" ) {
            win.game_data.worldConfig = fnCreateWorldConfig();
          }

          if ( typeof(win.game_data.unitConfig) == "undefined" ) {
            win.game_data.unitConfig = fnCreateUnitConfig();
          }

          /* Todo: Handle different scripts by name */
          if ( typeof(win.game_data.versionDumped) == "undefined" ) {
            win.game_data.versionDumped = fnLogVersionInfo();
          }

          fnCalculateTroopCount();

          void(0);
        }
        catch ( objError ) {
          var errMsg = String( objError.message || objError || "" );
          if ( errMsg && errMsg != 'CUSTOMCLOSE' ) {
            fnDebugLog( "Error: " + errMsg );
            alert( "Error: " + errMsg );
          }
          console.log( objError );
        }
      }

      fnExecuteScript();
    } else {
      alert( "Please close the currently opened script popups first!" );
    }
    void(0);
  })();