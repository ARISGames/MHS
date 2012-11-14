var BackerGame = function()
{
    this.wallPoked = function(data)
    {
        if(Math.random() > 0.5)
            ARIS.setItemCount(imm.ITEM_IDS[0], imm.money-15);
        else
            ARIS.setItemCount(imm.ITEM_IDS[0], imm.money+15);
    }

    this.events = [imm.stationId+'_WALL_POKED'];
    this.callbacks = [this.wallPoked];
}
