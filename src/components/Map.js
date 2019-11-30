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

  initMarkers = (setMarkers, onClickFn, fallback) => {
    const markers = [
      {
        position: [4.93, -52.3],
        title: "Event 1: un nom d'évènement super long !",
        slug: 'event1',
        photo: ''
      },
      { position: [51.51, -0.1], title: 'Event 2', slug: 'event2', photo: '' },
      {
        position: [51.49, -0.05],
        title: 'Event 3',
        slug: 'event3',
        photo: ''
      }
    ]
    setMarkers(markers)
    try {
      markers.forEach(marker => {
        const latlng = { lat: marker.position[0], lng: marker.position[1] }
        delete marker.position
        const newMarker = L.marker(latlng, {
          title: marker.title
        }).bindPopup(`
          <p>
            <strong>${marker.title}</strong><br />
            Organisateur: <i>group name</i><br />
            <i>Le 13/11/2019 à 18:03</i><br />
            <code style="font-size:12px;">45° 51′ 08″ N 1° 15′ 53″ E</code>
          </p>
        `)
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
