import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

import { requestMarkers } from '../../lib/services/eventService'

const MainMap = ({ setMarkers, onMarkerClick, setActions }) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!map) {
      const newMap = new Map()
      newMap.initMarkers(requestMarkers, setMarkers, onMarkerClick)
      setActions(newMap.getActions())
      setMap(newMap)
    }
  }, [map, onMarkerClick, setActions, setMarkers])

  return <div id='map' />
}

MainMap.propTypes = {
  setMarkers: PropTypes.func,
  onMarkerClick: PropTypes.func,
  setActions: PropTypes.func
}

export default MainMap
