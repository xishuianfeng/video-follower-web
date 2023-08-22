import React, { useEffect, useState } from 'react'
import './Home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Modal from 'react-modal'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import usePeerStore from '../../store/peerStore'

interface IProps { }

const Home: React.FunctionComponent<IProps> = () => {
  const navigator = useNavigate()
  const [params] = useSearchParams()
  const serachParams = Object.fromEntries(params) as { remotePeerId: string }
  const peerStore = usePeerStore()
  const [remotePeerId, setRemotePeerId] = useState('')
  const [joinSessionModalVisible, setJoinSessionModalVisible] = useState(false)
  const onJoinSessionClick = () => {
    setJoinSessionModalVisible(true)
  }

  useEffect(() => {
    setRemotePeerId(serachParams.remotePeerId)
  }, [])

  useEffect(() => {
    if (remotePeerId) {
      setJoinSessionModalVisible(true)
    }
  }, [remotePeerId])

  return (
    <div className='home'>
      <NavigationBar backButtonVisible={false} />

      {peerStore.localPeerId === ''
        ? <div className='connection-status'>
          未连接,无法共享视频(或加入视频)
        </div>
        : <div className='connection-status'>
          Peer已连接
        </div>}

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

