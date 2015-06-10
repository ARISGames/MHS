var EventHandler = function()
{
    var self = this;

    self.visiblePlayers = [];
    self.playerPositionInVisiblePlayers = function(player)
    {
        for(var i = 0; i < self.visiblePlayers.length; i++)
            if(self.visiblePlayers[i] && self.visiblePlayers[i].user_id == player.user_id) return i;
        return -1;
    }
    var requestString = function(player, receiverId,offer)
    {
        return JSON.stringify({"player":player,"receiverId":receiverId,"offer":offer});
    }

    self.sendNewPlayer = function(player)
    {
        pm.sendData("NEW_PLAYER",requestString(player,"",""));
    }
    self.newPlayerReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
        setTimeout(function(){self.sendIdentification(ftm.player);},200); //give the new player a second
    }

    self.sendPlayerLeft = function(player)
    {
        pm.sendData("PLAYER_LEFT",requestString(player,"",""));
    }
    self.playerLeftReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
        var i = self.playerPositionInVisiblePlayers(data.player);
        if(i != -1) self.visiblePlayers.splice(i,1);
    }

    self.sendPlayerPing = function(player, receiverId)
    {
        pm.sendData("PLAYER_PING",requestString(player,receiverId,""));
    }
    self.playerPingReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
    }

    self.sendIdentification = function(player)
    {
        pm.sendData("IDENTIFICATION",requestString(player,"",""));
    }
    self.identificationReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
        var i = self.playerPositionInVisiblePlayers(data.player);
        if(i != -1) self.visiblePlayers.push(data.player);
        else        self.visiblePlayers[i] = data.player;
    }

    self.sendTradeRequest = function(player, receiverId)
    {
        pm.sendData("TRADE_REQUEST",requestString(player,receiverId,""));
    }
    self.tradeRequestReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
    }

    self.sendTradeAccept = function(player, receiverId)
    {
        pm.sendData("TRADE_ACCEPT",requestString(player,receiverId,""));
    }
    self.tradeAcceptReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
    }

    self.sendAlterOffer = function(player, receiverId, offer)
    {
        pm.sendData("ALTER_OFFER",requestString(player,receiverId,offer));
    }
    self.alterOfferReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
    }

    self.sendTradeReady = function(player, receiverId, offer)
    {
        pm.sendData("TRADE_READY",requestString(player,receiverId,offer));
    }
    self.tradeReadyReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.user_id == ftm.player.user_id) return;
    }

    self.register = function()
    {
        var events = ["NEW_PLAYER", "PLAYER_LEFT","PLAYER_PING","IDENTIFICATION","TRADE_REQUEST","TRADE_ACCEPT","ALTER_OFFER","TRADE_READY"];
        var callbacks = [self.newPlayerReceived, self.playerLeftReceived, self.playerPingReceived, self.identificationReceived, self.tradeRequestReceived, self.tradeAcceptReceived, self.alterOfferReceived, self.tradeReadyReceived];

        //USING HARD CODED CONSTANTS FROM 
        // ../../../../config.class.php
        // ../../../../events/pusher_defaults.php
        pm = new PusherMan(pm_config.pusher_key,
            'http://arisgames.org/server/events/' + pm_config.private_default_auth,
            'http://arisgames.org/server/events/' + pm_config.send_url,
            pm_config.private_default_channel,
            events,
            callbacks);
    }
}

