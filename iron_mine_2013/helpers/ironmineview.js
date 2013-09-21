var IronMineView = function()
{
    var self = this;

    this.currentGame     = null;
    this.currentVid      = null;
    this.currentIntro    = null;
    this.currentActivity = null;
    this.currentGuru     = null;
    this.currentGuruTalk = null;

    this.drillGame     = document.getElementById('drillgame');
    this.drillVid      = document.getElementById('drillvid');
    this.drillIntro    = document.getElementById('drillintro');
    this.drillActivity = document.getElementById('drillactivity');
    this.drillGuru     = document.getElementById('drillguru');
    this.drillGuruTalk = document.getElementById('drillgurutalk');

    this.dynamiteGame     = document.getElementById('dynamitegame');
    this.dynamiteVid      = document.getElementById('dynamitevid');
    this.dynamiteIntro    = document.getElementById('dynamiteintro');
    this.dynamiteActivity = document.getElementById('dynamiteactivity');
    this.dynamiteGuru     = document.getElementById('dynamiteguru');
    this.dynamiteGuruTalk = document.getElementById('dynamitegurutalk');

    this.backerGame     = document.getElementById('backergame');
    this.backerVid      = document.getElementById('backervid');
    this.backerIntro    = document.getElementById('backerintro');
    this.backerActivity = document.getElementById('backeractivity');
    this.backerGuru     = document.getElementById('backerguru');
    this.backerGuruTalk = document.getElementById('backergurutalk');

    this.strikeGame     = document.getElementById('strikegame');
    this.strikeVid      = document.getElementById('strikevid');
    this.strikeIntro    = document.getElementById('strikeintro');
    this.strikeActivity = document.getElementById('strikeactivity');
    this.strikeGuru     = document.getElementById('strikeguru');
    this.strikeGuruTalk = document.getElementById('strikegurutalk');

    this.games      = [this.drillGame,     this.dynamiteGame,     this.backerGame,     this.strikeGame];
    this.vids       = [this.drillVid,      this.dynamiteVid,      this.backerVid,      this.strikeVid];
    this.intros     = [this.drillIntro,    this.dynamiteIntro,    this.backerIntro,    this.strikeIntro];
    this.activities = [this.drillActivity, this.dynamiteActivity, this.backerActivity, this.strikeActivity];
    this.gurus      = [this.drillGuru,     this.dynamiteGuru,     this.backerGuru,     this.strikeGuru];
    this.gurutalks  = [this.drillGuruTalk, this.dynamiteGuruTalk, this.backerGuruTalk, this.strikeGuruTalk];

    //These 'views' are injected into the current game
    this.moneydelta = document.createElement('div');
    this.moneydelta.setAttribute('id','moneydelta');
    this.moneydelta.fade = 0; //0-960
    this.moneydelta.delta = 0;

    this.hud = document.createElement('div');
    this.hud.setAttribute('id','hud');
    this.haveDisplay = document.createElement('div');
    this.haveDisplay.setAttribute('id','havedisplay');
    this.haveDisplay.innerHTML = '$0.00';
    this.wantDisplay = document.createElement('div');
    this.wantDisplay.setAttribute('id','wantdisplay');
    this.wantDisplay.innerHTML = '&nbsp;&nbsp;GOAL: $0.00';
    this.hud.appendChild(this.haveDisplay);
    this.hud.appendChild(this.wantDisplay);
    this.hud.appendChild(this.moneydelta);

    this.failHUD    = function() { this.haveDisplay.style.color = "#C42032"; }
    this.neutralHUD = function() { this.haveDisplay.style.color = "#EDB11F"; }
    this.successHUD = function() { this.haveDisplay.style.color = "#009344"; }

    this.displayGame = function(game)
    {
        document.getElementById('loading').style.display = 'none';

        if(this.currentGame)     this.currentGame.style.display     = 'none';
        if(this.currentVid)      this.currentVid.style.display      = 'none';
        if(this.currentIntro)    this.currentIntro.style.display    = 'none';
        if(this.currentActivity) this.currentActivity.style.display = 'none';
        if(this.currentGuru)     this.currentGuru.style.display     = 'none';

        this.currentGame     = this.games[game];
        this.currentVid      = this.vids[game];
        this.currentIntro    = this.intros[game];
        this.currentActivity = this.activities[game];
        this.currentGuru     = this.gurus[game]; this.currentGuru.progress = 50;
        this.currentGuruTalk = this.gurutalks[game];

        this.currentGame.style.display = 'block';
        this.currentActivity.appendChild(this.hud);
    }

    this.displayVid = function()
    {
        if(this.currentVid)    { this.currentVid.style.display      = 'block'; this.currentVid.play(); }
        if(this.currentIntro)    this.currentIntro.style.display    = 'none';
        if(this.currentActivity) this.currentActivity.style.display = 'none';
        if(this.currentGuru)     this.currentGuru.style.display     = 'none';

        
    }

    this.displayIntro = function()
    {
        if(this.currentVid)      this.currentVid.style.display      = 'none';
        if(this.currentIntro)    this.currentIntro.style.display    = 'block';
        if(this.currentActivity) this.currentActivity.style.display = 'none';
        if(this.currentGuru)     this.currentGuru.style.display     = 'none';
    }

    this.displayActivity = function()
    {
        if(this.currentVid)      this.currentVid.style.display      = 'none';
        if(this.currentIntro)    this.currentIntro.style.display    = 'none';
        if(this.currentActivity) this.currentActivity.style.display = 'block';
        if(this.currentGuru)     this.currentGuru.style.display     = 'none';
    }

    this.displayGuruWithMessage = function(message)
    {
        self.currentGuru.style.display = 'block';
        self.currentGuruTalk.innerHTML = message;

        var alreadyTicking = (self.currentGuru.progress != 50);
        self.currentGuru.progress = 0;
        if(!alreadyTicking) tickdisplayguru();
    }

    function tickdisplayguru()
    {
        self.currentGuru.progress++;
        self.currentGuru.style.top = (10*(50-self.currentGuru.progress))+'px';
        if(self.currentGuru.progress < 50)
            setTimeout(tickdisplayguru, 10);
    }

    this.hideGuru = function()
    {
        if(self.currentGuru)
        {
            var alreadyTicking = (self.currentGuru.progress != 50);
            self.currentGuru.progress = 0;
            if(!alreadyTicking) tickhideguru();
        }
    }
    
    function tickhideguru()
    {
        self.currentGuru.progress++;
        self.currentGuru.style.top = (10*self.currentGuru.progress)+'px';
        if(self.currentGuru.progress < 50)
            setTimeout(tickhideguru,10);
        else
            self.currentGuru.style.display = 'none';
    }

    this.displayMoneyDelta = function(delta)
    {
        if(delta == 0) return;

        
        if(delta > 0) self.moneydelta.style.color = "#009344";
        else          self.moneydelta.style.color = "#C42032";
        self.moneydelta.delta = delta;

        if(delta < 0) delta *= -1;//so we can parse it to text without worrying about - signs
        self.moneydelta.innerHTML = (self.moneydelta.delta > 0 ? '+$' : '-$')+((delta-(delta%100))/100)+'.'+(delta%100 < 10 ? '0' : '')+(delta%100);
        var alreadyTicking = (self.moneydelta.fade != 0);
        self.moneydelta.fade = 960;
        self.moneydelta.style.display = 'block';
        if(!alreadyTicking) tickmoneydelta();
    }

    var tickmoneydelta = function()
    {
        if(self.moneydelta.delta > 0)
        {
            self.moneydelta.style.color = "rgba(0,147,68,"+(self.moneydelta.fade/960)+")";
            self.moneydelta.style.top = (200-1/8*(960-self.moneydelta.fade))+'px';
        }
        else
        {
            self.moneydelta.style.color = "rgba(196,32,50,"+(self.moneydelta.fade/960)+")";
            self.moneydelta.style.top = (200+1/8*(960-self.moneydelta.fade))+'px';
        }

        self.moneydelta.fade--;
        if(self.moneydelta.fade > 0)
            setTimeout(tickmoneydelta, 10);
        else
        {
            self.moneydelta.style.color = 'rgba(255,255,255,0.0)';
            self.moneydelta.style.display = 'none';
        }
    }

}

