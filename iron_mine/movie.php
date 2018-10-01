<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Iron Mine</title>

<style type="text/css">

div,span,html,body
{
    padding:0px;
    margin:0px;
}

body
{
    user-select:none;
    -webkit-user-select:none;
    font-family:"HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;
}

.full_screen
{
    width:320px;
    height:504px;
    position:absolute;
    top:0px;
    left:0px;
    overflow:hidden;
    background-size:320px 504px;
}

.game
{
    display:none;
}

.vid
{
    display:none;
}

.drill_bg
{
    background-image:url("arismedia://701184.png");
}

.bottombutton
{
    width:320px;
    height:44px;
    position:absolute;
    left:0px;
    bottom:0px;
    border-top:1px solid gray;
    background-color:rgba(255,255,255,0.9);
}

.forwardarrow
{
    display:block;
    width:24px;
    position:absolute;
    right:10px;
    bottom:10px;
}

</style>

<script type="text/javascript">

    //Note- I reference "drill" and have the infrastructure of index.php to keep things consistent with the least amount of effort. 

    function begin()
    {
        document.getElementById('drillvid').style.display = 'block';
        document.getElementById('drillgame').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        document.getElementById('drillvidfile').play();
    }

    document.addEventListener( "DOMContentLoaded", begin, false );
    window.onerror = function(msg, url, linenumber) 
    {
        //alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
        return true;
    };
</script>
</head>

<body class='full_screen'>

    <div id='loading' class='full_screen'>&nbsp;<img height='12px' src="arismedia://700842.gif"></img> Loading...</div>

    <div id='drillgame' class='game drill_bg full_screen'>
        <div id='drillvid' class='vid'>
            <video id="drillvidfile" width="320" height="504" playsinline>
                <source src="arismedia://700933.mp4" type="video/mp4">
            </video>
            <div class='bottombutton' onclick='ARIS.exitToScanner("Scan something in the mine!");'>
                <img src="arismedia://700840.png" class='forwardarrow' />
            </div>
        </div>
    </div>

</body>

</html>
