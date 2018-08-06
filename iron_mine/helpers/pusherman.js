var PusherMan = function(key, auth_url, send_url, channel, eventArray, callbackArray)
{
    this.pusher = new Pusher(key, {'encrypted':true});

    Pusher.channel_auth_endpoint = auth_url;
    this.channel = this.pusher.subscribe(channel);
    for(var i = 0; i < eventArray.length; i++)
        this.channel.bind(eventArray[i], callbackArray[i]);
    this.pusher.connection.bind('connected', function(){
        document.body.classList.remove('no-connection');
    });
    this.pusher.connection.bind('unavailable', function(){
        document.body.classList.add('no-connection');
    });
    this.sendData = function(event, data)
    {
        var xmlhttp;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",send_url,true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send('channel='+channel+'&event='+event+'&data='+data); //Async call, don't care about response.
    }
}
