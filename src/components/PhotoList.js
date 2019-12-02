import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from './addons/Image'

const Wrapper = styled.section`
  background: #fff;
`

const PhotoList = ({ photos, className }) => (
  <Wrapper className={className}>
    {photos && (
      <Slider {...sliderConf}>
        {photos.map(({ preview, id }, index) => (
          <Image
            alt='photo'
            className='cover'
            height='200'
            key={id + index}
            loading='lazy'
            src={preview || ''}
          />
        ))}
      </Slider>
    )}
  </Wrapper>
)

const sliderConf = {
  dots: true,
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 980, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
  ]
}

PhotoList.propTypes = {
  photos: PropTypes.array.isRequired,
  className: PropTypes.string
}

export default PhotoList
