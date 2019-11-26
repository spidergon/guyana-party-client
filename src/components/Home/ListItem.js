import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '../addons/Link'
import Image from '../addons/Image'

const Wrapper = styled.div`
  padding: 5px;
  border: 1px solid rgb(239, 239, 239);
  &.selected {
    box-shadow: 1px 1px 5px blue;
  }
  &:hover {
    box-shadow: 1px 1px 5px grey;
  }
  a.grid {
    grid-template-columns: auto 1fr;
    text-decoration: none;
    color: ${props => props.theme.black};
    img {
      object-fit: cover;
      width: 80px;
      margin: 0;
    }
    .content {
      padding: 5px;
      h2,
      h3 {
        margin-bottom: 0.3rem;
      }
      h2 {
        font-size: 1.2rem;
      }
      h3,
      p {
        font-size: 0.9rem;
      }
      p {
        margin-bottom: 0;
      }
    }
  }
`

function ListItem ({ item, selected }) {
  return (
    <Wrapper className={selected ? 'selected' : ''}>
      <Link className='grid' to={`/event/${item.slug}`}>
        <Image alt={item.title} src={item.img} />
        <div className='content'>
          <h2>{item.title}</h2>
          <h3>Group name</h3>
          <p>Le 13/11/2019 à 18:03</p>
        </div>
      </Link>
    </Wrapper>
  )
}

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  selected: PropTypes.bool
}

export default React.memo(ListItem)
