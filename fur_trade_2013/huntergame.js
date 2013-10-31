var HunterGame = function()
{
    var self = this;

    var peltGet = document.getElementById('peltget');
    var harvestButton = document.getElementById('harvestbutton');
    var harvestButtonText = document.getElementById('harvestbuttontext');
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
                ARIS.bumpDetected = function(bumpString)
                {
                    var data = bumpString;
                    if(data.clerk)
                    {
                        var item;
                        switch(data.clerk)
                        {
                            case itemEnumGun:   item = itemGun;   break;
                            case itemEnumBeads:  item = itemBeads;  break;
                            case itemEnumFabric: item = itemFabric; break;
                            case itemEnumKettle: item = itemKettle; break;
                            case itemEnumGunpowder: item = itemGunpowder; break;
                            case itemEnumBullets: item = itemBullets; break;
                            case itemEnumAxeHead: item = itemAxeHead; break;
                            case itemEnumPlume: item = itemPlume; break;
                        }

                        item.qty         += 1;
                        itemPelt.qty     -= fursToTrade;

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
                        else if(itemPelt.qty == 0)   { ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>, but it looks like <b>you're out of pelts</b>! You <b>won't be able to trade</b> until you <b>go hunt some more</b>!"); hunterGuruButton.ontouchstart = function() { ARIS.exitToScanner("Collect more pelts to trade!"); }; }
                        else if(item == itemGun)       ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! Our <b>trappers</b> really appreciate it! Our old traps were getting a bit rusty...");
                        else if(item == itemBeads)     ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! Our <b>crafters</b> had their eyes on those...");
                        else if(item == itemFabric)    ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! We'll be able to find plenty of uses for this!");
                        else if(item == itemKettle)    ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! This will save tons of time for our cooks!");
                        else if(item == itemGunpowder) ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! This will save tons of time!");
                        else if(item == itemBullets)   ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! This will save tons of time!");
                        else if(item == itemAxeHead)   ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! This will save tons of time!");
                        else if(item == itemPlume)     ftv.displayGuruWithMessage("Thanks for the <b>"+item.name+"</b>! This will make my hat look great!");

                        fursToTrade = 0;
                        formatHunterTrade();
                    }
                    else if(data.hunter)
                    {
                        ftv.displayGuruWithMessage("You should find a <b>clerk</b> to trade with! There's no point in trading pelts for pelts!");
                    }
                }

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
            harvestButtonText.innerHTML = "Leave ";
            harvestButton.ontouchstart = function() { ARIS.exitToScanner("Scan a beaver pelt to hunt and collect it!"); };
            ftv.displayGuruWithMessage("Hey! You won't find what you're looking for behind the counter! I asked for your help <b>collecting 10 Beaver Pelts</b>, not robbing a shop!");
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

        ftv.haveDisplay.innerHTML = "Items: "+ftm.qtyNonPeltItems();
        ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;Goal: 4 Items";

        hunterTradeCounter.innerHTML = "Trade:0";
        hunterTradeHave.innerHTML = "Have: "+itemPelt.qty;
        ARIS.setBumpString('{"hunter":0}');

        if(itemPelt.qty == 0) ftv.currentTradeBtnView.style.display = 'block';
    }


    self.hunterHarvestConfirmed = function()
    {
        itemPelt.qty++;//500;
        ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

        ftv.displaydelta(itemPelt.name,1);

        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        harvestButtonText.innerHTML = "Leave ";
        harvestButton.ontouchstart = function() { ARIS.exitToScanner("Scan a beaver pelt to hunt and collect it!"); };
     
        if(ftm.currentLevel == 1 && itemPelt.qty == 10)
        {
            ARIS.setItemCount(ftm.levelIdForLevel(1), 1);
            ftm.currentLevel = 2;
            ftv.displayGuruWithMessage("10 beaver pelts should be enough for us to trade... Let's <b>find a clerk</b>- someone gathering items from Minnesota!");
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

}

