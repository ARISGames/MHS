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
        haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        wantDisplay.innerHTML = "&nbsp;&nbsp;You Need: 10 pelts";
        if(webPageItem.itemEnum != itemEnumPelt)
        {
            peltGet.src = "assets/"+webPageItem.imageName;
            harvestButton.style.display = 'none';
            displayGuruWithMessage("Hey! Get out from behind the clerk's counter! I asked for your help <b>collecting 10 Beaver Pelts</b>, not robbing a shop!");
        }
    }

    function formatHunterTrade()
    {
        displayGuruWithMessage("Find a <b>clerk partner</b> looking to trade! Then, use the <b>+</b> and <b>-</b> buttons to select your furs. Once you and <b>your partner</b> have agreed on a trade, <b>smack your devices together</b> to make the trade!");

        haveDisplay.innerHTML = "Likes: "+itemApproval.qty;
        wantDisplay.innerHTML = "&nbsp;&nbsp;Goal: 20";

        hunterTradeCounter.innerHTML = "Trade:0";
        hunterTradeHave.innerHTML = "Have: "+itemPelt.qty;
        ARIS.setBumpString('{"hunter":0}');
    }


    function hunterHarvestConfirmed()
    {
        itemPelt.qty++;
        ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

        displaydelta(itemPelt.name,1);

        haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        harvestButton.style.display = 'none';
     
        if(currentLevel == 1 && itemPelt.qty == 10)
        {
            ARIS.setItemCount(levelIdForLevel(1), 1);
            currentLevel = 2;
            displayGuruWithMessage("Excellent! Now that we have beaver pelts to trade, we should <b>find a clerk</b>!");
            hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); hideGuru(); };
        }
    }

    var fursToTrade = 0;
    function hunterIncrement()
    {
        if(fursToTrade+1 <= itemPelt.qty)
        {
            fursToTrade++;
            hunterTradeCounter.innerHTML = "Trade:"+fursToTrade;
            ARIS.setBumpString('{"hunter":'+fursToTrade+'}');
        }
    }
    function hunterDecrement()
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
                ARIS.setItemCount(levelIdForLevel(2), 1);
                currentLevel = 3;
                hunterGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); hideGuru(); };
                displayGuruWithMessage("Thanks for your help!");
            }

            fursToTrade = 0;
            formatHunterTrade();
        }
        else if(data.hunter)
        {
            displayGuruWithMessage("You should find a <b>clerk</b> to trade with! There's no point in trading pelts for pelts!");
        }
    }

}

