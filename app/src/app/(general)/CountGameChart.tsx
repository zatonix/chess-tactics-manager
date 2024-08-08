'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface BarWithBorderProps {
  fill: string
  x: number
  y: number
  width: number
  height: number
}

const BarWithBorder = () => {
  const ShapeComponent = ({
    fill,
    x,
    y,
    width,
    height
  }: BarWithBorderProps) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          stroke='none'
          fill={fill}
        />
        <rect
          x={x}
          y={y}
          width={width}
          height={1}
          stroke='none'
          fill={'#DC8E08'}
        />
      </g>
    )
  }
  return ShapeComponent
}

interface CountGameChartProps {
  data: { month: string; games: number }[]
}

export const CountGameChart = ({ data }: CountGameChartProps) => {
  console.log(data)
  return (
    <ResponsiveContainer width='100%' height={230}>
      <BarChart
        data={data}
        barGap={0}
        barCategoryGap={0}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id='colorGames' x1='0' y1='0' x2='0' y2='1'>
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
        <YAxis hide={true} />
        <CartesianGrid vertical={false} strokeDasharray='4 4' opacity={0.2} />
        <Tooltip
          cursor={false}
          contentStyle={{
            background: '#261F27',
            border: 'none',
            color: '#F7EFE4',
            fontSize: 11
          }}
        />
        <Bar
          dataKey='games'
          // @ts-ignore
          shape={BarWithBorder()}
          fillOpacity={1}
          background={false}
          activeColor='red'
          activeBar={false}
          fill='url(#colorGames)'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
