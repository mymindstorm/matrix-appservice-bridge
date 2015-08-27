"use strict";

/**
 * @constructor
 */
function Bridge() {

}

Bridge.prototype.setMatrixSide = function(side) {
    // HS url, AS token, localpart, domain
};

Bridge.prototype.setRemoteSide = function(side) {

};

Bridge.prototype.run = function() {
    // listen on AS port
    // invoke onRun on remote side
};

/*
NOTES:

Two flows to consider:
 - Incoming remote events to outgoing matrix events
 - Incoming matrix events to outgoing remote events

Four API designs involved:
 - Asking the remote side to send an event
 - Asking the matrix side to send an event [Intent class]
 - Notification of new remote events
 - Notification of new matrix events [onAliasQuery, onEvent]

How much should we wrest control of the remote side from the developer? This
would mean forcing the dev to write a class meeting some interface which the
Bridge class can use to glue everything together. This interface needs to
specify the remaining 2 API designs. The interface needs to be able to map
arbitrary data to matrix data (rooms, users, etc).

Provide two modes of operation? One saying "hey meet this interface and we'll do
it all for you", the other being "here's the onXXX and Intent class, have fun!".

Interface operation:
  {
    onIncomingremoteEvent: function(event) {} <--they implement these functions?
    sendremoteEvent: function(event) {} <-----------`
  }

Main problem is that we need to know how to map from their IDs to matrix IDs and
know the capabilities of the network (e.g. do they understand invites?).

Make them implement their own "Intent" class? This will dissolve into just:
  onInvite(function(event) {
    var mapped = map(event);
    intent.invite(mapped);
  }
Perhaps with virtual user suppression included for free.

*/

module.exports = Bridge;