import { Button } from '@react-email/button';
import { Html } from '@react-email/html';
import * as React from 'react';

export default function Email(props: { email: string }) {
  return (
    <Html>
      <Button
        pX={20}
        pY={12}
        href="https://example.com"
        style={{ background: '#000', color: '#fff' }}
      >
        Click me and email: {props.email}
      </Button>
    </Html>
  );
}
