// ==UserScript==
// @name         Nomination page StreetView
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wayfarer.nianticlabs.com/*
// @icon         https://www.google.com/s2/favicons?domain=nianticlabs.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var SVMap;

    function setStreetView(){
        if (document.getElementById("pano") === null){
            let lastPane = document.getElementsByClassName("details-pane__map")[0];
            if (lastPane === undefined){
                console.log("failed to find attach elem");
                return;
            }
            let SVMapElement = document.createElement("div");
            SVMapElement.id = "pano";
            SVMapElement.style.height = "480px";
            lastPane.parentElement.insertBefore(SVMapElement, lastPane.nextSibling);
        }

        var lat = window.wfpp.nominationsApp.selectedNomination.nomination.lat;
        var lng = window.wfpp.nominationsApp.selectedNomination.nomination.lng;

        SVMap = new google.maps.Map(document.getElementById("pano"),{
            center: {
                lat: lat,
                lng: lng
            },
            mapTypeId: "hybrid",
            zoom: 17,
            scaleControl: true,
            scrollwheel: true,
            gestureHandling: 'greedy',
            mapTypeControl: false
        });
        var marker = new google.maps.Marker({
            map: SVMap,
            position: {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            },
            title: window.wfpp.nominationsApp.selectedNomination.nomination.title
        });
        var panorama = SVMap.getStreetView();
        var client = new google.maps.StreetViewService;
        client.getPanoramaByLocation({
            lat: lat,
            lng: lng
        }, 50, function(result, status) {
            if (status === "OK") {
                var point = new google.maps.LatLng(lat,lng);
                var oldPoint = point;
                point = result.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(point, oldPoint);
                panorama.setPosition(point);
                panorama.setPov({
                    heading: heading,
                    pitch: 0,
                    zoom: 1
                });
                panorama.setMotionTracking(false);
                panorama.setVisible(true);
            }
        });

        console.log("[WayFarer-] Setting Nomination Streetview image");
    }

    window.addEventListener("WFMNominationSelected", setStreetView);
        console.log("test");
})();