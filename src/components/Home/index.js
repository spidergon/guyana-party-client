import React from 'react'
import styled from 'styled-components'
import Map from './MainMap'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 67% auto;
  #map-section {
    padding: 5px;
  }
`

function Home () {
  const markers = [
    { position: [4.93, -52.3], title: 'Popup 1' },
    { position: [51.51, -0.1], title: 'Popup 2' },
    { position: [51.49, -0.05], title: 'Popup 3' }
  ]

  const onMarkerClick = data => {
    console.log(data)
  }

  return (
    <Wrapper>
      <section id='map-section'>
        {typeof window !== 'undefined' && (
          <Map markers={markers} onMarkerClick={onMarkerClick} />
        )}
      </section>
      <section>List</section>
    </Wrapper>
  )
}

export default Home
