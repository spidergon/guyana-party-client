import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Button from '@material-ui/core/Button'
import Card from './Card'
import { If } from './addons'
import { showSnack } from './Snack'
import { archiveGroup } from '../lib/services/groupService'
import { archiveEvent } from '../lib/services/eventService'
import { navigate } from 'gatsby'

const Wrapper = styled.section`
  margin-bottom: 50px;
  h2 {
    font-size: 22px;
    text-transform: uppercase;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    button {
      margin: -0.7rem 1rem 0 1rem;
      position: absolute;
      right: 0;
    }
  }
  #container {
    /* max-width: calc(100vw - 200px - 3rem); */
    .slick-track {
      margin-left: 0;
    }
  }
  @media (max-width: ${props => props.theme.sm}) {
    #container {
      /* max-width: calc(100vw - 3rem); */
    }
  }
`

const loadingMsg = (loading, isGroup) =>
  loading ? (
    <p>Chargement...</p>
  ) : (
    <p>{`Aucun ${isGroup ? 'groupe' : 'évènement'}.`}</p>
  )

const CardList = ({
  addBtn,
  title,
  data,
  isGroup,
  loading,
  className,
  groupId,
  conf
}) => {
  const archiveItem = (id, author) => {
    const next = () => {
      showSnack(`${isGroup ? 'Groupe' : 'Évènement'} archivé avec succès`)
      if (typeof window !== 'undefined') window.location.reload()
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    if (isGroup) return archiveGroup({ id, author }, next, fallback)
    archiveEvent({ id, author }, next, fallback)
  }

  return (
    <Wrapper className={className}>
      <h2>
        {`${title}${data.length > 0 ? ` (${data.length})` : ''}`}
        {addBtn && groupId && (
          <Button
            aria-label='Ajouter un évènement'
            onClick={() => navigate(`/app/event/new?${groupId}`)}
            size='small'
            title='Ajouter un évènement'
            variant='contained'
          >
            Ajouter
          </Button>
        )}
      </h2>
      <div id='container'>
        <If
          condition={data.length !== 0}
          otherwise={loadingMsg(loading, isGroup)}
        >
          <Slider {...(conf || sliderConf)}>
            {data.map((d, index) => (
              <Card
                archive={archiveItem}
                data={d}
                isGroup={isGroup}
                key={d.slug + index}
              />
            ))}
          </Slider>
        </If>
      </div>
    </Wrapper>
  )
}

const sliderConf = {
  dots: true,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    { breakpoint: 1500, settings: { slidesToShow: 4, slidesToScroll: 4 } },
    { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 980, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
  ]
}

CardList.propTypes = {
  addBtn: PropTypes.bool,
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isGroup: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  groupId: PropTypes.string,
  conf: PropTypes.object
}

export default CardList
