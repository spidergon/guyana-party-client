import L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MarkerClusterGroup } from 'leaflet.markercluster'
import { dateToStr } from '../lib/utils'

const POINTS = [
  [4.931609, -52.3009], // Cayenne
  [14.616065, -61.05878], // Fort-de-France
  [16.237687, -61.534042], // Point-à-Pitre
  [-20.89066, 55.455054], // Saint-Denis (Réunion)
  [48.856614, 2.3522219], // Paris
  [-12.7812, 45.2282] // Mamoudzou (Mayotte)
]

class Map {
  constructor (center, zoom) {
    this.map = null
    this.markerClusterGroup = new MarkerClusterGroup()
    this.center = center || POINTS[0]
    this.zoom = zoom || 14
    this.locateCircle = null
    this.isSingle = false
    this.singleMarker = null
    this.noRandom = false
    this.islocateDenied = false
    this.viewActions = {}
    this.search = ''
    this.init()
    this.locate(false)
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
      .on('moveend', () => !this.isSingle && this.showMarkers())
      .on('locationfound', ({ latlng, accuracy }) => {
        console.log('My position:', { lat: latlng.lat, lng: latlng.lng })
        if (this.locateCircle) this.map.removeLayer(this.locateCircle)
        this.locateCircle = L.circle(latlng, {
          color: '#dadce0',
          fillColor: '#fff',
          fillOpacity: 0.3,
          radius: accuracy
        })
        this.map.addLayer(this.locateCircle)
        // .bindPopup('Vous êtes situé(e) approximativement dans cette zone.')
        // .openPopup()
      })
      .on('locationerror', ({ message }) => {
        console.log(message)
        this.islocateDenied = true
        if (!this.noRandom) this.random()
      })

    L.control
      .zoom({ zoomInTitle: 'Zoom +', zoomOutTitle: 'Zoom -' })
      .addTo(this.map)
  }

  locate = (noRandom = true) => {
    this.noRandom = noRandom
    this.map.locate({ setView: true, maxZoom: 16 })
  }

  random = () => {
    const pos = POINTS[Math.floor(Math.random() * POINTS.length)]
    this.map.setView(pos, this.zoom)
    console.log('Random position:', { lat: pos[0], lng: pos[1] })
  }

  initSingle = onClick => {
    this.isSingle = true
    if (typeof onClick !== 'function') return
    this.map.on('click', ({ latlng }) => {
      console.log('Marker position:', { lat: latlng.lat, lng: latlng.lng })
      if (this.singleMarker) this.map.removeLayer(this.singleMarker)
      this.singleMarker = L.marker(latlng, {
        title: `Coordonnées : ${latlng.lat}, ${latlng.lng}`
      })
      this.map.addLayer(this.singleMarker)
      onClick(latlng)
    })
  }

  initSingleMarker = coords => {
    if (!this.singleMarker && coords && coords.length === 2) {
      console.log('Marker position:', { lat: coords[1], lng: coords[0] })
      this.singleMarker = L.marker(
        { lat: coords[1], lng: coords[0] },
        { title: `Coordonnées : ${coords[1]}, ${coords[0]}` }
      )
      this.map.addLayer(this.singleMarker)
    }
  }

  initMarkers = (requestMarkers, setMarkers, onClickFn) => {
    this.viewActions = { requestMarkers, setMarkers, onClickFn }

    const searchInput = document.querySelector('.search_bg')
    if (searchInput) {
      searchInput.addEventListener('keydown', ({ target, key, keyCode }) => {
        this.search = target.value
        if (key === 'Enter' || keyCode === 13) {
          this.showMarkers(target.value)
        }
      })
      searchInput.addEventListener('search', ({ target: { value } }) => {
        this.search = value
      })
    }
  }

  showMarkers = (search = this.search) => {
    this.viewActions.requestMarkers(
      search,
      this.getBox(),
      markers => {
        try {
          this.viewActions.setMarkers(markers)
          this.markerClusterGroup.clearLayers()
          markers.forEach(marker => {
            const latlng = {
              lat: marker.location.coordinates[1],
              lng: marker.location.coordinates[0]
            }
            const newMarker = L.marker(latlng, {
              title: marker.name
            }).bindPopup(`
          <p>
            <strong>${marker.name}</strong><br />
            Organisateur: <i>${marker.group.name}</i><br />
            <i>Le ${dateToStr(marker.startDate)}</i><br />
            <code style="font-size:12px;">45° 51′ 08″ N 1° 15′ 53″ E</code>
          </p>
        `)
            newMarker.on('click', () => {
              this.viewActions.onClickFn(marker)
            })
            this.markerClusterGroup.addLayer(newMarker)
          })
          this.map.addLayer(this.markerClusterGroup)
        } catch (error) {
          console.error(error)
        }
      },
      error => console.log(error)
    )
  }

  getBox = () => {
    const {
      _southWest: { lng: x1, lat: y1 },
      _northEast: { lng: x2, lat: y2 }
    } = this.map.getBounds()
    return [
      [x1, y1],
      [x2, y2]
    ]
  }

  getActions = () => ({
    locate: this.locate,
    random: this.random,
    isDenied: () => this.islocateDenied
  })
}

export default Map
