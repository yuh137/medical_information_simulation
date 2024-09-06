import React from 'react'
import { useParams } from 'react-router-dom'

const Test = () => {
    const { link, test } = useParams();

  return (
    <div>Hello {link}, this is {test}</div>
  )
}

export default Test