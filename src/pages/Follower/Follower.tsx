import usePeerStore from '../../store/peerStore'
import './Follower.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import { useFullscreen, useMemoizedFn } from 'ahooks'
import { createEmptyMediaStream } from '../../utils/peer'
import { FullScreenOne } from '@icon-park/react'
import Modal from 'react-modal'

interface IProps { }

const Follower: React.FunctionComponent<IProps> = () => {
  const [params] = useSearchParams()
  const peerStore = usePeerStore()
  const serachParams = Object.fromEntries(params) as { remotePeerId: string }
  const remotePeerId = serachParams.remotePeerId

  const videoRef = useRef<
    HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }
  >(null!)
  const peer = peerStore.getPeer()
  const [peerOpen, setPeerOpen] = useState(false)
  const [subtitle, setSubtitle] = useState('')
  const [leaveString, setLeaveString] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(wrapperRef.current, {})
  // 判断是否为 ios 端

  const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  // 接收JSON字符串做出相应对策，第一次进入页面自动连接
  const connectPeer = useMemoizedFn((remotePeerId: string) => {
    return new Promise<void>((resolve, reject) => {
      const call = peer.call(remotePeerId, createEmptyMediaStream())

      if (!remotePeerId) { return }

      call.once('stream', (stream) => {
        // console.log('remoteStream', stream);
        videoRef.current.srcObject = stream
        resolve()
      })
      call.once('error', (error) => {
        console.log('error => ', error);
        reject()
      })
      call.once('close', () => {
        console.log('远程连接关闭');
        reject()
      })
    })
  })

  const receptionJSON = () => {
    const connection = peer.connect(remotePeerId)
    peerStore.setDataConnection(connection)
    connection.on('data', (data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore data类型不能表示
      const result = JSON.parse(data)
      if (result.type === 'subtitle') {
        setSubtitle(result.subtitle)

      } else if (result.type === 'leavePlayer') {
        console.log('leave');
        setLeaveString('对方退出了播放页面，可能正在更换视频哦~')

      } else if (result.type === 'goPlayer') {
        setLeaveString('')
        connectPeer(remotePeerId)
      }
    })
  }

  useEffect(() => {
    receptionJSON()
    peer.on('open', onOpen)
    connectPeer(remotePeerId).then(() => {
      console.log('连接成功');
    })
  }, [])

  // 刷新页面重连
  const [playModalVisible, setPlayModalVisible] = useState(false)
  const onOpen = (id: string) => {
    peerStore.setLocalPeerId(id)
    setPeerOpen(true)
    console.log('信令服务器连接建立成功', id)
  }

  useEffect(() => {
    if (peerOpen) {
      connectPeer(remotePeerId).then(() => {
        console.log('连接成功');
      })
      setPlayModalVisible(true)
    }
  }, [peerOpen])

  // 监听pause() 自动播放
  useEffect(() => {
    videoRef.current?.addEventListener('pause', () => {
      videoRef.current?.play()
    })
  }, [])

  return (
    <div className='follower'>
      <div className='container' ref={wrapperRef}
        onDoubleClick={() => {
          if (isiOS) {
            //@ts-expect-error  ios端的全屏方法
            videoRef.current?.webkitEnterFullscreen()
          }
        }}
      >
        {isFullscreen
          ? ''
          : <div className='nav-wrapper'>
            <NavigationBar />
          </div>}

        <video
          className='follower-video'
          ref={videoRef}
          autoPlay
          playsInline
          onDoubleClick={() => {
            toggleFullscreen()
          }}
        ></video>

        {isFullscreen
          ? ''
          : <button
            className='fullscreen-button'
            onClick={() => {
              toggleFullscreen()
              if (isiOS) {
                //@ts-expect-error  ios端的全屏方法
                videoRef.current?.webkitEnterFullscreen()
              }
            }}
          >
            <FullScreenOne className='icon' theme="two-tone" size="48" fill={['#fff', '#fff']} />
          </button>}

        {subtitle
          ? <div
            className='follower-subtitle'
            dangerouslySetInnerHTML={{ __html: subtitle.replace('<script>', '',) }}
          >
          </div> : ''}

        {leaveString
          ? <div className='follower-leaveString'>
            {leaveString}
          </div>
          : ''}
      </div>

      <Modal
        shouldCloseOnEsc={true}
        isOpen={playModalVisible}
      >
        <button
          className='play-button'
          onClick={() => {
            videoRef.current.play()
            setPlayModalVisible(false)
          }}>
          点击播放
        </button>
      </Modal>
    </div>
  )
}

export default Follower