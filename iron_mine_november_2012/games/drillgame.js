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

    var drillPosMin = -349;
    var drillPosMax = 0;

    var drillOn = false;
    var drillPos = drillPosMin;
    var drillSpeed = 50; //lower = faster

    var goalMin = -300;
    var goalMax = 0;

    var fail = 100;

    var drillBit = document.getElementById('drillbit');
    var drillDebug = document.getElementById('drilldebug');

    function advanceDrill()
    {
        if(drillOn)
        {
            drillPos+=2;
            drillBit.style.bottom = drillPos+'px';
            setTimeout(advanceDrill, drillSpeed);
        }
        else
        {
            if(drillPos > goalMin && drillPos < goalMax) ARIS.setItemCount(imm.ITEM_IDS[0], imm.money+15);
            else ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-15);
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
        if(drillPos == drillPosMin)
        {
            drillOn = true;
            advanceDrill();
        }
    }
    
    this.drillStopped = function(data)
    {
        drillOn = false;
        document.getElementById('light1').src = 'assets/yellow_btn_off.png';
        document.getElementById('light2').src = 'assets/yellow_btn_off.png';
        document.getElementById('light3').src = 'assets/yellow_btn_off.png';
        document.getElementById('light4').src = 'assets/green_btn_off.png';
        document.getElementById('light5').src = 'assets/yellow_btn_off.png';
        document.getElementById('light6').src = 'assets/yellow_btn_off.png';
        document.getElementById('light7').src = 'assets/red_btn_off.png';
    }

    this.drillLit = function(data)
    {
        //Will position drill specifically based on what light is lit, waiting to get data regarding number/position/timing of lights
        switch(parseInt(data))
        {
            case 1:
                self.drillStarted();
                document.getElementById('light1').src = 'assets/yellow_btn_on.png';
                break;
            case 2:
                document.getElementById('light2').src = 'assets/yellow_btn_on.png';
                break;
            case 3:
                document.getElementById('light3').src = 'assets/yellow_btn_on.png';
                break;
            case 4:
                document.getElementById('light4').src = 'assets/green_btn_on.png';
                break;
            case 5:
                document.getElementById('light5').src = 'assets/yellow_btn_on.png';
                break;
            case 6:
                document.getElementById('light6').src = 'assets/yellow_btn_on.png';
                break;
            case 7:
                document.getElementById('light7').src = 'assets/red_btn_on.png';
                break;
            default:
                break;
        }
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED',imm.stationId+'_DRILL_LIGHT'];
    this.callbacks = [this.drillStarted, this.drillStopped, this.drillLit];
}
