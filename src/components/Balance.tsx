import React, { useEffect, useRef } from 'react'
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
