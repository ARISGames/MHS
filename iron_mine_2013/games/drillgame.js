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
            imv.displayGuruWithMessage("I have a moustache!");

            if(lastReceivedLight == greenLight) succeed();
            else if(lastReceivedLight < 2)      ; //Do nothing / give em a freebie for being so shallow
            else                                fail();
            lastReceivedLight = 0;
        }
    }

    function succeed()
    {
        imv.successHUD();
        drillImage.src = 'assets/drill_green.png';
        var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
        if(imm.currentLevel == 1) moneyToReceive = moneyReceived;

        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive);
    }

    function fail()
    {
        imv.failHUD();
        drillImage.src = 'assets/drill_red.png';
        if(imm.money < moneyLost) imm.money = moneyLost;
        ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost);
    }

    this.drillStarted = function(data)
    {
        imv.neutralHUD();
        drillImage.src = 'assets/drill_yellow.png';
        drillOn = true;
        shakeDrill();
    }

    this.drillStopped = function(data)
    {
        drillOn = false;
    }

    this.drillLit = function(data)
    {
        lastReceivedLight = parseInt(data);
        if(lastReceivedLight == 1) self.drillStarted();
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED',imm.stationId+'_DRILL_LIGHT'];
    this.callbacks = [this.drillStarted, this.drillStopped, this.drillLit];
}

