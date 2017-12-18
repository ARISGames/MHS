var DrillGame = function()
{
    var self = this;

    var drillBGImage = document.getElementById('drillbgimage');
    var drillImage   = document.getElementById('drillimage');
    var lastReceivedLight = 0;
    var greenLight = 5;

    var drillOn = false;

    var minOreReceived = 1;
    var maxOreReceived = 3;
    var moneyLost = 60;

    var successCount = 0;
    var failCount    = 0;

    self.setup = function()
    {
        ARIS.setItemCount(imm.ITEM_ID_ANTON, 1);

        if(imm.currentLevel == 1)
        {
            if(!imm.drill)
                imv.currentIntroTalk.innerHTML = "Hey Kid, I'm <b>Anton Antilla</b>- Looks like you're new to the mine. <b>Start here with the drill</b>- all you gotta do is <b>drill to the correct depth</b>. Easy, right?";
            else        
            {
                imv.currentIntroButton.onclick = function() { ARIS.exitToScanner("Scan something in the Iron Mine!"); };
                imv.currentIntroTalk.innerHTML = "Good work on the <b>drill</b>! If you haven't already, you should <b>check out the dynamite or the backer stations</b> to get a feel for <b>all the jobs in the mine</b>.";
            }
        }
        else if(imm.currentLevel == 2)
            imv.currentIntroTalk.innerHTML = "The <b>drill</b> is my first choice as well- a <b>lot of work needs to be done</b> for a <b>small amount of ore</b>, but it's <b>safe, easy, and consistent</b>. Slow and steady win's the race, right?";
        else imv.currentIntroTalk.innerHTML = "You just can't get enough <b>drillin'</b>, can ya? Good luck!";
    }

    var shakeX;
    var shakeY;
    function shakeDrill()
    {
        shakeX = (Math.random()-0.5)*lastReceivedLight*5;
        shakeY = (Math.random()-0.5)*lastReceivedLight*5;
        if(drillOn)
        {
            drillImage.style.top  = shakeY+"px";
            drillImage.style.left = shakeX+"px";
            setTimeout(shakeDrill, 100);
        }
        else
        {
            if(lastReceivedLight == greenLight) succeed();
            else if(lastReceivedLight < 2)      ; //Do nothing / give em a freebie for being so shallow
            else                                fail();
            lastReceivedLight = 0;
        }
    }

    function succeed()
    {
        drillBGImage.style.display = "block";
        imv.successHUD();
        //var oreToReceive = minOreReceived + Math.round(Math.random()*(maxOreReceived-minOreReceived));
        var oreToReceive = minOreReceived + (0.5*(maxOreReceived-minOreReceived));

        successCount++;
        checkGuru(true, oreToReceive);

        //imv.displayMoneyDelta(oreToReceive);
        imv.displayMoneyDelta(oreToReceive*imm.oreWorth);
        ARIS.setItemCount(imm.ITEM_ID_ORE, imm.ore+oreToReceive);
        if(imm.currentLevel != 1) ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+(oreToReceive*imm.oreWorth));
    }

    function fail()
    {
        drillBGImage.style.display = "block";
        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost;

        imv.displayMoneyDelta(-1*moneyLost);
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);

        failCount++;
        checkGuru(false, -1*moneyLost);
    }

    function checkGuru(success, amount)
    {
        if(imm.currentLevel == 1)
        {
            if(success && successCount == 1) 
                imv.displayGuruWithMessage("Good work! <b>Drill some more holes</b>, just to make sure you've got the hang of things.");
            if(success && successCount == 3) 
            {
                imv.currentGuruButton.onclick = function(){ARIS.exitToScanner("Scan something in the iron mine!");};
                imv.displayGuruWithMessage("Perfect. Now that you've mastered the <b>drill</b>, be sure to <b>check out the blaster and the backer</b>.");
                ARIS.setItemCount(imm.ITEM_ID_DRILL, 1);
                imm.drill = true;
            }
            if(!success && failCount == 1) 
                imv.displayGuruWithMessage("Not quite! You've broken your drill bit! <b>That costs money...</b> Look at the lights and be sure to <b>release on green</b>!");
        }
        else if(imm.currentLevel == 2)
        {
            if(success && successCount == 1) 
            {
                var moneyMade = amount*imm.oreWorth;
                imv.displayGuruWithMessage("Alright- you drilled enough dynamite holes to find <b>"+amount+" ore</b>. At <b>$0."+imm.oreWorth+" per ore</b>, that's <b>$"+((moneyMade-(moneyMade%100))/100)+'.'+(moneyMade%100 < 10 ? '0' : '')+(moneyMade%100)+"</b>. Keep it up!");
            }
            else if(!success && failCount == 1)
                imv.displayGuruWithMessage("Hey! Who do you think <b>pays for that drill bit</b>?! You'll never make your day's wage if you keep <b>setting yourself back</b> like this...");
        }
    }

    var drillStarted = function(data)
    {
        if(!imm.currentLevel == 1 || !imm.drill) imv.displayActivity();
        drillBGImage.style.display = "none";
        imv.neutralHUD();
        drillOn = true;
        shakeDrill();
    }

    var drillStopped = function(data)
    {
        if(!imm.currentLevel == 1 || !imm.drill) imv.displayActivity();
        drillOn = false;
    }

    var drillLit = function(data)
    {
        if(!imm.currentLevel == 1 || !imm.drill) imv.displayActivity();
        drillBGImage.style.display = "none";
        lastReceivedLight = parseInt(data);
        if(lastReceivedLight == 1) drillStarted();
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED',imm.stationId+'_DRILL_LIGHT'];
    this.callbacks = [drillStarted, drillStopped, drillLit];
}

