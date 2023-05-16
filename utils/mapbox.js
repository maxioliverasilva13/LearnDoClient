import { Popup, Marker, Map } from 'mapbox-gl';

export const generateNewMarker = ({ lat, lng, map }) => {
    const popUp = new Popup({ closeButton: false, anchor: 'left', })
        .setHTML(`<div class="popup">Nuevo Seminario <br/>[${lng},  ${lat}]</div>`)

    const marker = new Marker({ color: '#63df29', scale: 1.5, draggable: true })
        .setLngLat([lng, lat])
        .setPopup(popUp)
        .addTo(map)

    return marker;
}

export const initMap = (container, coords) => {
    const map = new Map({
        container,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        pitchWithRotate: false,
        center: coords,
        zoom: 15,
        accessToken: "pk.eyJ1IjoibWF4aW1pbGlhbm9zaWx2YTI3IiwiYSI6ImNsaG5xOHJucDB5OWMzY251cm5oZTV3NXYifQ.7dztKeHUSXirnHZRIaQyMQ",
        doubleClickZoom: false,
    });
    return map;

}