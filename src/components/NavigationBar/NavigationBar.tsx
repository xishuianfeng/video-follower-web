import React, { CSSProperties, ReactNode, useState } from 'react'
import './NavigationBar.scss'
import { Left } from '@icon-park/react'
import { useNavigate } from 'react-router-dom'

interface IProps {
  style?: CSSProperties,
  backButton?: ReactNode
  backButtonVisible?: boolean
  extra?: ReactNode
}

const NavigationBar: React.FunctionComponent<IProps> = (props) => {
  const {
    style,
    backButtonVisible = true,
  } = props
  const [opacity] = useState(1)

  const navigate = useNavigate()

  return (
    <div className='navigate-bar' style={{ opacity, ...style }}>
      {backButtonVisible ? (
        <div
          className='back-button'
          onClick={() => {
            navigate(-1)
          }}>
          <Left style={{ fontSize: 32 }} fill={'#65c7bf'} />
        </div>
      ) : null}
    </div>
  )
}

export default NavigationBar