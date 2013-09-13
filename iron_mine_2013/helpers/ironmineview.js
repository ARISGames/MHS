var IronMineView = function()
{
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
    this.notice = document.createElement('div');
    this.notice.setAttribute('id','notice');
    this.notice.fade = 0; //0-120

    this.hud = document.createElement('div');
    this.hud.setAttribute('id','hud');
    this.haveDisplay = document.createElement('div');
    this.haveDisplay.setAttribute('id','havedisplay');
    this.haveDisplay.innerHTML = '$0.00';
    this.wantDisplay = document.createElement('div');
    this.wantDisplay.setAttribute('id','wantdisplay');
    this.wantDisplay.innerHTML = 'GOAL: $0.00';
    this.hud.appendChild(this.haveDisplay);
    this.hud.appendChild(this.wantDisplay);

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
        this.currentGuru     = this.gurus[game];
        this.currentGuruTalk = this.gurutalks[game];

        this.currentGame.style.display = 'block';
        this.currentActivity.appendChild(this.hud);
    }

    this.displayVid = function()
    {
        if(this.currentVid)      this.currentVid.style.display      = 'block';
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
        if(this.currentGuru)
        {
            this.currentGuru.style.display = 'block';
            this.currentGuruTalk.innerHTML = message;
        }
    }

    this.hideGuru = function()
    {
        if(this.currentGuru) this.currentGuru.style.display = 'none';
    }

    this.displayNotice = function(notice)
    {
        var alreadyTicking = false;
        this.notice.innerHTML = notice;
        if(this.notice.fade != 0) alreadyTicking = true;
        this.notice.fade = 120;
        this.notice.style.display = 'block';
        if(!alreadyTicking) tickNotice();
    }

    var tickNotice = function()
    {
        this.notice.style.color = 'rgba(255,255,255,'+(this.notice.fade/120)+')';
        this.notice.fade--;
        if(this.notice.fade > 0)
            setTimeout(tickNotice, 10);
        else
            hideNotice();
    }

    var hideNotice = function()
    {
        this.notice.fade = 0;
        this.notice.style.color = 'rgba(255,255,255,0.0)';
        this.notice.style.display = 'none';
    }

}

