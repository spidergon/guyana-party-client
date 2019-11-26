import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

const MainMap = ({ markers, onMarkerClick }) => {
  useEffect(() => {
    new Map().addMarkers(markers, onMarkerClick)
  }, [markers, onMarkerClick])

  return <div id='map' style={{ height: 'calc(100vh - 54px)' }} />
}

MainMap.propTypes = {
  markers: PropTypes.array,
  onMarkerClick: PropTypes.func
}

export default MainMap
