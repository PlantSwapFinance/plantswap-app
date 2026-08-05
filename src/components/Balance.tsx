import React, { useEffect, useRef } from 'react'
// `react-countup` ships a CommonJS module whose `default` export is wrapped
// inconsistently across bundlers — under Vite 8's rolldown, the default
// import sometimes resolves to the whole module namespace object instead of
// the CountUp component, which makes `<CountUp>` render as `got: object`
// at React's createFiberFromTypeAndProps and white-pages the tree.
//
// Bypass the broken default export entirely: use the named `useCountUp`
// hook (which is reliably a function) and build a tiny local wrapper that
// renders a `<span>` and lets the hook drive the count-up animation.
import { useCountUp } from 'react-countup'
import { Text, TextProps } from '@plantswap/uikit'

interface CountUpProps {
  start?: number
  end: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
  separator?: string
}

const CountUp: React.FC<CountUpProps> = ({ start, end, decimals, duration, prefix, suffix, separator }) => {
  const containerRef = useRef<HTMLSpanElement>(null)
  useCountUp({
    ref: containerRef as unknown as React.RefObject<HTMLElement>,
    start,
    end,
    decimals,
    duration,
    prefix,
    suffix,
    separator,
    enableReinitialize: false,
    startOnMount: true,
  })
  return (
    <span ref={containerRef}>
      {prefix}
      {start ?? ''}
    </span>
  )
}

interface BalanceProps extends TextProps {
  value: number
  decimals?: number
  unit?: string
  isDisabled?: boolean
  prefix?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const Balance: React.FC<BalanceProps> = ({
  value,
  color = 'text',
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  ...props
}) => {
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <Text color={isDisabled ? 'textDisabled' : color} onClick={onClick} {...props}>
      <CountUp
        start={previousValue.current}
        end={value}
        prefix={prefix}
        suffix={unit}
        decimals={decimals}
        duration={1}
        separator=","
      />
    </Text>
  )
}

export default Balance
