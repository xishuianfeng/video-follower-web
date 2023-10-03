import usePeerStore from '../../store/peerStore'
import './Follower.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import { useFullscreen, useMemoizedFn } from 'ahooks'
import { createEmptyMediaStream } from '../../utils/peer'
import { FullScreenOne } from '@icon-park/react'

interface IProps { }

const Follower: React.FunctionComponent<IProps> = () => {
  const [params, setSearchParams] = useSearchParams()
  const peerStore = usePeerStore()
  const serachParams = Object.fromEntries(params) as { remotePeerId: string }
  const remotePeerId = serachParams.remotePeerId

  const videoRef = useRef<
    HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }
  >(null!)
  const peer = peerStore.getPeer()
  const [subtitle, setSubtitle] = useState('')
  const [leaveString, setLeaveString] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(wrapperRef.current, {})

  const connectPeer = useMemoizedFn((remotePeerId: string) => {
    return new Promise<void>((resolve, reject) => {
      const call = peer.call(remotePeerId, createEmptyMediaStream())

      if (!remotePeerId) { return }

      call.once('stream', (stream) => {
        console.log('remoteStream', stream);
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
          .then(() => {
            setSearchParams((prev) => {
              prev.delete('remotePeerId')
              return prev
            })
            console.log('连接成功');
          })
          .catch(() => { })
      }
    })
  }

  useEffect(() => {
    receptionJSON()

    connectPeer(remotePeerId)
      .then(() => {
        setSearchParams((prev) => {
          prev.delete('remotePeerId')
          return prev
        })
        console.log('连接成功');
      })
  }, [])

  useEffect(() => {
    videoRef.current?.addEventListener('pause', () => {
      videoRef.current?.play()
    })
  }, [])

  return (
    <div className='follower'>
      <div className='container' ref={wrapperRef}>
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
            //@ts-expect-error  ios端的全屏方法
            videoRef.current?.webkitEnterFullscreen()
          }}
        ></video>

        {isFullscreen
          ? ''
          : <button
            className='fullscreen-button'
            onClick={() => {
              toggleFullscreen()
              //@ts-expect-error  ios端的全屏方法
              videoRef.current?.webkitEnterFullscreen()
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
    </div>
  )
}

export default Follower