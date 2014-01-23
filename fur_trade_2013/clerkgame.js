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
    var connectedPlayerOfferQty = 0;
    var imReady = false;
    var theyreReady = false;

    self.init = function()
    {
        if(ftm.currentLevel == 0)
        {
            ftv.displayIntro();
            ARIS.setItemCount(itemPelt.itemId,10);
            ARIS.setItemCount(roleClerk.roleId, 1);
            ARIS.setItemCount(roleHunter.roleId, 0);
        }
        else //Not first time
        {
            if(ftm.webPageItem == itemNull) //if on trade page
            {
                eh.newPlayerReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.player.playerId == ftm.player.playerId) return;
                    //if(connectedPlayer) return;
                    setTimeout(function(){eh.sendIdentification(ftm.player);},200); //give the new player a second
                }
                eh.identificationReceived = function(request)
                {
                    var data = JSON.parse(request);
                    //alert("Me:"+ftm.player.displayname+"("+ftm.player.playerId+") They:"+data.player.displayname+"("+data.player.playerId+")");
                    if(data.player.playerId == ftm.player.playerId) return;
                    if(data.player.role == "clerk") return;

                    var i = eh.playerPositionInVisiblePlayers(data.player);
                    if(i == -1) eh.visiblePlayers.push(data.player);
                    else        eh.visiblePlayers[i] = data.player;

                    formatClerkLounge();
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
                    eh.sendTradeAccept(ftm.player, connectedPlayer.playerId);
                    ftm.player.availability = "busy";
                    eh.sendIdentification(ftm.player);

                    formatClerkTrade();
                    ftv.displayTrade();
                    startDoomsdayTimer();
                    if(ftm.currentLevel == 2)
                        ftv.displayGuruWithMessage("Now that you've got some <b>items</b>, try to sell them to <b>"+connectedPlayer.displayname+"</b> at a <b>profit</b>! Aim to get a total of <b>15 pelts</b>. (If you run out of <b>items</b>, you can always exit to your <b>scanner</b> and purchase more.)");
                }
                eh.tradeAcceptReceived = function(request)
                {
                    //should never get this
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(connectedPlayer) return;

                    connectedPlayer = data.player;
                    ftm.player.availability = "busy";
                    eh.sendIdentification(ftm.player);

                    formatClerkTrade();
                    ftv.displayTrade();
                    startDoomsdayTimer();
                    if(ftm.currentLevel == 2)
                        ftv.displayGuruWithMessage("Now that you've got some <b>items</b>, try to sell them to <b>"+connectedPlayer.displayname+"</b> at a <b>profit</b>! Aim to get a total of <b>15 pelts</b>. (If you run out of <b>items</b>, you can always exit to your <b>scanner</b> and purchase more.)");
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
                ftv.displayGuruWithMessage("We've <b>opened our shop</b>! Now, we simply wait for a <b>hunter</b> looking to trade! (Look around to see if any of your friends are <b>hunters</b> who need help getting to <b>level 2</b>.)");
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

            var plural = "";
            if(ftm.webPageItem.peltCost > 1) plural = "s";

            if(ftm.webPageItem.itemId == itemPlume.itemId)     sellerDialog.innerHTML = "I'll sell you an <b>Ostrich Plume</b> for <b>"+itemPlume.peltCost+" beaver pelt"+plural+"</b> to stock your store. Everyone at the fur post will want one to decorate their hat.";
            if(ftm.webPageItem.itemId == itemGunpowder.itemId) sellerDialog.innerHTML = "I'll sell you some <b>Gun Powder</b> for <b>"+itemGunpowder.peltCost+" beaver pelt"+plural+"</b> to stock your store. You want more pelts, right? Hunters can't shoot a bullet without gunpowder!";
            if(ftm.webPageItem.itemId == itemMBalls.itemId)    sellerDialog.innerHTML = "I'll sell some <b>Musket Balls</b> for <b>"+itemMBalls.peltCost+" beaver pelt"+plural+"</b> to stock your store. Guns are pretty useless to hunters unless they have ammo...";
            if(ftm.webPageItem.itemId == itemAxeHead.itemId)   sellerDialog.innerHTML = "I'll sell you an <b>Axe Head</b> for <b>"+itemAxeHead.peltCost+" beaver pelt"+plural+"</b> to stock your store. Iron tools are a big seller with American Indians because they last longer than the stone and bone tools they use now.";
            if(ftm.webPageItem.itemId == itemBeads.itemId)     sellerDialog.innerHTML = "I'll sell you some <b>Beads</b> for <b>"+itemBeads.peltCost+" beaver pelt"+plural+"</b> to stock your store. They are really popular with the American Indians for decorating their clothes and shoes.";
            if(ftm.webPageItem.itemId == itemKettle.itemId)    sellerDialog.innerHTML = "I'll sell you a <b>Brass Kettle</b> for <b>"+itemKettle.peltCost+" beaver pelt"+plural+"</b> to stock your store. This is a hot item at the fur post because brass kettles last much longer than ones made from clay or birchbark.";
            if(ftm.webPageItem.itemId == itemBlanket.itemId)   sellerDialog.innerHTML = "I'll sell you a <b>Blanket</b> for <b>"+itemBlanket.peltCost+" beaver pelt"+plural+"</b> to stock your store. Blankets will be a huge seller at the fur post. It will save the American Indians a lot of time skinning hides to make clothing.";
            if(ftm.webPageItem.itemId == itemFabric.itemId)    sellerDialog.innerHTML = "I'll sell you a <b>Fabric</b> from England for <b>"+itemFabric.peltCost+" beaver pelt"+plural+"</b> to stock your store. Since Making clothing from animal hide takes a long time, fabric is very popular with American Indians.";
            if(ftm.webPageItem.itemId == itemGun.itemId)       sellerDialog.innerHTML = "I'll sell you a <b>Gun</b> for <b>"+itemGun.peltCost+" beaver pelt"+plural+"</b> to stock your store. With both guns and traps, hunters will be able to bring in lots of pelts.";
            if(ftm.webPageItem.itemId == itemHoe.itemId)       sellerDialog.innerHTML = "I'll sell you an <b>Iron Hoe</b> for <b>"+itemHoe.peltCost+" beaver pelt"+plural+"</b> to stock your store. American Indians like them because they last longer than tools made of bone and stone.";
            if(ftm.webPageItem.itemId == itemSpear.itemId)     sellerDialog.innerHTML = "I'll sell you an <b>Iron Muskrat Spear</b> for <b>"+itemSpear.peltCost+" beaver pelt"+plural+"</b> to stock your store. Hunters like these because they are strong and make hunting for muskrats easier.";
            if(ftm.webPageItem.itemId == itemKnife.itemId)     sellerDialog.innerHTML = "I'll sell you a <b>Knife</b> for <b>"+itemKnife.peltCost+" beaver pelt"+plural+"</b> to stock your store. Knives will be a big seller because metal lasts longer and is more durable than cutting tools made of bone, rock, or shell.";

            buyButtonText.innerHTML = "Buy "+ftm.webPageItem.name;
        }
        else
        {
            ftv.haveDisplay.innerHTML = "";
            sellerDialog.innerHTML = "<b>Beaver Pelts</b> aren't for sale. You're supposed to be stocking your store! Scan something <b>around the clerk's counter</b> to stock the post with European goods...";
            buyButtonText.innerHTML = "Continue ";
            buyButton.ontouchstart = function() { ARIS.exitToScanner("You are a Clerk! Scan an item around the fur post counter!"); };
        }
    }

    function cleanConnection()
    {
        doomsdayShouldTick = false;
        itemOffering = -1;
        connectedPlayer = null;
        connectedPlayerOfferQty = 0;
        eh.visiblePlayers = [];

        ftm.player.availability = "available";
    }

    function formatClerkLounge()
    {
        document.getElementById('clerkloungepool').innerHTML = "";
        for(var i = 0; i < eh.visiblePlayers.length; i++)
            document.getElementById('clerkloungepool').appendChild(getLoungeCell(eh.visiblePlayers[i]));
        if(eh.visiblePlayers.length == 0)
            document.getElementById('clerkloungepool').appendChild(getLoungeCell(null));
    }

    var loungeCellSelected = function(player)
    {
        eh.sendTradeRequest(ftm.player, player.playerId);
    }

    function formatClerkTrade()
    {
        var spaces = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        document.getElementById('clerktradeimg').src       = ftm.player.photoURL;
        document.getElementById('clerktradeclientimg').src = connectedPlayer.photoURL;
        document.getElementById('clerktradetitle').innerHTML       = spaces+"Your offer:";
        document.getElementById('clerktradeclienttitle').innerHTML = spaces+"Their offer:";
        document.getElementById('clerktradename').innerHTML       = "Clerk "+ftm.player.displayname;
        document.getElementById('clerktradeclientname').innerHTML = "Hunter "+connectedPlayer.displayname;
        ftv.haveDisplay.style.fontSize = "40px";
        ftv.haveDisplay.style.height = "60px";
        ftv.haveDisplay.innerHTML = "Pelts Gained:"+itemPelt.qty;
        ftv.wantDisplay.style.textAlign = "right";
        ftv.wantDisplay.style.top = "70px";
        ftv.wantDisplay.innerHTML = "Goal:15&nbsp;&nbsp;";

        document.getElementById('clerktradeclientofferimg').src = 'assets/'+itemPelt.imageName;
        formatClerkClientOffer();

        document.getElementById('clerktradepool').innerHTML = "";
        var offset = 0;
        for(var i = 0; i < items.length; i++)
        {
            if(items[i].itemId != itemPelt.itemId)
            {
                for(var j = 0; j < items[i].qty; j++)
                {
                    var itemCell = getTradeCell(items[i]);
                    itemCell.style.left = offset+"px";
                    offset+=110;
                    document.getElementById('clerktradepool').appendChild(itemCell);
                }
            }
        }

        formatClerkClientOffer();
        formatClerkOffer();
    }

    function getLoungeCell(player)
    {
        if(player)
        {
            var cell = document.createElement('div');
            cell.setAttribute('class','loungecell');
            var img = document.createElement('img');
            img.setAttribute('class','loungecellimg');
            img.src = player.photoURL;
            var title = document.createElement('div');
            title.setAttribute('class','loungecelltitle');
            title.innerHTML = player.displayname;
            if(player.availability == "busy")
                title.innerHTML += " (busy)";
            cell.appendChild(img);
            cell.appendChild(title);
            if(player.availability != "busy")
                cell.ontouchstart = function() { loungeCellSelected(player); };
        }
        else //null cell
        {
            var cell = document.createElement('div');
            cell.setAttribute('class','loungecell');
            var title = document.createElement('div');
            title.setAttribute('class','loungecellnulltitle');
            title.innerHTML = "<span style='font-size:23px;'>No hunters found.</span><br />Waiting for hunter to enter shop...";
            cell.appendChild(title);
        }

        return cell;
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
        label.innerHTML = item.name;
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
        if(item != itemNull) item.qty -= 1;
        itemPelt.qty += connectedPlayerOfferQty;

        if(item != itemNull) ARIS.setItemCount(item.itemId,item.qty);
        ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

        var buyplural = "";
        if(item != itemNull && item.peltCost > 1) buyplural = "s";
        var tradeplural = "";
        if(connectedPlayerOfferQty) tradeplural = "s";

        if(itemPelt.qty >= 15 && ftm.currentLevel == 2)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(2), 1);
            ARIS.setItemCount(ftm.levelIdForLevel(1), 0);
            ftm.currentLevel = 3;
            clerkGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
            ftv.displayGuruWithMessage("Level 2 complete. Excellent work, clerk. You'll be climbing the company ladder in no time.");
        }
        else if(ftm.qtyNonPeltItems() == 0)
        {
            ftv.displayGuruWithMessage("What have you done!?! You've traded away all your items and haven't made even <b>15 pelts</b>! You'll have to <b>go back and buy more items with your pelts</b>. Then, make sure to <b>trade for a profit</b>!");
            clerkGuruButton.ontouchstart = function() { ARIS.exitToScanner("You are a Clerk! Collect more items to trade!"); };
        }
        else if(item.peltCost >= connectedPlayerOfferQty)   ftv.displayGuruWithMessage("Hey! We're trying to make a <b>profit</b>! You bought that <b>"+item.singular+"</b> for <b>"+item.peltCost+" pelt"+buyplural+"</b>, and just traded it for only <b>"+connectedPlayerOfferQty+" pelt"+tradeplural+"</b>! Try to get <b>more pelts</b> for your items!");
        else if(item.peltCost+1 == connectedPlayerOfferQty) ftv.displayGuruWithMessage("Good work! You made a <b>profit</b> on that last trade! You bought that <b>"+item.singular+"</b> for <b>"+item.peltCost+" pelt"+buyplural+"</b>, and just traded it for <b>"+connectedPlayerOfferQty+" pelt"+tradeplural+"</b>! See if you can get even <b>more pelts</b> for your items!");
        else if(item.peltCost < connectedPlayerOfferQty)    ftv.displayGuruWithMessage("Wow! Great job trading! You bought that <b>"+item.singular+"</b> for only <b>"+item.peltCost+" pelt"+buyplural+"</b>, and just traded it for <b>"+connectedPlayerOfferQty+" pelt"+tradeplural+"</b>! Keep this up!");

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
                sellerDialog.innerHTML = "Thanks! I'll take care of selling the pelts for cash. Look around and <b>spend all of your "+itemPelt.qty-ftm.webPageItem.peltCost+" remaining beaver pelts</b> on more items for the store.";
            else
                sellerDialog.innerHTML = "Thanks for the pelts! I'll take care of selling them for cash.";

            ftm.webPageItem.qty += 1;//500;
            itemPelt.qty        -= ftm.webPageItem.peltCost;

            ARIS.setItemCount(itemPelt.itemId,       itemPelt.qty);
            ARIS.setItemCount(ftm.webPageItem.itemId,ftm.webPageItem.qty);

            ftv.displaydelta(itemPelt.name,-1*ftm.webPageItem.peltCost);

            if(ftm.currentLevel == 1 && itemPelt.qty == 0)
            {
                ARIS.setItemCount(ftm.levelIdForLevel(1), 1);
                ftm.currentLevel = 2;
                ftv.displayGuruWithMessage("Good work! Now that the post is stocked, we should <b>find a local hunter</b> to trade our stock for <b>pelts</b>!");
                clerkGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
            }
            ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        }
        buyButtonText.innerHTML = "Continue ";
        buyButton.ontouchstart = function() { ARIS.exitToScanner("You are a Clerk! Scan an item around the fur post counter!"); };
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
        if(!imReady && !theyreReady) document.getElementById('clerktradebuttontext').innerHTML = "Make Trade!";
    }

    self.readyTouched = function()
    {
        imReady = true;
        eh.sendTradeReady(ftm.player, connectedPlayer.playerId, itemOffering);
        if(theyreReady) confirmTrade();
        formatClerkReady();
    }
}

