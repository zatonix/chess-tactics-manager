'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const data = [
  {
    month: 'Nov.',
    precision: 40
  },
  {
    month: 'Dec.',
    precision: 30
  },
  {
    month: 'Jan.',
    precision: 20
  },
  {
    month: 'Feb.',
    precision: 27
  },
  {
    month: 'Mar.',
    precision: 78
  },
  {
    month: 'Apr.',
    precision: 56
  }
]

export const PrecisionChart = () => {
  return (
    <ResponsiveContainer width='100%' height={230}>
      <AreaChart
        data={data}
        margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
      >
        <defs>
          <linearGradient id='colorPrecision' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#261F27' stopOpacity={1} />
            <stop offset='95%' stopColor='#261F27' stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey='month'
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#F7EFE4', fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#F7EFE4', fontSize: 11 }}
          domain={[0, 100]}
        />
        <CartesianGrid vertical={false} strokeDasharray='4 4' opacity={0.2} />
        <Tooltip
          contentStyle={{
            background: '#261F27',
            border: 'none',
            color: '#F7EFE4',
            fontSize: 11
          }}
        />
        <Area
          type='monotone'
          dataKey='precision'
          stroke='#DC8E08'
          strokeWidth={1}
          fillOpacity={1}
          fill='url(#colorPrecision)'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
