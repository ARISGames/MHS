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
            if(drillPos >= fail) { ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-15); drillOn = false; recedeDrill(); }
            else setTimeout(advanceDrill, drillSpeed);
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
            drillPos--;
            drillBit.style.left = drillPos+'px';
            if(drillPos > 0) setTimeout(recedeDrill, drillSpeed);
        }
    }



    this.drillStarted = function(data)
    {
        //alert('start that drill!');
        if(drillPos == 0)
        {
            drillOn = true;
            advanceDrill();
        }
    }
    
    this.drillStopped = function(data)
    {
        //alert('stop that drill!');
        drillOn = false;
    }

    this.events = [imm.stationId+'_DRILL_STARTED',imm.stationId+'_DRILL_STOPPED'];
    this.callbacks = [this.drillStarted, this.drillStopped];
}
