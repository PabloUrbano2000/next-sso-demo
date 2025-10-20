'use client'

import { ReactNode, useEffect } from 'react'
import './iframe.css'

interface LayoutProps {
  children: ReactNode
}

export default function IframeAuthLayout({ children }: LayoutProps) {
  useEffect(() => {
    function handleReadyFromChild(e: CustomEvent) {
      // solo debe dispararse cuando el hijo avise que se renderizó
      window.parent.postMessage(
        { eventName: 'iframe-ready', height: document.body.scrollHeight },
        '*'
      )
    }

    new ResizeObserver(() => {
      const height = document.body.scrollHeight
      window.top?.postMessage(
        {
          eventName: 'iframe-height',
          height
        },
        '*'
      )
    }).observe(document.body)

    window.addEventListener(
      'iframe-child-ready',
      handleReadyFromChild as EventListener
    )

    return () =>
      window.removeEventListener(
        'iframe-child-ready',
        handleReadyFromChild as EventListener
      )
  }, [])

  return <div className='py-8 px-4'>{children}</div>
}
