var DrillGame = function()
{
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
    }

    this.drillLit = function(data)
    {
        //Will position drill specifically based on what light is lit, waiting to get data regarding number/position/timing of lights
        switch(data)
        {
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED',imm.stationId+'_DRILL_LIGHT'];
    this.callbacks = [this.drillStarted, this.drillStopped, this.drillLit];
}
