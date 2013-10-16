var HunterGame = function()
{
    var self = this;

    var peltGet = document.getElementById('peltget');
    var harvestButton = document.getElementById('harvestbutton');
    var hunterGuruButton = document.getElementById("huntergurubutton");
    var hunterTradeCounter = document.getElementById('huntertradecounter');
    var hunterTradeHave = document.getElementById('huntertradehave');

    self.init = function()
    {
        if(ftm.currentLevel == 0)
        {
            ARIS.setItemCount(roleClerk.roleId, 0);
            ARIS.setItemCount(roleHunter.roleId, 1);
            ftv.displayIntro();
        }
        else
        {
            if(ftm.webPageItem == itemNull)
            {
                formatHunterTrade();
                ftv.displayTrade();
            }
            else
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
            harvestButton.innerHTML = "Leave ";
            harvestButton.ontouchstart = function() { ARIS.exitToScanner(); };
            ftv.displayGuruWithMessage("Hey! Get out from behind the clerk's counter! I asked for your help <b>collecting 10 Beaver Pelts</b>, not robbing a shop!");
        }
    }

    var formattedHunterTrade = false;
    function formatHunterTrade()
    {
        if(!formattedHunterTrade)
        {
            ftv.displayGuruWithMessage("Find a <b>clerk partner</b> looking to trade! Then, use the <b>+</b> and <b>-</b> buttons to select your furs. Once you and <b>your partner</b> have agreed on a trade, <b>smack your devices together</b> to make the trade!");
            formattedHunterTrade = true;
        }

        ftv.haveDisplay.innerHTML = "Likes: "+itemApproval.qty;
        ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;Goal: 15";

        hunterTradeCounter.innerHTML = "Trade:0";
        hunterTradeHave.innerHTML = "Have: "+itemPelt.qty;
        ARIS.setBumpString('{"hunter":0}');
    }


    self.hunterHarvestConfirmed = function()
    {
        itemPelt.qty++;
        ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

        ftv.displaydelta(itemPelt.name,1);

        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        harvestButton.innerHTML = "Leave ";
        harvestButton.ontouchstart = function() { ARIS.exitToScanner(); };
     
        if(ftm.currentLevel == 1 && itemPelt.qty == 10)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(1), 1);
            ftm.currentLevel = 2;
            ftv.displayGuruWithMessage("Excellent! Now that we have beaver pelts to trade, we should <b>find a clerk</b>!");
            hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
        }
    }

    var fursToTrade = 0;
    self.hunterIncrement = function()
    {
        if(fursToTrade+1 <= itemPelt.qty)
        {
            fursToTrade++;
            hunterTradeCounter.innerHTML = "Trade:"+fursToTrade;
            ARIS.setBumpString('{"hunter":'+fursToTrade+'}');
        }
    }
    self.hunterDecrement = function()
    {
        if(fursToTrade-1 >= 0)
        {
            fursToTrade--;
            hunterTradeCounter.innerHTML = "Trade:"+fursToTrade;
            ARIS.setBumpString('{"hunter":'+fursToTrade+'}');
        }
    }

    ARIS.bumpDetected = function(bumpString)
    {
        var data = bumpString;
        if(data.clerk)
        {
            var item;
            switch(data.clerk)
            {
                case itemEnumTrap:   item = itemTrap;   break;
                case itemEnumBeads:  item = itemBeads;  break;
                case itemEnumFabric: item = itemFabric; break;
                case itemEnumKettle: item = itemKettle; break;
            }

            item.qty         += 1;
            itemPelt.qty     -= fursToTrade;
            itemApproval.qty += item.approvalWorth;

            ARIS.setItemCount(item.itemId,item.qty);
            ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);
            ARIS.setItemCount(itemApproval.itemId,itemApproval.qty);

            if(itemApproval.qty >= 15)
            {
                ARIS.setItemCount(ftm.levelIdForLevel(2), 1);
                ftm.currentLevel = 3;
                hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
                ftv.displayGuruWithMessage("Thanks for your help!");
            }
            else if(itemPelt.qty == 0) ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>, but it looks like <b>you're out of pelts</b>! You <b>won't be able to trade</b> until you <b>go hunt some more</b>! (+"+item.approvalWorth+" likes)");
            else if(item == itemTrap) ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! Our <b>trappers</b> really appreciate it! Our old traps were getting a bit rusty... (+"+item.approvalWorth+" likes)");
            else if(item == itemBeads) ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! Our <b>crafters</b> had their eyes on those... (+"+item.approvalWorth+" likes)");
            else if(item == itemFabric) ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! We'll be able to find plenty of uses for this! (+"+item.approvalWorth+" likes)");
            else if(item == itemKettle) ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! This will save tons of time for our cooks! (+"+item.approvalWorth+" likes)");

            fursToTrade = 0;
            formatHunterTrade();
        }
        else if(data.hunter)
        {
            ftv.displayGuruWithMessage("You should find a <b>clerk</b> to trade with! There's no point in trading pelts for pelts!");
        }
    }

}

