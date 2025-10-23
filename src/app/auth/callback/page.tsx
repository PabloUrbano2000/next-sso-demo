'use client'

import { useEffect } from 'react'

export default function CallbackPage() {
  useEffect(() => {
    console.log(location.href)
  }, [])
}
