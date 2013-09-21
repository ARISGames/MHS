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

    var successQuips = [
    "Great job, you'll be a miner yet!"
    ];
    var mixQuips = [
    "You might be cut out for this after all, once you get the hang of it..."
    ];
    var failQuips = [
    "Are you trying to break your drill?? Try again."
    ];
    var successCount = 0;
    var failCount    = 0;

    self.setup = function()
    {
        ARIS.setItemCount(imm.ITEM_ID_DRILL, 1);
        if(imm.ITEMS[imm.ITEM_ID_DRILL] > 0) imv.displayIntro();
        else                                 imv.displayVid();
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
        successCount++;
        checkGuru();

        drillBGImage.style.display = "block";
        imv.successHUD();
        var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = moneyReceived;

        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);
    }

    function fail()
    {
        failCount++;
        checkGuru();

        drillBGImage.style.display = "block";
        imv.failHUD();
        if(imm.money < moneyLost) imm.money = moneyLost;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);
    }

    function checkGuru()
    {
        if((failCount+successCount) != 0 && (failCount+successCount)%3 == 0)
        {
                 if(failCount    == 0) imv.displayGuruWithMessage(successQuips[0]);
            else if(successCount == 0) imv.displayGuruWithMessage(failQuips[0]);
            else                       imv.displayGuruWithMessage(mixQuips[0]);
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

