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
    var connectedPlayerId = 0;
    var connectedPlayerTotalQty = 0;
    var connectedPlayerOfferQty = 0;

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

                    alert('recvd');

                    var i = eh.playerPositionInVisiblePlayers(data.player);
                    if(i == -1) eh.visiblePlayers.push(data.player);
                    else        eh.visiblePlayers[i] = data.player;
                }
                eh.tradeRequestReceived = function(request)
                {
                    if(request.receiverId != ftm.player.playerId) return;
                    if(connectedPlayerId) return;

                    connectedPlayerId = request.player.playerId;
                    connectedPlayerTotalQty = request.inventory;
                    var inv = [];
                    for(var i = 0; i < ftm.items.length; i++)
                        if(ftm.items[i].qty > 0) inv.push({"itemId":ftm.items[i].itemId,"qty":ftm.items[i].qty});
                    eh.sendTradeAccept(ftm.player, connectedPlayerId, inv);

                    console.log(connectedPlayerId);
                    console.log(connectedPlayerTotalQty);
                    console.log(inv);

                    formatClerkTrade();
                }
                eh.tradeAcceptReceived = function(request)
                {
                    //should never get this
                }
                eh.alterOfferReceived = function(request)
                {
                    if(request.receiverId != ftm.player.playerId) return;
                }
                eh.tradeReadyReceived = function(request)
                {
                    if(request.receiverId != ftm.player.playerId) return;
                }

                eh.register();
                eh.sendNewPlayer(ftm.player);
                eh.sendIdentification(ftm.player);

                formatClerkLounge();
                ftv.displayGuruWithMessage("Find a <b>trapper</b> looking to trade! Then, <b>select the item</b> you would like to trade. Once you and <b>your partner</b> have agreed on a trade, <b>smack your devices together</b> to make the trade!");
                ftv.displayLounge();
            }
            else //if on harvest page
            {
                formatClerkGet();
                ftv.displayGet();
            }
        }
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

    function formatClerkLounge()
    {
        //nothing to do?
    }

    function formatClerkTrade()
    {
        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;Goal: 20";

        document.getElementById('clerktradepool').innerHTML = "";
        for(var i = 0; i < ftm.items.length; i++)
            if(ftm.items[i].qty > 0) document.getElementById('clerktradepool').appendChild(getTradeCell(ftm.items[i]));

        if(ftm.qtyNonPeltItems() == 0) ftv.currentTradeBtnView.style.display = 'block';
    }

    function getTradeCell(item)
    {
        var cell = document.createElement('div');
        cell.setAttribute('class','tradecell');
        var img = document.createElement('img');
        img.setAttribute('class','tradecellimg');
        img.src = 'assets/'+item.imageName;
        var title = document.createElement('div');
        title.setAttribute('class','tradecelltitle');
        title.innerHTML = item.name;
        var qty = document.createElement('div');
        qty.setAttribute('class','tradecellqty');
        qty.innerHTML = "qty owned:"+item.qty;
        cell.appendChild(img);
        cell.appendChild(title);
        cell.appendChild(qty);
        cell.ontouchstart = function() { self.clerkTradeItemSelected(item); };

        return cell;
    }

    function confirmTrade()
    {
        if(!selectedItem) selectedItem = itemNull;
        selectedItem.qty -= 1;
        itemPelt.qty     += data.hunter;

        ARIS.setItemCount(selectedItem.itemId,selectedItem.qty);
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
        else if(selectedItem.peltCost >= data.hunter)   ftv.displayGuruWithMessage("Hey! We're trying to make a <b>profit</b>! You bought that <b>"+selectedItem.name+"</b> for <b>"+selectedItem.peltCost+" pelts</b>, and just traded it for only <b>"+data.hunter+" pelts</b>! Try to get <b>more pelts</b> for your items!");
        else if(selectedItem.peltCost+1 == data.hunter) ftv.displayGuruWithMessage("Good work! You made a <b>profit</b> on that last trade! You bought that <b>"+selectedItem.name+"</b> for <b>"+selectedItem.peltCost+" pelts</b>, and just traded it for <b>"+data.hunter+" pelts</b>! See if you can get even <b>more pelts</b> for your items!");
        else if(selectedItem.peltCost < data.hunter)    ftv.displayGuruWithMessage("Wow! Great job trading! You bought that <b>"+selectedItem.name+"</b> for only <b>"+selectedItem.peltCost+" pelts</b>, and just traded it for <b>"+data.hunter+" pelts</b>! Keep this up!");

        selectedItem = null;
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

            ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;

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

    var selectedItem = null;
    self.clerkTradeItemSelected = function(item)
    {
        selectedItem = item;
        document.getElementById('clerktradeitem').src = 'assets/'+item.imageName;
    }

}

