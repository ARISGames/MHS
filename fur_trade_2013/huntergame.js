var HunterGame = function()
{
    var self = this;

    var peltGet = document.getElementById('peltget');
    var harvestButton = document.getElementById('harvestbutton');
    var harvestButtonText = document.getElementById('harvestbuttontext');
    var hunterGuruButton = document.getElementById("huntergurubutton");
    var hunterTradeCounter = document.getElementById('huntertradecounter');
    var hunterTradeHave = document.getElementById('huntertradehave');

    //trade vars
    var fursOffering = 0;
    var connectedPlayerId = 0;
    var connectedPlayerOfferId = -1;
    var connectedPlayerOfferQty = 0;

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
                eh.tradeRequestReceived = function(request)
                {
                    //should never get this
                }
                eh.tradeAcceptReceived = function(request)
                {
                    if(request.receiverId != ftm.player.playerId) return;
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


                formatHunterTrade();
                ftv.displayGuruWithMessage("Find a <b>clerk partner</b> looking to trade! Then, use the <b>+</b> and <b>-</b> buttons to select your furs. Once you and <b>your partner</b> have agreed on a trade, <b>smack your devices together</b> to make the trade!");
                ftv.displayTrade();
            }
            else //if on harvest page
            {
                formatHunterGet();
                ftv.displayGet();
            }
        }
    }

    function formatHunterGet()
    {
        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;

        if(ftm.currentLevel < 2) ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;You Need: 10 pelts";
        else ftv.wantDisplay.style.display = 'hidden';

        if(ftm.webPageItem.itemEnum != itemEnumPelt)
        {
            peltGet.src = "assets/"+ftm.webPageItem.imageName;
            harvestButtonText.innerHTML = "Leave ";
            harvestButton.ontouchstart = function() { ARIS.exitToScanner("Scan a beaver on the ground to trap it!"); };
            ftv.displayGuruWithMessage("Hey! You won't find what you're looking for behind the counter! I asked for your help <b>trapping 10 beavers</b> (look for tiles on the ground), not robbing a shop!");
        }
    }

    function formatHunterTrade()
    {
        ftv.haveDisplay.innerHTML = "Items: "+ftm.qtyNonPeltItems();
        ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;Goal: 4 Items";

        hunterTradeCounter.innerHTML = "Trade:0";
        hunterTradeHave.innerHTML = "Have: "+itemPelt.qty;

        if(itemPelt.qty == 0) ftv.currentTradeBtnView.style.display = 'block';
    }

    function confirmTrade()
    {
        var item = ftm.items[connectedPlayerOfferId];
        item.qty         += 1;
        itemPelt.qty     -= fursOffering;

        ARIS.setItemCount(item.itemId,        item.qty);
        ARIS.setItemCount(itemPelt.itemId,    itemPelt.qty);

        if(ftm.qtyNonPeltItems() >= 4)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(2), 1);
            ARIS.setItemCount(ftm.levelIdForLevel(1), 0);
            ftm.currentLevel = 3;
            hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
            ftv.displayGuruWithMessage("Level 2 complete! Nice work for a new trapper!");
        }
        else if(itemPelt.qty == 0)
        {
            ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>, but it looks like <b>you're out of pelts</b>!");
            hunterGuruButton.ontouchstart = function() { ARIS.exitToScanner("Collect more pelts to trade!"); };
        }
        else if(item == itemGun)       ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemBeads)     ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemBlanket)   ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemKettle)    ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemGunpowder) ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemMBalls)    ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemAxeHead)   ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemPlume)     ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemHoe)       ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemFabric)    ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemSpear)     ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");
        else if(item == itemKnife)     ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>!");

        fursOffering = 0;
        formatHunterTrade();
    }

    self.hunterHarvestConfirmed = function()
    {
        itemPelt.qty++;//500;
        ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

        ftv.displaydelta(itemPelt.name,1);

        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        harvestButtonText.innerHTML = "Leave ";
        harvestButton.ontouchstart = function() { ARIS.exitToScanner("Scan a beaver on the ground to trap it!"); };
     
        if(ftm.currentLevel == 1 && itemPelt.qty == 10)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(1), 1);
            ftm.currentLevel = 2;
            ftv.displayGuruWithMessage("10 beaver pelts should be enough for us to trade... Let's <b>find a clerk</b>- someone gathering items from Minnesota!");
            hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
        }
    }

    self.hunterIncrement = function()
    {
        if(fursOffering+1 <= itemPelt.qty)
        {
            fursOffering++;
            hunterTradeCounter.innerHTML = "Trade:"+fursOffering;
        }
    }

    self.hunterDecrement = function()
    {
        if(fursOffering-1 >= 0)
        {
            fursOffering--;
            hunterTradeCounter.innerHTML = "Trade:"+fursOffering;
        }
    }

    var events = ["NEW_PLAYER","IDENTIFICATION","TRADE_REQUEST","TRADE_ACCEPT","ALTER_OFFER","TRADE_READY"];
    var callbacks = [];
}

