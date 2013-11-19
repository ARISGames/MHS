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
    var connectedPlayerInventory = [];
    var connectedPlayerOfferId = -1;

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
                eh.identificationReceived = function(request)
                {
                    var data = JSON.parse(request);
                    //alert("Me:"+ftm.player.displayname+"("+ftm.player.playerId+") They:"+data.player.displayname+"("+data.player.playerId+")");
                    if(data.player.playerId == ftm.player.playerId) return;
                    if(data.player.role == "TRAPPER") return;

                    var i = eh.playerPositionInVisiblePlayers(data.player);
                    if(i == -1) eh.visiblePlayers.push(data.player);
                    else        eh.visiblePlayers[i] = data.player;

                    formatHunterLounge();
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
                    connectedPlayerInventory = data.inventory;

                    formatHunterTrade();
                    ftv.displayTrade();
                }
                eh.alterOfferReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                    if(data.player.playerId != connectedPlayer.playerId) return;
                    connectedPlayerOfferId = data.offer;
                    formatHunterClientOffer();
                }
                eh.tradeReadyReceived = function(request)
                {
                    var data = JSON.parse(request);
                    if(data.receiverId != ftm.player.playerId) return;
                }

                cleanConnection();
                eh.register();
                eh.sendNewPlayer(ftm.player);
                eh.sendIdentification(ftm.player);

                formatHunterLounge();
                ftv.displayGuruWithMessage("Wait for a <b>clerk partner</b> to <b>open up shop</b>! (Look around to see if any of your friends are <b>clerks</b> who need help getting to <b>level 2</b>). Touch a clerk on the list to <b>open a trade</b>!");
                ftv.displayLounge();
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

    function cleanConnection()
    {
        fursOffering = 0;
        connectedPlayer = null;
        connectedPlayerInventory = [];
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

    self.searchAgain = function()
    {
        document.getElementById('hunterloungesearchbutton').innerHTML = "Searching...";
        setTimeout(function(){document.getElementById('hunterloungesearchbutton').innerHTML = "Try Again";},1000);
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
        eh.sendTradeRequest(ftm.player, player.playerId, itemPelt.qty);
    }

    function formatHunterTrade()
    {
        ftv.currentTradeClientImageView.src = connectedPlayer.photoURL;
        ftv.currentTradeClientNameView.innerHTML = connectedPlayer.displayname;

        document.getElementById('huntertradeclientpool').innerHTML = "";
        var offset = 5;
        for(var i = 0; i < connectedPlayerInventory.length; i++)
        {
            var itemCell = getClerkTradeCell(ftm.itemForItemId(connectedPlayerInventory[i]));
            itemCell.style.left = offset+"px";
            offset+=40;
            document.getElementById('huntertradeclientpool').appendChild(itemCell);
        }

        document.getElementById('huntertradeofferimg').src = 'assets/'+itemPelt.imageName;

        document.getElementById('huntertradeofferimg').src = 'assets/'+itemPelt.imageName;
        formatHunterOffer();
        document.getElementById('huntertradeoffertotal').innerHTML = "x"+itemPelt.qty;
    }

    function formatHunterClientOffer()
    {
        document.getElementById('huntertradeclientofferimg').src = 'assets/'+ftm.itemForItemId(connectedPlayerOfferId).imageName;
    }

    function formatHunterOffer()
    {
        document.getElementById('huntertradeofferqty').innerHTML = "x"+fursOffering;
    }

    function getClerkTradeCell(item)
    {
        var cell = document.createElement('div');
        cell.setAttribute('class','huntertradeclientcell');
        var img = document.createElement('img');
        img.setAttribute('class','huntertradeclientcellimg');
        img.src = 'assets/'+item.imageName;
        var label = document.createElement('div');
        label.setAttribute('class','huntertradeclientcelllabel');
        label.innerHTML = item.name;
        cell.appendChild(img);
        cell.appendChild(label);

        return cell;
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

    self.incrementTouched = function()
    {
        if(fursOffering+1 <= itemPelt.qty)
            fursOffering++;
        formatHunterOffer();
        eh.sendAlterOffer(ftm.player, connectedPlayer.playerId, fursOffering);
    }

    self.decrementTouched = function()
    {
        if(fursOffering-1 >= 0)
            fursOffering--;
        formatHunterOffer();
        eh.sendAlterOffer(ftm.player, connectedPlayer.playerId, fursOffering);
    }

    var events = ["NEW_PLAYER","IDENTIFICATION","TRADE_REQUEST","TRADE_ACCEPT","ALTER_OFFER","TRADE_READY"];
    var callbacks = [];
}

