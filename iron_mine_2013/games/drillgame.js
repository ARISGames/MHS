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
                imv.currentIntroTalk.innerHTML = "Hey Kid, I'm <b>Anton Antilla</b>- Good work on the drill! If you haven't already, you should <b>check out the dynamite or the backer stations</b> to get a feel for <b>all the jobs in the mine</b>.";
            }
        }
        if(imm.currentLevel == 2)
            imv.currentIntroTalk.innerHTML = "You can never know <b>how much ore</b> you'll get. Good luck!<br />";
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
        var oreToReceive = minOreReceived + Math.round(Math.random()*(maxOreReceived-minOreReceived));

        imv.displayMoneyDelta(oreToReceive);
        ARIS.setItemCount(imm.ITEM_ID_ORE, imm.ore+oreToReceive);
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+(oreToReceive*imm.oreWorth));

        successCount++;
        checkGuru(true);
    }

    function fail()
    {
        drillBGImage.style.display = "block";
        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost;

        imv.displayMoneyDelta(-1*moneyLost);
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);

        failCount++;
        checkGuru(false);
    }

    function checkGuru(success)
    {
        if(imm.currentLevel == 1)
        {
            if(success && successCount == 1) 
                imv.displayGuruWithMessage("Good work! <b>Collect some more ore</b>, just to make sure you've got the hang of things.");
            if(success && successCount == 3) 
            {
                imv.currentGuruButton.onclick = function(){ARIS.exitToScanner("Scan something in the iron mine!");};
                imv.displayGuruWithMessage("Perfect. Now that you've mastered the <b>drill</b>, be sure to <b>check out the blaster and the backer</b>.");
                ARIS.setItemCount(imm.ITEM_ID_DRILL, 1);
            }
            if(!success && failCount == 1) 
                imv.displayGuruWithMessage("Not quite! You've broken your drill bit! <b>That costs money...</b> Look at the lights and be sure to <b>release on green</b>!");
        }
        else if(imm.currentLevel == 2)
        {
            if(success && successCount == 1) 
            {
                imv.displayGuruWithMessage("Ya done good work there but since there's only a little ore, there's only a little pay.");
                imv.displayGuruWithMessage("AHA! That's what I'm talkin' about! There's a lotta ore here, that means PAY DAY!");
            }
            else if(!success && failCount == 1)
                imv.displayGuruWithMessage("Kid, you're gonna hurt yourself that way! Make sure you look for the GREEN light.");
            else if(success)
                imv.displayGuruWithMessage("You know what they say... no ore, no pay. The company only pays for the ore we find, no matter if it kills us for 10 hours.");
        }
    }

    var drillStarted = function(data)
    {
        drillBGImage.style.display = "none";
        imv.neutralHUD();
        drillOn = true;
        shakeDrill();
    }

    var drillStopped = function(data)
    {
        drillOn = false;
    }

    var drillLit = function(data)
    {
        drillBGImage.style.display = "none";
        lastReceivedLight = parseInt(data);
        if(lastReceivedLight == 1) drillStarted();
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED',imm.stationId+'_DRILL_LIGHT'];
    this.callbacks = [drillStarted, drillStopped, drillLit];
}

