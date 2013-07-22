var DrillGame = function()
{
    var self = this;

    //Load images
    var tmpYellowLightImage = new Image();
    var tmpRedLightImage = new Image();
    var tmpGreenLightImage = new Image();
    tmpYellowLightImage.setAttribute('src','assets/yellow_btn_on.png');
    tmpRedLightImage.setAttribute('src','assets/red_btn_on.png');
    tmpGreenLightImage.setAttribute('src','assets/green_btn_on.png');
    //Won't do anything with these ^, this just brings them into memory

    var lastReceivedLight = 0;

    var drillPosMin = -349;
    var drillPosMax = 0;

    var drillOn = false;
    var drillPos = drillPosMin;
    var drillSpeed = 50; //lower = faster

    var goalMin = -125;
    var goalMax = -75;

    var fail = 100;

    var moneyReceived = 40;
    var minMoneyReceived = 3;
    var maxMoneyReceived = 40;
    var moneyLost = 60;

    var drillBit = document.getElementById('drillbit');
    var drillDebug = document.getElementById('drilldebug');

    function advanceDrill()
    {
        if(drillOn)
        {
            drillPos+=1;
            drillBit.style.bottom = drillPos+'px';
            setTimeout(advanceDrill, drillSpeed);
        }
        else
        {
            var moneyToReceive = minMoneyReceived + Math.round(Math.random()*(maxMoneyReceived-minMoneyReceived));
            if(lastReceivedLight == 5) { ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money+moneyToReceive); imv.displayNotice("You've gained "+moneyToReceive+" cents!"); }
            else if(lastReceivedLight < 2) ; //Do nothing / give em a freebie for being so shallow
            else { if(imm.money < moneyLost) imm.money = moneyLost; ARIS.setItemCount(imm.ITEM_ID_MONEY, imm.money-moneyLost); imv.displayFail("You've lost "+moneyLost+" cents!"); } //<- trust this
            lastReceivedLight = 0;
            recedeDrill();
        }
    }

    function recedeDrill()
    {
        if(!drillOn)
        {
            drillPos = drillPosMin;
            drillBit.style.bottom = drillPos+'px';
        }
    }

    this.drillStarted = function(data)
    {
        drillOn = true;
        advanceDrill();
    }
    
    this.drillStopped = function(data)
    {
        drillOn = false;
        document.getElementById('light1').src = 'assets/yellow_btn_off.png';
        document.getElementById('light2').src = 'assets/yellow_btn_off.png';
        document.getElementById('light3').src = 'assets/yellow_btn_off.png';
        document.getElementById('light4').src = 'assets/yellow_btn_off.png';
        document.getElementById('light5').src = 'assets/green_btn_off.png';
        document.getElementById('light6').src = 'assets/yellow_btn_off.png';
        document.getElementById('light7').src = 'assets/red_btn_off.png';
    }

    this.drillLit = function(data)
    {
        //Will position drill specifically based on what light is lit, waiting to get data regarding number/position/timing of lights
        lastReceivedLight = data;
        switch(parseInt(data))
        {
            case 1:
                self.drillStarted();
                document.getElementById('light1').src = 'assets/yellow_btn_on.png';
                drillPos = -325;
                break;
            case 2:
                document.getElementById('light2').src = 'assets/yellow_btn_on.png';
                drillPos = -275;
                break;
            case 3:
                document.getElementById('light3').src = 'assets/yellow_btn_on.png';
                drillPos = -225;
                break;
            case 4:
                document.getElementById('light4').src = 'assets/yellow_btn_on.png';
                drillPos = -175;
                break;
            case 5:
                document.getElementById('light5').src = 'assets/green_btn_on.png';
                drillPos = -125;
                break;
            case 6:
                document.getElementById('light6').src = 'assets/yellow_btn_on.png';
                drillPos = -75;
                break;
            case 7:
                document.getElementById('light7').src = 'assets/red_btn_on.png';
                drillPos = -25;
                break;
            default:
                break;
        }
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED',imm.stationId+'_DRILL_LIGHT'];
    this.callbacks = [this.drillStarted, this.drillStopped, this.drillLit];
}
