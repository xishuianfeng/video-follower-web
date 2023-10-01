import React, { useEffect, useState } from 'react'
import './Home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Modal from 'react-modal'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import usePeerStore from '../../store/peerStore'
import logo from '../../assets/logo.png'
import { Github } from '@icon-park/react'

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
    <div className='home-wrapper'>
      <NavigationBar backButtonVisible={false} />
      <div className='home'>
        <img className='logo' src={logo} />

        {peerStore.localPeerId === ''
          ? <div className='connection-status'>
            准备未完成,无法共享视频(或加入视频)
          </div>
          : <div className='connection-status'>
            准备完成，快去加入视频吧~
          </div>}

        <button
          className='joinButton'
          onClick={() => { onJoinSessionClick() }}>
          观看他人视频
        </button>

        <div className='github'>
          <button className='github-icon'>
            <a href="https://github.com/xishuianfeng/You-video/actions/runs/6371646740" target="_blank">
              <Github theme="outline" size="48" fill="#333" />
            </a>
          </button>
          <p>github 源码</p>
        </div>
      </div>

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
        <div className='modal-bottom'>
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
          <p className='modal-text'>双击可切换全屏/非全屏哦。</p>

        </div>
      </Modal>
    </div>
  )
}

export default Home

