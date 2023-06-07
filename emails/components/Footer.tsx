import * as React from 'react';
import { Column, Container, Img, Link, Section } from '@react-email/components';
import { Text } from '@react-email/text';

const baseUrl = process.env.APP_BASE_URL;

export const Footer = () => (
  <Container className="bg-primary-05 rounded-b-lg">
    <Section className="p-2">
      <Column className="text-center">
        <div className="w-[32px] h-[32px] px-12 py-6 rounded-sm">
          <Img
            src={`${baseUrl}/static/logo.png`}
            width="40"
            height="40"
            alt="smile picture"
          />
        </div>
      </Column>
      <Column className="text-left w-56 text-gray-01">
        <Text className="text-left font-bold my-0">Contatos</Text>
        <div className="flex justify-start items-center gap-2 py-2 h-6 w-6">
          <Link href="https://www.linkedin.com/company/mentor-cycle/">
            <Img
              src={`${baseUrl}/static/linkedin.png`}
              alt="LinkedIn icon"
              className="w-6 h-6 object-fill"
            />
          </Link>
          <Link href="https://discord.gg/WRD3uT3JaC">
            <Img
              src={`${baseUrl}/static/discord.png`}
              alt="Discord icon"
              className="w-6 h-6 object-fill"
            />
          </Link>
        </div>
      </Column>
    </Section>
  </Container>
);
