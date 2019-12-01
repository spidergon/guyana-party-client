import React, { useState } from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Map from './MainMap'
import If from '../addons/If'
import ListItem from './ListItem'

const Wrapper = styled.div`
  height: calc(100vh - ${props => props.theme.headerHeight});
  grid-template-columns: 67% auto;
  #map-section {
    padding: 5px;
  }
  #map-section #map {
    height: 100%;
  }
  #list-section {
    overflow: auto;
    padding: 5px;
    grid-auto-rows: max-content;
    grid-gap: 0.5rem;
    .actions {
      padding: 10px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  @media (max-width: ${props => props.theme.md}) {
    grid-template-columns: auto;
    grid-template-rows: auto 1fr;
    #map-section {
      padding-top: 0;
      #map {
        height: 50vh;
      }
    }
    #list-section {
      .actions {
        padding: 5px 10px;
        button {
          width: 46px;
          height: 46px;
        }
      }
    }
  }
`

function Home () {
  const [markers, setMarkers] = useState([])
  const [current, setCurrent] = useState('')

  const onMarkerClick = data => {
    console.log(data)
    setCurrent(data.slug)
  }

  return (
    <Wrapper className='grid'>
      <section id='map-section'>
        <If condition={typeof window !== 'undefined'}>
          <Map onMarkerClick={onMarkerClick} setMarkers={setMarkers} />
        </If>
      </section>
      <section className='grid' id='list-section'>
        {markers &&
          markers.map((marker, index) => (
            <ListItem
              item={marker}
              key={marker.slug + index}
              selected={marker.slug === current}
            />
          ))}
        <div className='actions'>
          <Fab
            aria-label='Créer un évènement'
            color='primary'
            onClick={() => navigate('/app/event/new')}
            title='Créer un évènement'
          >
            <AddIcon />
          </Fab>
        </div>
      </section>
    </Wrapper>
  )
}

export default Home
