var ClerkGame = function()
{
    var self = this;

    var clerkItemGet     = document.getElementById("clerkitemget");
    var sellerDialog     = document.getElementById("sellerdialog");
    var buyButton        = document.getElementById('buybutton');
    var buyButtonText    = document.getElementById("sellerbuttontext");
    var clerkGuruButton  = document.getElementById("clerkgurubutton");
    
    self.init = function()
    {
        if(ftm.currentLevel == 0)
        {
            ftv.displayIntro();
            ARIS.setItemCount(itemPelt.itemId,10);
            ARIS.setItemCount(roleClerk.roleId, 1);
            ARIS.setItemCount(roleHunter.roleId, 0);
        }
        else
        {
            if(ftm.webPageItem == itemNull)
            {
                formatClerkTrade();
                ftv.displayTrade();
            }
            else
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
            sellerDialog.innerHTML = "I've got some <b>"+ftm.webPageItem.name+"s</b> here... I'd be willing to part with one for the price of <b>"+ftm.webPageItem.peltCost+" pelts</b>. Whad'ya say, kid?";
            buyButtonText.innerHTML = "Buy "+ftm.webPageItem.name;
        }
        else
        {
            sellerDialog.innerHTML = "These <b>Beaver Pelts</b> aren't for sale. Scan something <b>behind the clerk's counter</b> if you want to fill your store with some of my European wares...";
            buyButton.style.display = 'none';
            sellerDialog.style.bottom = '0px';
        }
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

    var formattedClerkTrade = false;
    function formatClerkTrade()
    {
        if(!formattedClerkTrade)
        {
            ftv.displayGuruWithMessage("Find a <b>hunter partner</b> looking to trade! Then, <b>select the item</b> you would like to trade. Once you and <b>your partner</b> have agreed on a trade, <b>smack your devices together</b> to make the trade! ");
            formattedClerkTrade = true;
        }

        ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;
        ftv.wantDisplay.innerHTML = "&nbsp;&nbsp;Goal: 20";

        document.getElementById('clerktradepool').innerHTML = "";
        if(itemTrap.qty   > 0) document.getElementById('clerktradepool').appendChild(getTradeCell(itemTrap));
        if(itemBeads.qty  > 0) document.getElementById('clerktradepool').appendChild(getTradeCell(itemBeads));
        if(itemFabric.qty > 0) document.getElementById('clerktradepool').appendChild(getTradeCell(itemFabric));
        if(itemKettle.qty > 0) document.getElementById('clerktradepool').appendChild(getTradeCell(itemKettle));
        ARIS.setBumpString('{"clerk":0}');
    }

    self.clerkBuyConfirmed = function()
    {
        if(itemPelt.qty < ftm.webPageItem.peltCost)
        {
            sellerDialog.innerHTML = "What?! You only have <b>"+itemPelt.qty+" pelts</b>! I said I'd trade for <b>"+ftm.webPageItem.peltCost+" pelts</b>! Get outa here, ya cheat!";
        }
        else
        {
            sellerDialog.innerHTML = "Thanks!";
            
            ftm.webPageItem.qty += 1;
            itemPelt.qty        -= ftm.webPageItem.peltCost;

            ARIS.setItemCount(itemPelt.itemId,       itemPelt.qty);
            ARIS.setItemCount(ftm.webPageItem.itemId,ftm.webPageItem.qty);

            ftv.displaydelta(itemPelt.name,-1*ftm.webPageItem.peltCost);

            ftv.haveDisplay.innerHTML = "Pelts: "+itemPelt.qty;

            if(ftm.currentLevel == 1 && itemPelt.qty == 0)
            {
                ARIS.setItemCount(ftm.levelIdForLevel(1), 1);
                ftm.currentLevel = 2;
                ftv.displayGuruWithMessage("Good work! Now that we have supplies for the store, we should try to <b>find someone looking to trade</b>!");
                clerkGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
            }
        }
        buyButton.style.display = 'none';
        sellerDialog.style.bottom = '0px';
    }

    var selectedItem = null;
    self.clerkTradeItemSelected = function(item)
    {
        selectedItem = item;
        document.getElementById('clerktradeitem').src = 'assets/'+item.imageName;
        ARIS.setBumpString('{"clerk":'+item.itemEnum+'}');
    }

    ARIS.bumpDetected = function(bumpString)
    {
        var data = bumpString;
        if(data.clerk)
        {
            ftv.displayGuruWithMessage("You should find a <b>hunter</b> to trade with! We want <b>pelts</b>, not more junk!");
        }
        else if(data.hunter)
        {
            selectedItem.qty -= 1;
            itemPelt.qty     += data.hunter;

            ARIS.setItemCount(selectedItem.itemId,selectedItem.qty);
            ARIS.setItemCount(itemPelt.itemId,itemPelt.qty);

            if(itemPelt.qty >= 20)
            {
                ARIS.setItemCount(ftm.levelIdForLevel(2), 1);
                ftm.currentLevel = 3;
                clerkGuruButton.ontouchstart = function(){ ARIS.exitToTab("QUESTS"); ftv.hideGuru(); };
                ftv.displayGuruWithMessage("Congrats! You've taken <b>10 pelts</b> worth of items, and successfully traded them up for <b>20</b>!");
            }
            else if(selectedItem.peltCost >= data.hunter)   ftv.displayGuruWithMessage("Hey! We're trying to make a <b>profit</b>! You bought that <b>"+selectedItem.name+"</b> for <b>"+selectedItem.peltCost+" pelts</b>, and just traded it for only <b>"+data.hunter+" pelts</b>! Try to get <b>more pelts</b> for your items!");
            else if(selectedItem.peltCost+1 == data.hunter) ftv.displayGuruWithMessage("Good work! You made a <b>profit</b> on that last trade! You bought that <b>"+selectedItem.name+"</b> for <b>"+selectedItem.peltCost+" pelts</b>, and just traded it for <b>"+data.hunter+" pelts</b>! See if you can get even <b>more pelts</b> for your items!");
            else if(selectedItem.peltCost < data.hunter)    ftv.displayGuruWithMessage("Wow! Great job trading! You bought that <b>"+selectedItem.name+"</b> for only <b>"+selectedItem.peltCost+" pelts</b>, and just traded it for <b>"+data.hunter+" pelts</b>! Keep this up!");

            selectedItem = null;
            formatClerkTrade();
        }
    }

}
