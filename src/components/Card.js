import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Image, Link } from './addons'

const Wrapper = styled.div`
  position: relative;
  margin: 0.5rem;
  box-shadow: 1px 1px 5px ${props => props.theme.borderColor};
  border: 1px solid rgb(239, 239, 239);
  transition: box-shadow 0.3s ease;
  .caption {
    color: rgba(0, 0, 0, 0.8);
    line-height: 1.5;
    font-size: 20px;
    padding: 0.5rem 0;
    .title {
      padding: 0 0.5rem;
      p {
        font-size: 15px;
      }
    }
  }
  .overlay {
    opacity: 0;
    position: absolute;
    top: 0;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    height: 200px;
    width: 100%;
    z-index: 10;
    transition: opacity 0.3s ease;
    .text {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 5px;
      .red {
        color: rgb(248, 99, 73);
      }
    }
  }
  &:hover {
    box-shadow: 0 15px 15px -15px gray;
    .overlay {
      opacity: 1;
    }
  }
`

function Card ({ data, isGroup }) {
  return (
    <Wrapper>
      <Image
        alt={data.title}
        className='cover'
        height='200'
        loading='lazy'
        src={data.photo}
      />
      <div className='caption'>
        <div className='title text-wrap center'>
          <Link
            aria-label={data.title}
            title={data.title}
            to={`/${isGroup ? 'group' : 'event'}/${data.slug}`}
          >
            <strong>{data.title}</strong>
          </Link>
          {!isGroup && <p>Le 28/11/2019 à 13:24</p>}
        </div>
      </div>
      <div className='overlay'>
        <div className='text'>
          {(!isGroup && (
            <>
              <p>Organisateur : Group1</p>
              <p>
                Évènement privé | <span className='red'>non publié</span>
              </p>
            </>
          )) || <p>Vous êtes administrateur</p>}
        </div>
      </div>
    </Wrapper>
  )
}

Card.propTypes = {
  data: PropTypes.object.isRequired,
  isGroup: PropTypes.bool
}

export default Card
