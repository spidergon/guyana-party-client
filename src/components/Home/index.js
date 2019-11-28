import React, { useState } from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Map from './MainMap'
import If from '../addons/If'
import ListItem from './ListItem'
import img from '../../assets/images/gatsby-icon.png'
import img2 from '../../assets/images/gatsby-astronaut.png'

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
  /* @media (max-height: ${props => props.theme.xs}) and (max-width: ${props =>
  props.theme.md}) {
    grid-template-columns: 55% auto;
    grid-template-rows: auto;
    #map-section #map {
      height: 100%;
    }
    #list-section img {
      max-width: 55px;
    }
  } */
`

function Home () {
  const [current, setCurrent] = useState('')

  const markers = [
    {
      position: [4.93, -52.3],
      title: "Event 1: un nom d'évènement super long !",
      slug: 'event1',
      img: ''
    },
    { position: [51.51, -0.1], title: 'Event 2', slug: 'event2', img },
    { position: [51.49, -0.05], title: 'Event 3', slug: 'event3', img: img2 }
  ]

  const onMarkerClick = data => {
    console.log(data)
    setCurrent(data.slug)
  }

  return (
    <Wrapper className='grid'>
      <section id='map-section'>
        <If condition={typeof window !== 'undefined'}>
          <Map markers={markers} onMarkerClick={onMarkerClick} />
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
            onClick={() => navigate('/event/new')}
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
