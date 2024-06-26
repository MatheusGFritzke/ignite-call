import { Heading, Text, styled } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: 852,
  padding: '0 $4',
  margin: '$20 auto $4',
  width: '100%',
})

export const UserHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',

  [`> ${Heading}`]: {
    lineHeight: '$base',
    marginTop: '$2',
  },

  [`> ${Text}`]: {
    color: '$gray200',
  },
})
