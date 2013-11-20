var ClerkGame = function()
{
    var self = this;

    var clerkItemGet     = document.getElementById("clerkitemget");
    var sellerDialog     = document.getElementById("sellerdialog");
    var buyButton        = document.getElementById('buybutton');
    var buyButtonText    = document.getElementById("sellerbuttontext");
    var clerkGuruButton  = document.getElementById("clerkgurubutton");

    //trade vars
    var itemOffering = -1;
    var connectedPlayer = null;
    var connectedPlayerTotalQty = 0;
    var connectedPlayerOfferQty = 0;
    var imReady = false;
    var theyreReady = false;

    self.init = function()
    {
        if(ftm.currentLevel == 0)
        {
            ftv.displayIntro();
            ARIS.setItemCount(itemPelt.itemId,15);
            ARIS.setItemCount(roleClerk.roleId, 1);
            ARIS.setItemCount(roleHunter.roleId, 0);
        }
        else //Not first time
        {
            if(ftm.webPageItem == itemNull) //if on trade page
            {
                eh.identificationReceived = function(request)
                {
                    var data = JSON.parse(request);
                    //alert("Me:"+ftm.player.displayname+"("+ftm.player.playerId+") They:"+data.player.displayname+"("+data.player.playerId+")");
                    if(data.player.playerId == ftm.player.playerId) return;
                    if(data.player.role == "CLERK") return;

                    var i = eh.playerPositionInVisiblePlayers(data.player);
                    if(i == -1) eh.visiblePlayers.push(data.player);
                    else        eh.visiblePlayers[i] = data.player;
                }
                eh.playerLeftReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.player.playerId == ftm.player.playerId) return;
                    var i = eh.playerPositionInVisiblePlayers(data.player);
                    if(i != -1) eh.visiblePlayers.splice(i,1);
                    if(data.player.playerId == connectedPlayer.playerId)
                    {
                        cleanConnection();
                        formatClerkLounge();
                    }
                }
                eh.playerPingReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.player.playerId == ftm.player.playerId) return;
                    if(!connectedPlayer || data.player.playerId != connectedPlayer.playerId) return;
                    timeSinceLastInteraction = new Date();
                }
                eh.tradeRequestReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(connectedPlayer) return;

                    connectedPlayer = data.player;
                    connectedPlayerTotalQty = data.inventory;
                    var inv = [];
                    for(var i = 0; i < items.length; i++)
                        if(items[i].qty > 0 && items[i].itemId != itemPelt.itemId) inv.push(items[i].itemId);
                    eh.sendTradeAccept(ftm.player, connectedPlayer.playerId, inv);

                    formatClerkTrade();
                    ftv.displayTrade();
                    startDoomsdayTimer();
                }
                eh.tradeAcceptReceived = function(request)
                {
                    //should never get this
                }
                eh.alterOfferReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(!connectedPlayer || data.player.playerId != connectedPlayer.playerId) return;
                    connectedPlayerOfferQty = data.offer;
                    formatClerkClientOffer();
                    imReady = false;
                    theyreReady = false;
                    formatClerkReady();
                    timeSinceLastInteraction = new Date();
                }
                eh.tradeReadyReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(!connectedPlayer || data.player.playerId != connectedPlayer.playerId) return;
                    if(data.offer != connectedPlayerOfferQty)
                        eh.alterOfferReceived(request);
                    theyreReady = true;

                    if(imReady) confirmTrade();
                    formatClerkReady();
                    timeSinceLastInteraction = new Date();
                }

                eh.register();
                eh.sendNewPlayer(ftm.player);
                eh.sendIdentification(ftm.player);
                window.addEventListener('beforeunload', function() { eh.sendPlayerLeft(ftm.player); }, false);

                formatClerkLounge();
                ftv.displayGuruWithMessage("We've <b>opened our shop</b>! Now, we simply wait for a <b>trapper</b> looking to trade! (Look around to see if any of your friends are <b>trappers</b> who need help getting to <b>level 2</b>.)");
                ftv.displayLounge();
            }
            else //if on harvest page
            {
                formatClerkGet();
                ftv.displayGet();
            }
        }
    }

    var timeSinceLastInteraction = new Date();
    var doomsdayShouldTick = false;
    function startDoomsdayTimer()
    {
        timeSinceLastInteraction = new Date();
        doomsdayShouldTick = true;
        tickDoomsday();
    }
    function tickDoomsday()
    {
        eh.sendPlayerPing(ftm.player, connectedPlayer.playerId);
        if((new Date() - timeSinceLastInteraction)/1000 > 10)
        {
            cleanConnection();
            formatClerkLounge();
            ftv.displayLounge();
        }
        if(doomsdayShouldTick)
            setTimeout(tickDoomsday, 5000);
    }

    var formatClerkGet = function()
    {
        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        clerkItemGet.src = "assets/"+ftm.webPageItem.imageName;
        if(ftm.webPageItem != itemPelt)
        {
            ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;Cost: "+ftm.webPageItem.peltCost;
            sellerDialog.innerHTML = "I've got a <b>"+ftm.webPageItem.name+"</b> in stock... I'd be willing to part with it for the price of <b>"+ftm.webPageItem.peltCost+" pelts</b>. Whad'ya say?";
            buyButtonText.innerHTML = "Buy "+ftm.webPageItem.name;
        }
        else
        {
            sellerDialog.innerHTML = "These <b>Beaver Pelts</b> aren't for sale. Scan something <b>behind the clerk's counter</b> to stock the post with European goods...";
            buyButtonText.innerHTML = "Continue ";
            buyButton.ontouchstart = function() { ARIS.exitToScanner("Scan a clerk item behind the fur trade counter!"); };
        }
    }

    function cleanConnection()
    {
        doomsdayShouldTick = false;
        itemOffering = -1;
        connectedPlayer = null;
        connectedPlayerTotalQty = 0;
        connectedPlayerOfferQty = 0;
        eh.visiblePlayers = [];
    }

    function formatClerkLounge()
    {
        //nothing to do?
    }

    function formatClerkTrade()
    {
        ftv.currentTradeClientImageView.src = connectedPlayer.photoURL;
        ftv.currentTradeClientNameView.innerHTML = connectedPlayer.displayname;

        document.getElementById('clerktradeclientpoolimg').src = 'assets/'+itemPelt.imageName;
        document.getElementById('clerktradeclientpoolqty').innerHTML = "x"+connectedPlayerTotalQty;

        document.getElementById('clerktradeclientofferimg').src = 'assets/'+itemPelt.imageName;
        formatClerkClientOffer();

        document.getElementById('clerktradepool').innerHTML = "";
        var offset = 0;
        for(var i = 0; i < items.length; i++)
        {
            if(items[i].qty > 0 && items[i].itemId != itemPelt.itemId)
            {
                var itemCell = getTradeCell(items[i]);
                itemCell.style.left = offset+"px";
                offset+=90;
                document.getElementById('clerktradepool').appendChild(itemCell);
            }
        }
    }

    function formatClerkClientOffer()
    {
        document.getElementById('clerktradeclientofferqty').innerHTML = "x"+connectedPlayerOfferQty;
    }

    function formatClerkOffer()
    {
        document.getElementById('clerktradeofferimg').src = 'assets/'+ftm.itemForItemId(itemOffering).imageName;
    }

    function getTradeCell(item)
    {
        var cell = document.createElement('div');
        cell.setAttribute('class','tradecell');
        var img = document.createElement('img');
        img.setAttribute('class','tradecellimg');
        img.src = 'assets/'+item.imageName;
        var label = document.createElement('div');
        label.setAttribute('class','tradecelllabel');
        label.innerHTML = item.name+" x"+item.qty;
        cell.appendChild(img);
        cell.appendChild(label);
        cell.ontouchstart = function() { clerkTradeItemSelected(item); };

        return cell;
    }

    function confirmTrade()
    {
        imReady = false;
        theyreReady = false;

        var item = ftm.itemForItemId(itemOffering);
        item.qty -= 1;
        itemPelt.qty += connectedPlayerOfferQty;

        ARIS.setItemCount(item.itemId,item.qty);
        ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

        if(itemPelt.qty >= 20)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(2), 1);
            ARIS.setItemCount(ftm.levelIdForLevel(1), 0);
            ftm.currentLevel = 3;
            clerkGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
            ftv.displayGuruWithMessage("Level 2 complete. Excellent work, clerk. You'll be climbing the company ladder in no time.");
        }
        else if(ftm.qtyNonPeltItems() == 0)
        {
            ftv.displayGuruWithMessage("What have you done!?! You've traded away all your items and haven't made even <b>20 pelts</b>! You'll have to <b>go back and buy more items with your pelts</b>. Then, make sure to <b>trade for a profit</b>!");
            clerkGuruButton.ontouchstart = function() { ARIS.exitToScanner("Collect more items to trade!"); };
        }
        else if(item.peltCost >= connectedPlayerOfferQty)   ftv.displayGuruWithMessage("Hey! We're trying to make a <b>profit</b>! You bought that <b>"+item.name+"</b> for <b>"+item.peltCost+" pelts</b>, and just traded it for only <b>"+connectedPlayerOfferQty+" pelts</b>! Try to get <b>more pelts</b> for your items!");
        else if(item.peltCost+1 == connectedPlayerOfferQty) ftv.displayGuruWithMessage("Good work! You made a <b>profit</b> on that last trade! You bought that <b>"+item.name+"</b> for <b>"+item.peltCost+" pelts</b>, and just traded it for <b>"+connectedPlayerOfferQty+" pelts</b>! See if you can get even <b>more pelts</b> for your items!");
        else if(item.peltCost < connectedPlayerOfferQty)    ftv.displayGuruWithMessage("Wow! Great job trading! You bought that <b>"+item.name+"</b> for only <b>"+item.peltCost+" pelts</b>, and just traded it for <b>"+connectedPlayerOfferQty+" pelts</b>! Keep this up!");

        connectedPlayerOfferQty = 0;
        itemOffering = -1;
        formatClerkTrade();
    }

    self.clerkBuyConfirmed = function()
    {
        if(itemPelt.qty < ftm.webPageItem.peltCost)
        {
            sellerDialog.innerHTML = "Hmmm... this costs more <b>pelts</b> than you currently have. <b>Try another item.<b/>";
        }
        else
        {
            if(ftm.curentLevel == 1)
                sellerDialog.innerHTML = "Thanks! Look around and <b>spend your "+itemPelt.qty-ftm.webPageItem.peltCost+" remaining beaver pelts</b> on <b>more items for the store</b>- I'll take care of selling the pelts for cash.";
            else
                sellerDialog.innerHTML = "Thanks! I'll take care of selling the pelts for cash.";

            ftm.webPageItem.qty += 1;//500;
            itemPelt.qty        -= ftm.webPageItem.peltCost;

            ARIS.setItemCount(itemPelt.itemId,       itemPelt.qty);
            ARIS.setItemCount(ftm.webPageItem.itemId,ftm.webPageItem.qty);

            ftv.displaydelta(itemPelt.name,-1*ftm.webPageItem.peltCost);

            if(ftm.currentLevel == 1 && itemPelt.qty == 0)
            {
                ARIS.setItemCount(ftm.levelIdForLevel(1), 1);
                ftm.currentLevel = 2;
                ftv.displayGuruWithMessage("Good work! Now that the post is stocked, we should <b>find a local trapper</b> to trade our stock for <b>pelts</b>!");
                clerkGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
            }
        }
        buyButtonText.innerHTML = "Continue ";
        buyButton.ontouchstart = function() { ARIS.exitToScanner("Scan a clerk item behind the fur trade counter!"); };
    }

    var clerkTradeItemSelected = function(item)
    {
        itemOffering = item.itemId;
        formatClerkOffer();
        eh.sendAlterOffer(ftm.player, connectedPlayer.playerId, itemOffering);
        theyreReady = false;
        imReady = false;
        formatClerkReady();
    }

    function formatClerkReady()
    {
        if(imReady && !theyreReady) document.getElementById('clerktradebuttontext').innerHTML = "Waiting for Hunter...";
        if(!imReady && theyreReady) document.getElementById('clerktradebuttontext').innerHTML = "Make Trade!";
        if(!imReady && !theyreReady) document.getElementById('clerktradebuttontext').innerHTML = "Ready to Trade";
    }

    self.readyTouched = function()
    {
        imReady = true;
        eh.sendTradeReady(ftm.player, connectedPlayer.playerId, itemOffering);
        if(theyreReady) confirmTrade();
        formatClerkReady();
    }
}

