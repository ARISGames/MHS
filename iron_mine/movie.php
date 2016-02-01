<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Iron Mine</title>
<link href="style.css" rel="stylesheet" type="text/css"></link>
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

    <div id='loading' class='full_screen'>&nbsp;<img height='12px' src='assets/spinner.gif'></img> Loading...</div>

    <div id='drillgame' class='game drill_bg full_screen'>
        <div id='drillvid' class='vid'>
            <video id="drillvidfile" width="320" height="504" webkit-playsinline>
                <source src="assets/intro.mp4" type="video/mp4">
            </video>
            <div class='bottombutton' onclick='ARIS.exitToScanner("Scan something in the mine!");'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
    </div>

</body>

</html>
