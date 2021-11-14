import React, { useState, useCallback } from 'react'
import { FallingSprouts, FallingSproutsProps, useKonamiCheatCode } from '@plantswap/uikit'

const EasterEgg: React.FC<FallingSproutsProps> = (props) => {
  const [show, setShow] = useState(false)
  const startFalling = useCallback(() => setShow(true), [setShow])
  useKonamiCheatCode(startFalling)

  if (show) {
    return (
      <div onAnimationEnd={() => setShow(false)}>
        <FallingSprouts {...props} />
      </div>
    )
  }
  return null
}

export default React.memo(EasterEgg)
