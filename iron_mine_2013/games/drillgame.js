var DrillGame = function()
{
    var self = this;

    var drillBGImage = document.getElementById('drillbgimage');
    var drillImage   = document.getElementById('drillimage');
    var lastReceivedLight = 0;
    var greenLight = 5;

    var drillOn = false;

    var moneyReceived = 40;
    var minMoneyReceived = 3;
    var maxMoneyReceived = 40;
    var moneyLost = 60;

    var lastReceivedMoney = 0;
    var successCount = 0;
    var failCount    = 0;

    self.setup = function()
    {
        ARIS.setItemCount(imm.ITEM_ID_DRILL, 1);
        ARIS.setItemCount(imm.ITEM_ID_ANTON, 1);
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
        var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = moneyReceived;

        lastReceivedMoney = moneyToReceive;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);

        successCount++;
        checkGuru(true);
    }

    function fail()
    {
        drillBGImage.style.display = "block";
        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);

        failCount++;
        checkGuru(false);
    }

    function checkGuru(success)
    {
        if(imm.currentLevel == 1)
        {
            if(success && successCount == 1) 
                imv.displayGuruWithMessage(
                    "Nice work, kid.  You drilled to the correct depth. Now we need to do this for ten more hours!"
                );
            if(!success && failCount == 1) 
                imv.displayGuruWithMessage(
                    "Not quite! Look at the lights and be sure to release on green."
                );
        }
        else if(imm.currentLevel == 2)
        {
            if(success && successCount == 1) 
            {
                if(lastReceivedMoney < 13)
                    imv.displayGuruWithMessage(
                        "Ya done good work there but since there's only a little ore, there's only a little pay."
                    );
                else
                    imv.displayGuruWithMessage(
                        "AHA! That's what I'm talkin' about! There's a lotta ore here, that means PAY DAY!"
                    );
            }
            else if(!success && failCount == 1)
                imv.displayGuruWithMessage(
                    "Kid, you're gonna hurt yourself that way! Make sure you look for the GREEN light."
                );
            else if(success && lastReceivedMoney < 13)
                imv.displayGuruWithMessage(
                    "You know what they say... no ore, no pay. The company only pays for the ore we find, no matter if it kills us for 10 hours."
                );
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

