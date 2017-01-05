var element = function(tag, init){
    var e = $('<' + tag + ' />');
    init(e);
    return e;
};

var EventHandler = function(thisPlayer, item)
{
    var self = this;

    var location = 'players';
    var otherPlayer = null;

    var pm;

    self.visiblePlayers = [];
    self.playerPositionInVisiblePlayers = function(player)
    {
        for (var i = 0; i < self.visiblePlayers.length; i++) {
            if (self.visiblePlayers[i] && self.visiblePlayers[i].user_id == player.user_id) {
                return i;
            }
        }
        return -1;
    }
    var requestString = function(player, receiverId,offer)
    {
        return JSON.stringify({"player":player,"receiverId":receiverId,"offer":offer});
    }

    self.sendNewPlayer = function()
    {
        pm.sendData("NEW_PLAYER",requestString(thisPlayer,"",""));
    }
    self.newPlayerReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == thisPlayer.user_id) return;
        //give the new player a second
        setTimeout(function(){self.sendIdentification(thisPlayer);},200);
        setTimeout(function(){self.sendIdentification(thisPlayer);},1000);
        setTimeout(function(){self.sendIdentification(thisPlayer);},2000);
        setTimeout(function(){self.sendIdentification(thisPlayer);},3000);
    }

    self.sendPlayerLeft = function()
    {
        pm.sendData("PLAYER_LEFT",requestString(thisPlayer,"",""));
    }
    self.playerLeftReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == thisPlayer.user_id) return;
        var i = self.playerPositionInVisiblePlayers(data.player);
        if(i != -1) self.visiblePlayers.splice(i,1);
    }

    self.sendIdentification = function()
    {
        pm.sendData("IDENTIFICATION",requestString(thisPlayer,"",""));
    }
    self.identificationReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == thisPlayer.user_id) return;
        var i = self.playerPositionInVisiblePlayers(data.player);
        if(i == -1) self.visiblePlayers.push(data.player);
        else        self.visiblePlayers[i] = data.player;

        self.draw();
    }

    self.sendTradeRequest = function(receiverId)
    {
        pm.sendData("TRADE_REQUEST",requestString(thisPlayer,receiverId,""));
    }
    self.tradeRequestReceived = function(request)
    {
        var data = JSON.parse(request);
        if (data.player.user_id == thisPlayer.user_id) return;
        if (data.receiverId != thisPlayer.user_id) return;
        if (location === 'players') {
            location = 'received';
            otherPlayer = data.player;
            self.draw();
        }
    }

    self.sendTradeAccept = function(receiverId)
    {
        pm.sendData("TRADE_ACCEPT",requestString(thisPlayer,receiverId,""));
    }
    self.tradeAcceptReceived = function(request)
    {
        var data = JSON.parse(request);
        if (data.player.user_id == thisPlayer.user_id) return;
        if (data.receiverId != thisPlayer.user_id) return;
        if (location === 'sent') {
            location = 'accept';
            self.draw();
        } else if (location === 'ready') {
            self.completeTrade();
        }
    }

    self.sendTradeCancel = function(receiverId)
    {
        pm.sendData("TRADE_CANCEL",requestString(thisPlayer,receiverId,""));
    }
    self.tradeCancelReceived = function(request)
    {
        var data = JSON.parse(request);
        if (data.player.user_id == thisPlayer.user_id) return;
        if (data.receiverId != thisPlayer.user_id) return;
        if (!otherPlayer) return;
        if (data.player.user_id != otherPlayer.user_id) return;
        location = 'players';
        otherPlayer = null;
        self.draw();
    }

    self.register = function()
    {
        var events = ["NEW_PLAYER","PLAYER_LEFT","IDENTIFICATION","TRADE_REQUEST","TRADE_ACCEPT","TRADE_CANCEL"];
        var callbacks = [self.newPlayerReceived, self.playerLeftReceived, self.identificationReceived, self.tradeRequestReceived, self.tradeAcceptReceived, self.tradeCancelReceived];

        //USING HARD CODED CONSTANTS FROM 
        // ../../../../config.class.php
        // ../../../../events/pusher_defaults.php
        pm = new PusherMan(pm_config.pusher_key,
            'http://arisgames.org/server/events/' + pm_config.private_default_auth,
            'http://arisgames.org/server/events/' + pm_config.send_url,
            pm_config.private_default_channel,
            events,
            callbacks);

        self.sendNewPlayer();
        self.sendIdentification();
        self.draw();
    }

    self.viewPlayer = function(player)
    {
        location = 'view';
        otherPlayer = player;
        self.draw();
    }

    self.proposeTrade = function()
    {
        self.sendTradeRequest(otherPlayer.user_id);
        location = 'sent';
        self.draw();
    }

    self.cancelPropose = function()
    {
        location = 'players';
        otherPlayer = null;
        self.draw();
    }

    self.cancelTrade = function()
    {
        self.sendTradeCancel(otherPlayer.user_id);
        location = 'players';
        otherPlayer = null;
        self.draw();
    }

    self.acceptTrade = function()
    {
        self.sendTradeAccept(otherPlayer.user_id);
        location = 'ready';
        self.draw();
    }

    self.finishTrade = function()
    {
        self.sendTradeAccept(otherPlayer.user_id);
        self.completeTrade();
    }

    self.completeTrade = function()
    {
        location = 'done';
        // TODO: trade items
        self.draw();
    }

    self.draw = function()
    {
        var content = '';
        if (location === 'players') {
            if (item === null) {
                content = "<p>You don't have an item!</p>";
            } else {
                content = element('div', function(div){
                    div.append($("<p>You have: " + item + "</p>"));
                    div.append($("<p>Players to trade with:</p>"));
                    div.append(element('ul', function(ul){
                        self.visiblePlayers.forEach(function(player){
                            ul.append(element('li', function(li){
                                li.append(element('a', function(a){
                                    a.prop('href', '#');
                                    a.on('click', function(){ self.viewPlayer(player); });
                                    a.text(player.display_name);
                                }));
                            }));
                        });
                    }));
                });
            }
        } else if (location === 'view') {
            content = element('div', function(div){
                div.append("<p>You have: " + item + "</p>");
                div.append(element('p', function(p){
                    p.text(otherPlayer.display_name + ' has: ' + otherPlayer.item);
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.proposeTrade);
                        a.text('Propose trade');
                    }));
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.cancelPropose);
                        a.text('Cancel');
                    }));
                }));
            });
        } else if (location === 'sent') {
            content = element('div', function(div){
                div.append("<p>You have: " + item + "</p>");
                div.append(element('p', function(p){
                    p.text(otherPlayer.display_name + ' has: ' + otherPlayer.item);
                }));
                div.append(element('p', function(p){
                    p.text('Trade request sent.');
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.cancelTrade);
                        a.text('Cancel');
                    }));
                }));
            });
        } else if (location === 'received') {
            content = element('div', function(div){
                div.append("<p>You've received a trade request!</p>");
                div.append("<p>You have: " + item + "</p>");
                div.append(element('p', function(p){
                    p.text(otherPlayer.display_name + ' has: ' + otherPlayer.item);
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.acceptTrade);
                        a.text('Accept trade');
                    }));
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.cancelTrade);
                        a.text('Cancel');
                    }));
                }));
            });
        } else if (location === 'ready') {
            content = element('div', function(div){
                div.append("<p>Waiting for other player...</p>");
                div.append("<p>You have: " + item + "</p>");
                div.append(element('p', function(p){
                    p.text(otherPlayer.display_name + ' has: ' + otherPlayer.item);
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.cancelTrade);
                        a.text('Cancel');
                    }));
                }));
            });
        } else if (location === 'accept') {
            content = element('div', function(div){
                div.append("<p>Your trade request has been accepted!</p>");
                div.append("<p>You have: " + item + "</p>");
                div.append(element('p', function(p){
                    p.text(otherPlayer.display_name + ' has: ' + otherPlayer.item);
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.finishTrade);
                        a.text('Finish trade');
                    }));
                }));
                div.append(element('p', function(p){
                    p.append(element('a', function(a){
                        a.prop('href', '#');
                        a.on('click', self.cancelTrade);
                        a.text('Cancel');
                    }));
                }));
            });
        }
        $('#trade-screen').html(content);
    }
}

