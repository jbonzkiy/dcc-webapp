<?php if(isset($_SESSION['ERROR'])){ ?>
	
<div class="ui red message"><i class="close icon" onclick="removeErrorMsg(this);"></i><div class="header"><?php echo $_SESSION['ERROR']; ?></div></div>
<script type="text/javascript">
	function removeErrorMsg(elem){elem.parentElement.remove();}
</script>
<?php } ?>

<!--Welcome home! <a href="<?php echo base_url(); ?>weather/logout">Logout</a>-->

<div>
    <!-- Paste the HTML code generated from the Windy.com Share panel here -->
</div>

<!-- Form to input latitude and longitude values -->
<!--<form id="location-form">
    <label for="latitude">Latitude:</label>
    <input type="text" name="latitude" id="latitude">

    <label for="longitude">Longitude:</label>
    <input type="text" name="longitude" id="longitude">

    <button type="submit">Search</button>
</form>-->

<script>
    // Add event listener to the form
    document.getElementById('location-form').addEventListener('submit', function(event) {
        // Prevent the form from submitting to the server
        event.preventDefault();

        // Get the latitude and longitude values from the form input
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        // Construct the Windy.com URL with the latitude and longitude values
        const url = `https://www.windy.com/?${latitude},${longitude},9`;

        // Redirect the user to the Windy.com URL
        window.location.href = url;
    });
</script>
<?php
$lat = '8.477217'; // Set the latitude
$lng = '124.645920';  // Set the longitude
?>

<iframe src="https://embed.windy.com/vv1VVyazhqJ1G9flaRqIMm4AEIPwuhOG?lat=<?php echo $lat ?>&lon=<?php echo $lng ?>&zoom=8&level=surface&overlay=rain" width="100%" height="873"></iframe>
<!--<center>
<iframe src="https://embed.windy.com/vv1VVyazhqJ1G9flaRqIMm4AEIPwuhOG" width="100%" height="873px"></iframe>
</center>-->


