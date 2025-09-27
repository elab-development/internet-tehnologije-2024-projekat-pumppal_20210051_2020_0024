// src/components/Footer.jsx
import { chakra } from '@chakra-ui/react';

// Brand colors (same set you've been using)
const NAVY_DEEP = '#0f1f36';
const PANEL = '#232941';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';

export default function Footer() {
  return (
    <chakra.footer bg={NAVY_DEEP} color={LIGHT}>
      {/* subtle top accent */}
      <chakra.div
        height="2px"
        bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
        opacity={0.35}
      />

      <chakra.div
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 5 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <chakra.span>Support at:&nbsp;</chakra.span>
        <chakra.a
          href="mailto:helpdesk@promopulse.com"
          color={YELLOW_2}
          fontWeight="700"
          _hover={{ textDecoration: 'underline', color: YELLOW }}
        >
          helpdesk@promopulse.com
        </chakra.a>
      </chakra.div>
    </chakra.footer>
  );
}
