var PusherMan = function(key, auth_url, send_url, channel, eventArray, callbackArray)
{
    console.log('asking pusher');
    this.pusher = new Pusher(key, {'encrypted':true});
    console.log('pusher object created');

    //alert('pusher');

    Pusher.channel_auth_endpoint = auth_url;
    this.channel = this.pusher.subscribe(channel);
    for(var i = 0; i < eventArray.length; i++)
    {
        console.log('pusher subscribing to event: '+eventArray[i]);
        this.channel.bind(eventArray[i], callbackArray[i]);
    }
    this.sendData = function(event, data)
    {
        console.log('sending data');
        var xmlhttp;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST",send_url,true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send('channel='+channel+'&event='+event+'&data='+data); //Async call, don't care about response.
    }
}
