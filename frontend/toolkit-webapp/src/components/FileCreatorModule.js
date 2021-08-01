import React from 'react'

const FileCreator = (props) => {
  return (
    <div>
      <input type="file" name="file" onChange={e => props.setFile(e.target.files[0])} />
    </div>
  )
}

export default FileCreator