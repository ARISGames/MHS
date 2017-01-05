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
        if(data.player.user_id == thisPlayer.user_id) return;
    }

    self.sendTradeAccept = function(receiverId)
    {
        pm.sendData("TRADE_ACCEPT",requestString(thisPlayer,receiverId,""));
    }
    self.tradeAcceptReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == thisPlayer.user_id) return;
    }

    self.sendTradeCancel = function(receiverId)
    {
        pm.sendData("TRADE_CANCEL",requestString(thisPlayer,receiverId,""));
    }
    self.tradeCancelReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == thisPlayer.user_id) return;
    }

    self.sendTradeReady = function(receiverId, offer)
    {
        pm.sendData("TRADE_READY",requestString(thisPlayer,receiverId,offer));
    }
    self.tradeReadyReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == thisPlayer.user_id) return;
    }

    self.register = function()
    {
        var events = ["NEW_PLAYER","PLAYER_LEFT","IDENTIFICATION","TRADE_REQUEST","TRADE_ACCEPT","TRADE_CANCEL","TRADE_READY"];
        var callbacks = [self.newPlayerReceived, self.playerLeftReceived, self.identificationReceived, self.tradeRequestReceived, self.tradeAcceptReceived, self.tradeCancelReceived, self.tradeReadyReceived];

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

    self.draw = function()
    {
        var content = '';
        if (location === 'players') {
            if (item === null) {
                content = "<p>You don't have an item!</p>";
            } else {
                content = $("<div />");
                content.append($("<p>You have: " + item + "</p>"));
                content.append($("<p>Players to trade with:</p>"));
                var ul = $("<ul />");
                self.visiblePlayers.forEach(function(player){
                    var li = $("<li />");
                    li.text(JSON.stringify(player));
                    ul.append(li);
                });
                content.append(ul);
            }
        }
        $('#trade-screen').html(content);
    }
}

