import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 2rem;
  .container {
    position: relative;
    width: 100%;
    max-width: 1170px;
    margin: 0 auto;
    padding: 0 1rem;
    .page-content h1 {
      text-align: center;
      font-size: 22px;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.sm}) {
    margin-top: 1rem;
    .container {
      padding: 0 0.5rem;
    }
  }
`

const Page = ({ children, className }) => (
  <Wrapper className={className}>
    <div className='container'>
      <div className='page-content'>{children}</div>
    </div>
  </Wrapper>
)

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default Page
