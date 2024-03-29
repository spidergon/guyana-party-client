import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Slider from 'react-slick'
import Image from './addons/Image'

const Wrapper = styled.section`
  background: #fff;
`

const PhotoList = ({ photos, className, conf }) => (
  <Wrapper className={className}>
    {photos && photos.length > 0 && (
      <Slider {...(conf || sliderConf)}>
        {photos.map((p, index) => (
          <Image
            alt='photo'
            className='cover'
            height='200'
            key={index}
            loading='lazy'
            src={p.preview || ''}
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
  className: PropTypes.string,
  conf: PropTypes.object
}

export default PhotoList
