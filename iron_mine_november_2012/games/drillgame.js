var DrillGame = function()
{
    var drillOn = false;
    var drillPos = 0;
    var drillSpeed = 50; //lower = faster

    var goalMin = 40;
    var goalMax = 60;

    var fail = 100;

    var drillBit = document.getElementById('drillbit');
    var drillDebug = document.getElementById('drilldebug');

    function advanceDrill()
    {
        if(drillOn)
        {
            drillPos++;
            drillBit.style.left = drillPos+'px';
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
            drillPos = 0;
            drillBit.style.left = drillPos+'px';
        }
    }

    this.drillStarted = function(data)
    {
        if(drillPos == 0)
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
