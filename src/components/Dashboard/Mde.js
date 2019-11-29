import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import Showdown from 'showdown'
import { purify } from '../../lib/utils'

const Wrapper = styled.div`
  .label {
    margin-bottom: 0.5rem;
  }
  .react-mde .mde-header {
    .mde-tabs button {
      padding: 0 5px;
    }
    .mde-header-group .mde-header-item button {
      font-size: 14px;
    }
  }
`

function Mde ({ className, label, placeholder, value, setValue, readOnly }) {
  const [selectedTab, setSelectedTab] = useState('write')

  return (
    <Wrapper className={`mde ${className}`}>
      {label && <p className='label'>{label}</p>}
      <ReactMde
        generateMarkdownPreview={mark => purify(converter.makeHtml(mark))}
        onChange={setValue}
        onTabChange={setSelectedTab}
        readOnly={readOnly}
        selectedTab={selectedTab}
        textAreaProps={{ placeholder }}
        value={value}
      />
    </Wrapper>
  )
}

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
})

Mde.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
}

export default Mde
