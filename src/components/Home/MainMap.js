import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

const MainMap = ({ markers, onMarkerClick }) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!map) {
      const newMap = new Map()
      newMap.addMarkers(markers, onMarkerClick)
      setMap(newMap)
    }
  }, [map, markers, onMarkerClick])

  return <div id='map' />
}

MainMap.propTypes = {
  markers: PropTypes.array,
  onMarkerClick: PropTypes.func
}

export default MainMap
