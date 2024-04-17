import { Container, Hero, Preview } from './styles'
import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import previewImage from '../../assets/app-preview.png'
import { ClaimUserNameForm } from './components/ClaimUserNameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre
        </Text>
        <ClaimUserNameForm />
      </Hero>

      <Preview>
        <Image
          src={previewImage}
          alt="Calendário simbolizando aplicação em funcionamento"
          quality={100}
          height={400}
          priority
        />
      </Preview>
    </Container>
  )
}
