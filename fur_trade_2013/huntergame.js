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
        ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;You Need: 10 pelts";
        if(ftm.webPageItem.itemEnum != itemEnumPelt)
        {
            peltGet.src = "assets/"+ftm.webPageItem.imageName;
            harvestButton.style.display = 'none';
            ftv.displayGuruWithMessage("Hey! Get out from behind the clerk's counter! I asked for your help <b>collecting 10 Beaver Pelts</b>, not robbing a shop!");
        }
    }

    function formatHunterTrade()
    {
        ftv.displayGuruWithMessage("Find a <b>clerk partner</b> looking to trade! Then, use the <b>+</b> and <b>-</b> buttons to select your furs. Once you and <b>your partner</b> have agreed on a trade, <b>smack your devices together</b> to make the trade!");

        ftv.haveDisplay.innerHTML = "Likes: "+itemApproval.qty;
        ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;Goal: 20";

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
        harvestButton.style.display = 'none';
     
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

            if(itemApproval.qty >= 20)
            {
                ARIS.setItemCount(ftm.levelIdForLevel(2), 1);
                ftm.currentLevel = 3;
                hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
                ftv.displayGuruWithMessage("Thanks for your help!");
            }

            fursToTrade = 0;
            formatHunterTrade();
        }
        else if(data.hunter)
        {
            ftv.displayGuruWithMessage("You should find a <b>clerk</b> to trade with! There's no point in trading pelts for pelts!");
        }
    }

}

