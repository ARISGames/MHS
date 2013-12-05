var HunterGame = function()
{
    var self = this;

    var peltGet = document.getElementById('peltget');
    var harvestButton = document.getElementById('harvestbutton');
    var harvestButtonText = document.getElementById('harvestbuttontext');
    var hunterGuruButton = document.getElementById("huntergurubutton");

    //trade vars
    var fursOffering = 0;
    var connectedPlayer = null;
    var connectedPlayerOfferId = -1;
    var imReady = false;
    var theyreReady = false;

    self.init = function()
    {
        if(ftm.currentLevel == 0)
        {
            ARIS.setItemCount(roleClerk.roleId, 0);
            ARIS.setItemCount(roleHunter.roleId, 1);
            ftv.displayIntro();
        }
        else //Not first time
        {
            if(ftm.webPageItem == itemNull) //if on trade page
            {
                eh.newPlayerReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.player.playerId == ftm.player.playerId) return;
                    if(connectedPlayer) return;
                    setTimeout(function(){eh.sendIdentification(ftm.player);},200); //give the new player a second
                }
                eh.identificationReceived = function(request)
                {
                    var data = JSON.parse(request);
                    //alert("Me:"+ftm.player.displayname+"("+ftm.player.playerId+") They:"+data.player.displayname+"("+data.player.playerId+")");
                    if(data.player.playerId == ftm.player.playerId) return;
                    if(data.player.role == "hunter") return;

                    var i = eh.playerPositionInVisiblePlayers(data.player);
                    if(i == -1) eh.visiblePlayers.push(data.player);
                    else        eh.visiblePlayers[i] = data.player;

                    formatHunterLounge();
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
                        formatHunterLounge();
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
                    //should never get this
                }
                eh.tradeAcceptReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(connectedPlayer) return;

                    connectedPlayer = data.player;

                    formatHunterTrade();
                    ftv.displayTrade();
                    startDoomsdayTimer();
                    if(ftm.currentLevel == 2)
                        ftv.displayGuruWithMessage("Now that you've collected some <b>pelts</b>, see what items <b>"+connectedPlayer.displayname+"</b> will sell you! Aim to get a total of <b>5 items</b>. (If you run out of pelts, you can always go back to your <b>scanner</b> and collect more).");
                }
                eh.alterOfferReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(!connectedPlayer || data.player.playerId != connectedPlayer.playerId) return;
                    connectedPlayerOfferId = data.offer;
                    formatHunterClientOffer();
                    imReady = false;
                    theyreReady = false;
                    formatHunterReady();
                    timeSinceLastInteraction = new Date();
                }
                eh.tradeReadyReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(!connectedPlayer || data.player.playerId != connectedPlayer.playerId) return;
                    if(data.offer != connectedPlayerOfferId)
                        eh.alterOfferReceived(request);
                    theyreReady = true;

                    if(imReady) confirmTrade();
                    formatHunterReady();
                    timeSinceLastInteraction = new Date();
                }

                cleanConnection();
                eh.register();
                eh.sendNewPlayer(ftm.player);
                eh.sendIdentification(ftm.player);
                window.addEventListener('beforeunload', function() { eh.sendPlayerLeft(ftm.player); }, false);

                formatHunterLounge();
                ftv.displayGuruWithMessage("Wait for a <b>clerk</b> partner to open up shop! Look around to see if any of your friends are clerks who need help getting to level 2. <b>Select</b> a clerk on the list to start trading!");
                ftv.displayLounge();
            }
            else //if on harvest page
            {
                formatHunterGet();
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
            formatHunterLounge();
            ftv.displayLounge();
        }
        if(doomsdayShouldTick)
            setTimeout(tickDoomsday, 5000);
    }

    function formatHunterGet()
    {
        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;

        if(ftm.currentLevel < 2) ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;You Need: 8 pelts";
        else ftv.wantDisplay.style.display = 'hidden';

        if(ftm.webPageItem.itemEnum != itemEnumPelt)
        {
            peltGet.src = "assets/"+ftm.webPageItem.imageName;
            harvestButtonText.innerHTML = "Leave ";
            harvestButton.ontouchstart = function() { ARIS.exitToScanner("You are a Hunter! Scan a beaver on the ground to trap it!"); };
            ftv.displayGuruWithMessage("Hey! You won't find what you're looking for behind the counter! I asked for your help <b>trapping 8 beavers</b>! (Look for tiles on the ground.)");
        }
    }

    function cleanConnection()
    {
        doomsdayShouldTick = false;
        fursOffering = 0;
        connectedPlayer = null;
        connectedPlayerOfferId = -1;
        eh.visiblePlayers = [];
    }

    function formatHunterLounge()
    {
        document.getElementById('hunterloungepool').innerHTML = "";
        for(var i = 0; i < eh.visiblePlayers.length; i++)
            document.getElementById('hunterloungepool').appendChild(getLoungeCell(eh.visiblePlayers[i]));
        if(eh.visiblePlayers.length == 0)
            document.getElementById('hunterloungepool').appendChild(getLoungeCell(null));
    }

    function formatHunterReady()
    {
        if(imReady && !theyreReady) document.getElementById('huntertradebuttontext').innerHTML = "Waiting for Clerk...";
        if(!imReady && theyreReady) document.getElementById('huntertradebuttontext').innerHTML = "Make Trade!";
        if(!imReady && !theyreReady) document.getElementById('huntertradebuttontext').innerHTML = "Make Trade!";
    }

    self.searchAgain = function()
    {
        document.getElementById('hunterloungesearchbutton').innerHTML = "Searching...";
        setTimeout(function(){document.getElementById('hunterloungesearchbutton').innerHTML = "Search Again";},1000);
        cleanConnection();
        formatHunterLounge();
        eh.sendNewPlayer(ftm.player);
        eh.sendIdentification(ftm.player);
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
            cell.appendChild(img);
            cell.appendChild(title);
            cell.ontouchstart = function() { loungeCellSelected(player); };
        }
        else //null cell
        {
            var cell = document.createElement('div');
            cell.setAttribute('class','loungecell');
            var title = document.createElement('div');
            title.setAttribute('class','loungecellnulltitle');
            title.innerHTML = "<span style='font-size:23px;'>No open shops found.</span><br />Waiting for clerk to open shop...";
            cell.appendChild(title);
        }

        return cell;
    }

    var loungeCellSelected = function(player)
    {
        eh.sendTradeRequest(ftm.player, player.playerId);
    }

    function formatHunterTrade()
    {
        var spaces = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        document.getElementById('huntertradeimg').src       = ftm.player.photoURL;
        document.getElementById('huntertradeclientimg').src = connectedPlayer.photoURL;
        document.getElementById('huntertradetitle').innerHTML       = spaces+"Your offer:";
        document.getElementById('huntertradeclienttitle').innerHTML = spaces+"Their offer:";
        document.getElementById('huntertradename').innerHTML       = "Hunter "+ftm.player.displayname;
        document.getElementById('huntertradeclientname').innerHTML = "Clerk "+connectedPlayer.displayname;
        ftv.haveDisplay.style.fontSize = "40px";
        ftv.haveDisplay.style.height = "60px";
        ftv.haveDisplay.innerHTML = "Items Gained:"+ftm.qtyNonPeltItems();
        ftv.wantDisplay.style.textAlign = "right";
        ftv.wantDisplay.style.top = "70px";
        ftv.wantDisplay.innerHTML = "Goal:5&nbsp;&nbsp;";

        document.getElementById('huntertradeofferimg').src = 'assets/'+itemPelt.imageName;
        formatHunterOffer();
        document.getElementById('huntertradeoffertotal').innerHTML = "In your Inventory:"+itemPelt.qty;
        formatHunterClientOffer();
    }

    function formatHunterClientOffer()
    {
        document.getElementById('huntertradeclientofferimg').src = 'assets/'+ftm.itemForItemId(connectedPlayerOfferId).imageName;
    }

    function formatHunterOffer()
    {
        document.getElementById('huntertradeofferqty').innerHTML = "x"+fursOffering;
        //document.getElementById('huntertradeofferqty2').innerHTML = fursOffering;
    }

    function confirmTrade()
    {
        imReady = false;
        theyreReady = false;

        var item = ftm.itemForItemId(connectedPlayerOfferId);
        if(item) item.qty += 1;
        itemPelt.qty -= fursOffering;

        if(item) ARIS.setItemCount(item.itemId,     item.qty);
        ARIS.setItemCount(itemPelt.itemId, itemPelt.qty);

        if(ftm.qtyNonPeltItems() >= 5 && ftm.currentLevel == 2)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(2), 1);
            ARIS.setItemCount(ftm.levelIdForLevel(1), 0);
            ftm.currentLevel = 3;
            hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
            ftv.displayGuruWithMessage("Level 2 complete! Nice work for a new hunter!");
        }
        else if(itemPelt.qty == 0)
        {
            if(!item) ftv.displayGuruWithMessage("What! You just gave those pelts away for nothing! Now <b>you're out of pelts</b>!");
            else      ftv.displayGuruWithMessage("Thanks for the <b>"+item.singular+"</b>, but it looks like <b>you're out of pelts</b>!");
            hunterGuruButton.ontouchstart = function() { ARIS.exitToScanner("You are a Hunter! Collect more pelts to trade!"); };
        }
        else
        {
            var plural = "s";
            if(ftm.qtyNonPeltItems() == 1) plural = "";

            if(!item)                                    ftv.displayGuruWithMessage("You just gave those pelts away for nothing! You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemPlume.itemId)     ftv.displayGuruWithMessage("You have an <b>Ostrich Plume</b>! You'll look mighty spiffy when you decorate your hat with it! You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemGunpowder.itemId) ftv.displayGuruWithMessage("Nice trade! With <b>Gun Powder</b>, you can use traps AND guns to bring in more pelts to the post. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemMBalls.itemId)    ftv.displayGuruWithMessage("Smart trade. A gun won't get you very far without ammo, so it's smart to stock up on <b>Musket Balls</b>. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemAxeHead.itemId)   ftv.displayGuruWithMessage("You got an <b>Axe Head</b>! These are helpful because iron tools last longer than ones made of stone or bone. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemBeads.itemId)     ftv.displayGuruWithMessage("You now have <b>Beads</b> from Holland and Italy to make beautiful decorations on your clothing or bandolier bags. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemKettle.itemId)    ftv.displayGuruWithMessage("You are now the proud owner of a <b>Brass Kettle</b> from Europe! These kettles are very durable and you can cook directly over a fire. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemBlanket.itemId)   ftv.displayGuruWithMessage("Nice trade. Trading for <b>Blankets</b> will save a lot of time skinning hides to make clothing. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemFabric.itemId)    ftv.displayGuruWithMessage("Nice trade. Trading for <b>Fabric</b> will save a lot of time skinning hides to make clothing. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemGun.itemId)       ftv.displayGuruWithMessage("Nice trade. A <b>Gun</b> is important for hunting- you can even get special guns to use with mittens! You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemHoe.itemId)       ftv.displayGuruWithMessage("Nice one. A <b>Hoe</b> made of iron will last longer than bone and stone tools. You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemSpear.itemId)     ftv.displayGuruWithMessage("That's a good tool to have! It will be easy to hunt Muskrats with a <b>Metal Spear</b>! You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
            else if(item.itemId == itemKnife.itemId)     ftv.displayGuruWithMessage("Good trade! <b>Knives</b> are a great tool to have for hunting and cooking! You've gotten us <b>"+ftm.qtyNonPeltItems()+" item"+plural+"</b>- only <b>"+(5-ftm.qtyNonPeltItems())+" more</b> to go!");
        }

        fursOffering = 0;
        connectedPlayerOfferId = -1;
        formatHunterTrade();
    }

    self.hunterHarvestConfirmed = function()
    {
        itemPelt.qty++;//500;
        ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        ftv.displaydelta(itemPelt.name,1);

        harvestButtonText.innerHTML = "Leave ";
        harvestButton.ontouchstart = function() { ARIS.exitToScanner("You are a Hunter! Scan a beaver on the ground to trap it!"); };
     
        if(ftm.currentLevel == 1 && itemPelt.qty >= 8)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(1), 1);
            ftm.currentLevel = 2;
            ftv.displayGuruWithMessage("Good work! 8 beaver pelts should be enough for us to start trading with <b>clerks</b>!");
            hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
        }
    }

    self.incrementTouched = function()
    {
        if(fursOffering+1 <= itemPelt.qty)
            fursOffering++;
        formatHunterOffer();
        eh.sendAlterOffer(ftm.player, connectedPlayer.playerId, fursOffering);
        theyreReady = false;
        imReady = false;
        formatHunterReady();
    }

    self.decrementTouched = function()
    {
        if(fursOffering-1 >= 0)
            fursOffering--;
        formatHunterOffer();
        eh.sendAlterOffer(ftm.player, connectedPlayer.playerId, fursOffering);
        theyreReady = false;
        imReady = false;
        formatHunterReady();
    }

    self.readyTouched = function()
    {
        imReady = true;
        eh.sendTradeReady(ftm.player, connectedPlayer.playerId, fursOffering);
        if(theyreReady) confirmTrade();
        formatHunterReady();
    }
}

