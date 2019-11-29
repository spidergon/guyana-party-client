import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

const MainMap = ({ setMarkers, onMarkerClick }) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!map) {
      const newMap = new Map()
      newMap.initMarkers(setMarkers, onMarkerClick)
      setMap(newMap)
    }
  }, [map, onMarkerClick, setMarkers])

  return <div id='map' />
}

MainMap.propTypes = {
  setMarkers: PropTypes.func,
  onMarkerClick: PropTypes.func
}

export default MainMap
