import { useEffect } from 'react'
import { useReconnect } from 'wagmi'

const useEagerConnect = () => {
  const { reconnect } = useReconnect()

  useEffect(() => {
    // wagmi handles automatic reconnection, but we can trigger it manually if needed
    reconnect()
  }, [reconnect])
}

export default useEagerConnect
