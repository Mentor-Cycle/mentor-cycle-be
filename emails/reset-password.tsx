import * as React from 'react';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Preview } from '@react-email/preview';
import { Tailwind } from '@react-email/tailwind';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Img } from '@react-email/img';
import { Button } from '@react-email/button';
import { Column } from '@react-email/column';
import { Link } from '@react-email/components';
import { TAILWIND_CONFIG } from './config/tailwind';
import { Footer } from './components/Footer';

const baseUrl = process.env.APP_BASE_URL;

export const ResetPassword = ({
  name,
  redirectUrl,
}: {
  name: string;
  redirectUrl: string;
}) => (
  <Html>
    <Head />
    <Preview>Redefinir Senha</Preview>
    <Tailwind config={TAILWIND_CONFIG}>
      <Container className="bg-neutral-03 font-sans text-gray-01">
        <Container className="bg-secondary-02 p-12 pb-4 rounded-lg rounded-b-none">
          <Heading className="text-primary-03 inline-flex">
            Ola!!
            <Img
              src={`${baseUrl}/static/smile.png`}
              width="32"
              height="32"
              alt="smile picture"
            />
          </Heading>
          <Text className="text-neutral-05">
            Solicitação de alteração de senha!
          </Text>
          <Hr />
          <Text className="text-center">
            Olá {name}, recebemos um pedido para troca da sua senha, clique no
            botão abaixo para realizar a alteração:
          </Text>
          <Container className="flex justify-center items-center mt-16 m-auto cursor-pointer w-full">
            <Button
              href={redirectUrl}
              className="p-4 bg-primary-03 text-neutral-03 rounded-lg flex-1 text-center w-full"
            >
              Alterar senha
            </Button>
          </Container>
          <Text className=" mt-16">
            Caso não queira realizar essa ação desconsidere esse e-mail ou se
            não foi você que solicitou, recomendamos que realize a troca da
            senha.
          </Text>
          <Text className="text-right  font-bold">Equipe Mentor Cycle</Text>
          <Text className="text-right ">
            Obrigado por fazer parte dessa iniciativa
          </Text>
        </Container>
        <Footer />
      </Container>
    </Tailwind>
  </Html>
);

export default ResetPassword;
