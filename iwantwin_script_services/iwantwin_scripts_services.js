javascript:/**CREATED BY: iwantwin, twscripts@iwantwin.nl at 20-04-2016 MAY NOT BE DISTRIBUTED WITHOUT THIS COMMENT**/
(function () {
  /**
   * This script will supply the Iwantwin Scripting Services, in it's current version only using the ISS.ActionManager
   * to manage the amount of game actions that may happen during a certain interval. It's goal is to be very transparent
   * to the user, and to handle most of the concurrency logic for every scripter in the community that uses this script.
   */
  var version = '1.0.0';
  var abortionTimeout = 30000;

  var getNumericVersion = function ( pVersion ) {
    var result = 0;
    var versionParts = pVersion.split( '.' );
    versionParts.reverse();
    var initialVersionIncrementor = 10000;
    var versionIncrementor = initialVersionIncrementor;
    for ( var idx in versionParts ) {
      if ( versionParts.hasOwnProperty( idx ) ) {
        var versionPart = versionParts[idx];
        result += parseInt( versionPart ) * versionIncrementor;
        versionIncrementor = versionIncrementor * initialVersionIncrementor;
      }
    }
    return result;
  };

  if ( window.hasOwnProperty( 'ISS' ) && window.hasOwnProperty( 'ISSVersion' ) && getNumericVersion( window['ISSVersion'] ) >= getNumericVersion( version ) ) {
    setTimeout( function () {
      $( document ).trigger( 'ISSLoaded' );
    }, 1 );
  } else {
    window['ISS'] = new function () {
      var constructor = function () {
        window['ISSVersion'] = version;
        setTimeout( function () {
          $( document ).trigger( 'ISSLoaded' );
        }, 1 );
      };

      var self = this;

      self.ActionManager = new (function ( ISS ) {
        var self = this;
        var actionsPerInterval = 4;
        var actionInterval = 1050; //Millisecond

        //Workers
        var workers = {};
        var emptyWorkers = [];

        for ( var i = 1; i <= actionsPerInterval; i++ ) {
          workers[i] = {
            lastActionStarted: 0,
            lastActionFinished: 0,
            timeoutId: null
          };
          emptyWorkers.push( i );
        }

        //Queue's
        var queue = [];

        var scheduleNextQueueProcess = function () {
          var now = new Date().getTime();
          for ( var workerId in workers ) {
            if ( workers.hasOwnProperty( workerId ) ) {
              var worker = workers[workerId];
              if ( worker['timeoutId'] == null ) {
                if ( now - worker['lastActionFinished'] > actionInterval ) {
                  processQueue();
                } else {
                  var delay = actionInterval - (now - worker['lastActionFinished']);
                  //Closure to make workerId immutable
                  (function ( pWorkerId ) {
                    workers[pWorkerId]['timeoutId'] = setTimeout( function () {
                      workers[pWorkerId]['timeoutId'] = null;
                      processQueue();
                    }, delay );
                  })( workerId );
                }
              }
            }
          }
        };

        var processQueue = function () {
          if ( queue.length > 0 && emptyWorkers.length > 0 ) {
            var workerId = emptyWorkers.shift();
            //Worker reserved
            var action = queue.shift();
            if ( typeof( action ) != 'undefined' ) {
              if ( workers[workerId]['timeoutId'] != null ) {
                clearTimeout( workers[workerId]['timeoutId'] );
                workers[workerId]['timeoutId'] = null;
              }

              var startAction = new Date();
              var abortionTimeoutId = setTimeout( function () {
                if ( action.hasOwnProperty( 'abort' ) && typeof( action['abort'] ) == 'function' ) {
                  action['abort']();
                  console.warn( '\'' + action['script'] + '\' didn\'t implement it\'s actions correctly, and caused huge delays for all other actions. This message was triggered after ' + (abortionTimeout / 1000) + ' seconds of wasting your time. Please contact the maker of \'' + action['script'] + '\' to fix this issue.' );
                } else {
                  alert( '\'' + action['script'] + '\' didn\'t implement it\'s actions correctly, and caused huge delays for all other actions. This message was triggered after ' + (abortionTimeout / 1000) + ' seconds of wasting your time. Please contact the maker of \'' + action['script'] + '\' to fix this issue.' );
                  console.warn( '\'' + action['script'] + '\' didn\'t implement it\'s actions correctly, and caused huge delays for all other actions. This message was triggered after ' + (abortionTimeout / 1000) + ' seconds of wasting your time. Please contact the maker of \'' + action['script'] + '\' to fix this issue.' );
                }
                workers[workerId]['lastActionFinished'] = new Date().getTime();
                emptyWorkers.push( workerId );
                scheduleNextQueueProcess();
              }, abortionTimeout );
              action['method']( function () {
                clearTimeout( abortionTimeoutId );
                var endAction = new Date();
                //Set stats for last worker
                workers[workerId]['lastActionStarted'] = startAction.getTime();
                workers[workerId]['lastActionFinished'] = endAction.getTime();
                //Reset the worker availability
                emptyWorkers.push( workerId );

                //Call the callback async so the action manager can continue at the highest pace possible
                setTimeout( function () {
                  action['callback']();
                }, 1 );

                scheduleNextQueueProcess();
              } );
            }
          }
        };

        /**
         * This method cancels all queued actions. Useful when you want to leave the page without having the  "to many requests" error.
         * @param {function} afterCancel
         */
        self.cancelQueuedActions = function ( afterCancel ) {
          if ( typeof(afterCancel) != 'function' ) {
            afterCancel = function () {};
          }
          queue = [];
          self.performAction( 'ISS', 'Cancel queue callback', function ( callback ) {
            callback();
          }, function () {
            afterCancel();
          }, function () {
          } );
        };

        /**
         * @param {string} scriptName - Name of your script
         * @param {string} actionName - Name of the action you are doing
         * @param {function(callback)} actionMethod - Must implement the callback() function, otherwise action will not be executed.
         * @param {function} actionDone - Called when your action finished (according to your callback function)
         * @param {function} [actionAborted] - Called when your action was cancelled.
         * @param {string} [overrideCallbackUsageWarning] - Called when your action was cancelled.
         */
        self.performAction = function ( scriptName, actionName, actionMethod, actionDone, actionAborted,
                                        overrideCallbackUsageWarning ) {
          if ( typeof( scriptName ) == 'string' ) {
            if ( typeof( actionName ) == 'string' ) {
              if ( typeof( actionMethod ) == 'function' ) {
                if ( typeof( actionDone ) == 'function' ) {
                  var methodString = String( actionMethod );
                  if ( methodString.indexOf( 'callback();' ) > 0 || overrideCallbackUsageWarning == '\x6F\x76\x65\x72\x72\x69\x64\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B\x55\x73\x61\x67\x65\x57\x61\x72\x6E\x69\x6E\x67' ) {
                    var callbacks = methodString.match( /callback\(\)/g );
                    var ajaxes = methodString.match( /\$\.ajax\(/g );
                    if ( ajaxes == null || ( ajaxes.length * 2 ) <= callbacks.length ) {
                      var action = {};
                      action['script'] = scriptName;
                      action['name'] = actionName;
                      action['method'] = actionMethod;
                      action['callback'] = actionDone;
                      action['abort'] = actionAborted;
                      action['registered'] = new Date();
                      queue.push( action );
                      processQueue();
                    } else {
                      console.error( 'Iwantwin Script Service Error:' );
                      console.error( 'You didn\'t cover all paths in your asynchronous calls with the callback. Make sure all paths are covered with the callback() call.' );
                      console.error( 'Pay special attention to each $.ajax call, it has both a done and fail callback, you must handle both.' );
                    }
                  } else {
                    console.log( overrideCallbackUsageWarning, '\x6F\x76\x65\x72\x72\x69\x64\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B\x55\x73\x61\x67\x65\x57\x61\x72\x6E\x69\x6E\x67', overrideCallbackUsageWarning == '\x6F\x76\x65\x72\x72\x69\x64\x65\x43\x61\x6C\x6C\x62\x61\x63\x6B\x55\x73\x61\x67\x65\x57\x61\x72\x6E\x69\x6E\x67' );
                    console.error( 'Iwantwin Script Service Error:' );
                    console.error( 'You should never run ISS.ActionManager.performAction without using the callback provided in the actionMethod.' );
                    console.error( 'Contact twscripts@iwantwin.nl for help on this subject, or refer to the Iwantwin Script Service forum topic.' );
                    console.group( 'Example usage of this method:' );
                    console.log( '    ISS.ActionManager.performAction( \'Example action - synchronous\', function ( callback ) {' );
                    console.log( '      console.log( \'Do what you want to do, then, when it\\\'s finished, call the callback.\' );' );
                    console.log( '      callback(); //This method will let the actionmanager know when the method is done.' );
                    console.log( '    }, function () {' );
                    console.log( '      //this method is executed in your code, and can be used to change things for the user' );
                    console.log( '      console.log( \'At this point, the call is actually executed :)\' );' );
                    console.log( '    } );' );
                    console.log( '    ' );
                    console.log( '    ISS.ActionManager.performAction( \'Example action - asynchronous\', function ( callback ) {' );
                    console.log( '      var promise = $.ajax( {' );
                    console.log( '                              url: \'http://test.com\',' );
                    console.log( '                              data: {' );
                    console.log( '                                test: \'Some test POST data.\'' );
                    console.log( '                              }' );
                    console.log( '                            } );' );
                    console.log( '      promise.done( function () {' );
                    console.log( '        console.log( \'Yeah, our ajax call finished!\' );' );
                    console.log( '        callback(); //This method will let the actionmanager know when the method is done.' );
                    console.log( '      } );' );
                    console.log( '      promise.fail( function () {' );
                    console.log( '        console.log( \'Mah, ajax call failed.\' );' );
                    console.log( '        callback(); //This method will let the actionmanager know when the method is done.' );
                    console.log( '      } );' );
                    console.log( '      //Don\'t execute the callback here, since your code is actually using asynchronous call endings.' );
                    console.log( '    }, function () {' );
                    console.log( '      //this method is executed in your code, and can be used to change things for the user' );
                    console.log( '      console.log( \'At this point, the call is actually executed :)\' );' );
                    console.log( '    } );' );
                    console.groupEnd();
                  }
                } else {
                  console.error( 'Iwantwin Script Service Error:' );
                  console.error( 'actionDone provided to ISS.ActionManager.performAction is not of type function: ' + actionDone );
                }
              } else {
                console.error( 'Iwantwin Script Service Error:' );
                console.error( 'actionMethod provided to ISS.ActionManager.performAction is not of type function: ' + actionMethod );
              }
            } else {
              console.error( 'Iwantwin Script Service Error:' );
              console.error( 'actionName provided to ISS.ActionManager.performAction is not of type string: ' + actionMethod );
            }
          } else {
            console.error( 'Iwantwin Script Service Error:' );
            console.error( 'scriptName provided to ISS.ActionManager.performAction is not of type string: ' + scriptName );
          }
        };

      })( self );

      constructor();
    };
  }
})();