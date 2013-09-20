var DrillGame = function()
{
    var self = this;

    //Load images
    var tmpYellowDrillImage = new Image();
    var tmpRedDrillImage    = new Image();
    var tmpGreenDrillImage  = new Image();
    tmpYellowDrillImage.src = 'assets/drill_yellow.png';
    tmpRedDrillImage.src    = 'assets/drill_red.png';
    tmpGreenDrillImage.src  = 'assets/drill_green.png';
    //Won't do anything with these ^, this just brings them into memory

    var drillImage = document.getElementById('drillimage');
    var lastReceivedLight = 0;
    var greenLight = 5;

    var drillOn = false;

    var moneyReceived = 40;
    var minMoneyReceived = 3;
    var maxMoneyReceived = 40;
    var moneyLost = 60;

    var successQuips = [
    "Success!"
    ];
    var mixQuips = [
    "OK!"
    ];
    var failQuips = [
    "Fail!"
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

        imv.successHUD();
        drillImage.src = 'assets/drill_green.png';
        var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = moneyReceived;

        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);
    }

    function fail()
    {
        failCount++;
        checkGuru();

        imv.failHUD();
        drillImage.src = 'assets/drill_red.png';
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
        imv.neutralHUD();
        drillImage.src = 'assets/drill_yellow.png';
        drillOn = true;
        shakeDrill();
    }

    var drillStopped = function(data)
    {
        drillOn = false;
    }

    var drillLit = function(data)
    {
        lastReceivedLight = parseInt(data);
        if(lastReceivedLight == 1) drillStarted();
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED',imm.stationId+'_DRILL_LIGHT'];
    this.callbacks = [drillStarted, drillStopped, drillLit];
}

