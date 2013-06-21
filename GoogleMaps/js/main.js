
(function(){
        // Visual refresh - new map design
        google.maps.visualRefresh = true;

        var map;
        var markers = [];
        var iterator = 0;
        var marker;
        var imagePinYou = { url: 'img/pins/NeedleLeftYellow2.png' };
        var imagePin = { url: 'img/pins/FlagRightGreen.png' };

        var locations = [
            ['Cambridge Heath', '51.52228943994606', '-0.0557288601994', 'Huge Twin'],
            ['Mile End', '51.521316692137624', '-0.03298055380584', 'Mile End Underground Double Room with'],
            ['Charington House', '51.52148835351556', '-0.0493194684386', 'Double Bedroom available in spatious 2 bedroom flat'],
            ['Thornaby House', '51.52777115994894', '-0.0600076802074', 'MASSIVE DOUBLE ROOM CLOSE TO SOREDICHTH'],
            ['Special', '51.51906983543496', '-0.0645863413810', 'explosion..lol']
        ];

        function initialize (lat, lng, title, copy) {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var markerU = new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon: imagePinYou,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        title: 'Where are you?'
                    });
                    var infowindowU = new google.maps.InfoWindow({
                        map:map,
                        position:pos
                        //content: 'Your Location!'
                    });

                    google.maps.event.addListener(markerU, 'click', (function(markerU) {
                        return function () {
                            var contentInfo = '<h1>You are apprently here!</h1>';
                            infowindowU.setContent(contentInfo);
                            infowindowU.open(map, markerU);
                        }
                    })(markerU));
                }, function () {
                    handleNoGeolocation(true);
                });    
            } else {
                handleNoGelocation(false);
            }

            lat = (typeof lat === 'undefined') ? 51.52148835351556 : lat;
            lng = (typeof lng === 'undefined') ? -0.0493194684386 : lng;
            title = (typeof title === 'undefined') ? 'Title' : title;
            copy = (typeof copy === 'undefined') ? 'Copy' : copy; 
            
            makemap (lat, lng, title, copy);
        }

        // Make the map
        //
        function makemap (lat, lng, title, copy) {
            var latitude = lat, longitude = lng, title = title, copy = copy;
                
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            
            var mapOptions = {
                center: myLatlng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

            setTimeout(function () { addMarker(myLatlng, title, copy); }, 500);
            map.setCenter(myLatlng);  
        }

        // Add a marker
        //
        function addMarker (myLatlng, title, copy) {
            /*var contentString = '<div class="content"><h1>' + title + '</h1><br/><div class="copy">' + copy + '</div></div>';
            var test = 'test it now';
            var infowindow = new google.maps.InfoWindow({
                content: contentString + test
            });*/
            
            var infowindow = new google.maps.InfoWindow();

            for (var i = 0, locationLength = locations.length; i < locationLength; i+=1) {

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]), //myLatlng,
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    title: 'Location!'
                });
                
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function () {
                        var contentInfo = '<div class="bubbleInfo"><h1>' + locations[i][0] + '</h1><br/><span class="descrp">' + locations[i][3] + '</span></div>';
                        infowindow.setContent(contentInfo);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
            //marker.setMap(map);
        }

        // Handle no geolocation
        //
        function handleNoGelocation(errorFlag) {
            if(errorFlag) {
                var content = 'Error: The Geolocation service failed.';
            } else {
                var content = 'Error: Your browser does\'t support geolocation.';
            }

            var options = {
                map: map,
                position: new google.maps.LatLng(60, 105),
                content: content
            };

            var infowindow = new google.maps.InfoWindow(options);
            map.setCenter(options.position);
        }

        // Initate the map
        //
        google.maps.event.addDomListener(window, 'load', function() { initialize(); });
    }());