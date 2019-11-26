import L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MarkerClusterGroup } from 'leaflet.markercluster'

class Map {
  constructor (center, zoom) {
    this.map = null
    this.markerClusterGroup = new MarkerClusterGroup()
    this.center = center || [4.93, -52.3]
    this.zoom = zoom || 14
    this.init()
    this.locate()
  }

  init = () => {
    this.map = L.map('map', {
      center: this.center,
      zoom: this.zoom,
      zoomControl: false, // remove default zoom control
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
          minZoom: 3,
          maxZoom: 19
        })
      ]
    })
    L.control
      .zoom({ zoomInTitle: 'Zoom +', zoomOutTitle: 'Zoom -' })
      .addTo(this.map)
  }

  locate = () => {
    this.map
      .locate({ setView: true, maxZoom: 16 })
      .on('locationfound', ({ latlng, accuracy }) => {
        L.circle(latlng, {
          color: '#dadce0',
          fillColor: '#fff',
          fillOpacity: 0.3,
          radius: accuracy
        })
          .addTo(this.map)
          .bindPopup('Vous êtes situé(e) approximativement dans cette zone.')
          .openPopup()
      })
      .on('locationerror', ({ message }) => console.log(message))
  }

  addMarkers = (markers, onClickFn, fallback) => {
    try {
      markers.forEach(marker => {
        const latlng = { lat: marker.position[0], lng: marker.position[1] }
        delete marker.position
        const newMarker = L.marker(latlng, {
          title: marker.title
        }).bindPopup(`<strong>${marker.title}</strong><br>Content`)
        newMarker.on('click', () => {
          if (typeof onClickFn === 'function') {
            onClickFn({ ...marker, position: latlng })
          }
        })
        this.markerClusterGroup.addLayer(newMarker) // add the marker to the group
      })
      this.map.addLayer(this.markerClusterGroup) // add the group to the map
    } catch (error) {
      console.error(error)
      if (typeof fallback === 'function') fallback(error)
    }
  }
}

export default Map
