var TipiViews = function()
{
    var self = this;

    self.displayLoading = function()
    {
        document.getElementById('vidfile').pause();
        document.getElementById('vid').style.display     = 'none';
        document.getElementById('loading').style.display = 'block';
    }

    self.displayVid = function()
    {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('vid').style.display     = 'block';
        document.getElementById('vidfile').play();
    }
}

