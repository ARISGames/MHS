var EventHandler = function()
{
    var self = this;

    self.visiblePlayers = [];
    self.playerPositionInVisiblePlayers = function(player)
    {
        for(var i = 0; i < self.visiblePlayers.length; i++)
            if(self.visiblePlayers[i] && self.visiblePlayers[i].playerId == player.playerId) return i;
        return -1;
    }
    var requestString = function(player, receiverId, inventory, offer)
    {
        return JSON.stringify({"player":player,"receiverId":receiverId,"inventory":inventory,"offer":offer});
    }

    self.sendNewPlayer = function(player)
    {
        pm.sendData("NEW_PLAYER",requestString(player,"","",""));
    }
    self.newPlayerReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.playerId == ftm.player.playerId) return;
        setTimeout(function(){self.sendIdentification(ftm.player);},200); //give the new player a second
    }

    self.sendPlayerLeft = function(player)
    {
        pm.sendData("PLAYER_LEFT",requestString(player,"","",""));
    }
    self.playerLeftReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.playerId == ftm.player.playerId) return;
        var i = self.playerPositionInVisiblePlayers(data.player);
        if(i != -1) self.visiblePlayers.splice(i,1);
    }

    self.sendIdentification = function(player)
    {
        pm.sendData("IDENTIFICATION",requestString(player,"","",""));
    }
    self.identificationReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.playerId == ftm.player.playerId) return;
        var i = self.playerPositionInVisiblePlayers(data.player);
        if(i != -1) self.visiblePlayers.push(data.player);
        else        self.visiblePlayers[i] = data.player;
    }

    self.sendTradeRequest = function(player, receiverId, inventory)
    {
        pm.sendData("TRADE_REQUEST",requestString(player,receiverId,inventory,""));
    }
    self.tradeRequestReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.playerId == ftm.player.playerId) return;
    }

    self.sendTradeAccept = function(player, receiverId, inventory)
    {
        pm.sendData("TRADE_ACCEPT",requestString(player,receiverId,inventory,""));
    }
    self.tradeAcceptReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.playerId == ftm.player.playerId) return;
    }

    self.sendAlterOffer = function(player, receiverId, offer)
    {
        pm.sendData("ALTER_OFFER",requestString(player,receiverId,"",offer));
    }
    self.alterOfferReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.playerId == ftm.player.playerId) return;
    }

    self.sendTradeReady = function(player, receiverId, inventory, offer)
    {
        pm.sendData("TRADE_READY",requestString(player,receiverId,inventory,offer));//also include inventory, offer
    }
    self.tradeReadyReceived = function(request)
    {
        var data = JSON.parse(request);
        if(data.player.playerId == ftm.player.playerId) return;
    }

    self.register = function()
    {
        var events = ["NEW_PLAYER", "PLAYER_LEFT","IDENTIFICATION","TRADE_REQUEST","TRADE_ACCEPT","ALTER_OFFER","TRADE_READY"];
        var callbacks = [self.newPlayerReceived, self.playerLeftReceived, self.identificationReceived, self.tradeRequestReceived, self.tradeAcceptReceived, self.alterOfferReceived, self.tradeReadyReceived];

        //USING HARD CODED CONSTANTS FROM 
        // ../../../server/config.class.php
        // ../../../server/events/pusher_defaults.php
        pm = new PusherMan('79f6a265dbb7402a49c9', 
            'http://dev.arisgames.org/server/events/auths/private_auth.php', 
            'http://dev.arisgames.org/server/events/send.php', 
            'private-default-channel', 
            events, 
            callbacks);
    }
}

