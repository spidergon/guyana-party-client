import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

const SingleMap = ({ onClick, coords }) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!map) {
      const newMap = new Map()
      newMap.initSingle(onClick)
      setMap(newMap)
    } else {
      map.initSingleMarker(coords)
    }
  }, [coords, map, onClick])

  return <div id='map' />
}

SingleMap.propTypes = {
  onClick: PropTypes.func,
  coords: PropTypes.array
}

export default SingleMap
