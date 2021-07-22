import React from 'react'

const PDFCreator = (props) => {
  return (
    <div>
      <input type="file" name="file" onChange={e => props.setPDF(e.target.files[0])} />
    </div>
  )
}

export default PDFCreator

