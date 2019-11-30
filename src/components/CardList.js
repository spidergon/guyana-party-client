import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Card from './Card'
import { If } from './addons'

const Wrapper = styled.section`
  margin-bottom: 50px;
  h2 {
    font-size: 22px;
    text-transform: uppercase;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${props => props.theme.borderColor};
  }
  #container {
    max-width: calc(100vw - 200px - 3rem);
    .slick-track {
      margin-left: 0;
    }
  }
  @media (max-width: ${props => props.theme.sm}) {
    #container {
      max-width: calc(100vw - 3rem);
    }
  }
`

const loadingMsg = (loading, isGroup) =>
  loading ? (
    <p>Chargement...</p>
  ) : (
    <p>{`Vous n'avez aucun ${isGroup ? 'groupe' : 'évènement'}.`}</p>
  )

const CardList = ({ title, data, isGroup, loading }) => (
  <Wrapper>
    <h2>{title + (data.length > 0 ? ` (${data.length})` : '')}</h2>
    <div id='container'>
      <If
        condition={data.length !== 0}
        otherwise={loadingMsg(loading, isGroup)}
      >
        <Slider {...sliderConf}>
          {data.map((d, index) => (
            <Card data={d} isGroup={isGroup} key={d.slug + index} />
          ))}
        </Slider>
      </If>
    </div>
  </Wrapper>
)

const sliderConf = {
  dots: true,
  infinite: false,
  slidesToShow: 5,
  slidesToScroll: 5,
  responsive: [
    { breakpoint: 1500, settings: { slidesToShow: 4, slidesToScroll: 4 } },
    { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 980, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
  ]
}

CardList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isGroup: PropTypes.bool,
  loading: PropTypes.bool
}

export default CardList
