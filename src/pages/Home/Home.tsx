import React, { useState } from 'react'
import './Home.scss'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import NavigationBar from '../../components/NavigationBar/NavigationBar'

interface IProps { }

const Home: React.FunctionComponent<IProps> = () => {
  const navigator = useNavigate()

  const [remotePeerId, setRemotePeerId] = useState('')
  const [joinSessionModalVisible, setJoinSessionModalVisible] = useState(false)
  const onJoinSessionClick = () => {
    setJoinSessionModalVisible(true)
  }

  return (
    <div className='home'>
      <NavigationBar backButtonVisible={false} />

      <button
        className='joinButton'
        onClick={() => { onJoinSessionClick() }}>
        观看他人视频
      </button>

      <Modal
        isOpen={joinSessionModalVisible}
        shouldCloseOnEsc={true}
      >
        <input
          className='remote-peer-id-input'
          type='text'
          value={remotePeerId}
          onChange={(event) => {
            const peerId = event.target.value
            setRemotePeerId(peerId)
          }}
        />
        <div>
          <button
            className='modalButton'
            onClick={() => {
              const search = new URLSearchParams({
                remotePeerId
              }).toString()

              navigator({
                pathname: '/video/follower',
                search
              })
            }}
          >
            加入
          </button>

          <button
            className='modalButton'
            onClick={() => {
              setJoinSessionModalVisible(false)
            }}
          >
            取消
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Home

