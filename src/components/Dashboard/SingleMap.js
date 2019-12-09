import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

const SingleMap = ({ onClick, coords, locate, viewOffset, zoom }) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!map) {
      const newMap = new Map(locate)
      newMap.initSingle(onClick)
      setMap(newMap)
    } else {
      map.initSingleMarker(coords, viewOffset, zoom)
    }
  }, [coords, locate, map, onClick, viewOffset, zoom])

  return <div id='map' />
}

SingleMap.propTypes = {
  onClick: PropTypes.func,
  coords: PropTypes.array,
  locate: PropTypes.bool,
  viewOffset: PropTypes.number,
  zoom: PropTypes.number
}

export default SingleMap
