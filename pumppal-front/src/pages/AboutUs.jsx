// src/pages/AboutUs.jsx
import { chakra } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaArrowRight, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

// Brand palette (same as elsewhere)
const NAVY_DEEP = '#0f1f36';
const PANEL = '#232941';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';
const LIGHT_FADE = 'rgba(255,255,255,0.06)';

/* -------------------- tiny atoms -------------------- */

function Chip({ children }) {
  return (
    <chakra.div
      display="inline-flex"
      alignItems="center"
      px="12px"
      py="6px"
      rounded="full"
      bg="rgba(255,255,255,0.06)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      color={LIGHT}
      fontSize="sm"
      mr="8px"
      mb="8px"
    >
      {children}
    </chakra.div>
  );
}

function SolidButton(props) {
  const { children, ...rest } = props;
  return (
    <chakra.button
      type="button"
      rounded="full"
      fontWeight="800"
      color="black"
      px="20px"
      h="48px"
      bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
      _hover={{ transform: 'translateY(-2px)' }}
      _active={{ transform: 'translateY(0px)' }}
      transition="all 180ms ease"
      {...rest}
    >
      {children}
    </chakra.button>
  );
}

function OutlineButton(props) {
  const { children, ...rest } = props;
  return (
    <chakra.button
      type="button"
      rounded="full"
      fontWeight="800"
      px="20px"
      h="48px"
      color={YELLOW_2}
      bg="transparent"
      border="1px solid"
      borderColor={YELLOW}
      _hover={{ bg: 'whiteAlpha.100' }}
      transition="all 180ms ease"
      {...rest}
    >
      {children}
    </chakra.button>
  );
}

function Milestone({ n, title, meta, left, top }) {
  return (
    <chakra.div position="absolute" left={left} top={top} transform="translate(-50%, -50%)">
      <chakra.div display="flex" flexDir="column" alignItems="center" gap="10px">
        <chakra.div
          w={{ base: '44px', md: '50px' }}
          h={{ base: '44px', md: '50px' }}
          rounded="full"
          bg={`linear-gradient(135deg, ${YELLOW}, ${YELLOW_2})`}
          color="black"
          fontWeight="800"
          display="grid"
          placeItems="center"
          boxShadow="0 10px 25px rgba(245,180,0,0.35)"
          fontSize="lg"
        >
          {n}
        </chakra.div>

        <chakra.div
          p="12px"
          rounded="xl"
          bg={LIGHT_FADE}
          border="1px solid"
          borderColor="whiteAlpha.200"
          minW={{ base: '140px', md: '180px' }}
          textAlign="center"
        >
          <chakra.div fontWeight="700" color="white" fontSize={{ base: 'sm', md: 'md' }}>
            {title}
          </chakra.div>
          <chakra.div color={LIGHT} fontSize="xs">
            {meta}
          </chakra.div>
        </chakra.div>
      </chakra.div>
    </chakra.div>
  );
}

/* -------------------- Person card (no composite components) -------------------- */

function PersonCard({ name, role, blurb, avatar, badges = [] }) {
  return (
    <chakra.div
      p="24px"
      rounded="2xl"
      bg={PANEL}
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 16px 45px rgba(0,0,0,0.45)"
      transition="all 180ms ease"
      _hover={{ transform: 'translateY(-4px)' }}
      display="flex"
      flexDir="column"
      gap="16px"
      h="100%"
    >
      <chakra.div display="flex" alignItems="center" gap="14px">
        <chakra.img
          src={avatar}
          alt={name}
          width="64px"
          height="64px"
          style={{ borderRadius: '9999px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.35)' }}
        />
        <chakra.div minW="0" lineHeight="1.1">
          <chakra.div color="white" fontWeight="800" fontSize="lg" noOfLines={1}>
            {name}
          </chakra.div>
          <chakra.div color={LIGHT} fontSize="sm" noOfLines={1}>
            {role}
          </chakra.div>
        </chakra.div>
      </chakra.div>

      <chakra.p color="whiteAlpha.900">{blurb}</chakra.p>

      {badges.length > 0 && (
        <chakra.div display="flex" flexWrap="wrap">
          {badges.map((b) => (
            <Chip key={b}>{b}</Chip>
          ))}
        </chakra.div>
      )}

      <chakra.div display="flex" gap="8px" pt="4px">
        <chakra.a href="#" _hover={{ color: YELLOW_2 }} display="inline-flex" alignItems="center" gap="6px">
          <FaLinkedin /> LinkedIn
        </chakra.a>
        <chakra.a href="#" _hover={{ color: YELLOW_2 }} display="inline-flex" alignItems="center" gap="6px">
          <FaGithub /> GitHub
        </chakra.a>
        <chakra.a href="#" _hover={{ color: YELLOW_2 }} display="inline-flex" alignItems="center" gap="6px">
          <FaTwitter /> X
        </chakra.a>
      </chakra.div>
    </chakra.div>
  );
}

/* -------------------- Page -------------------- */

export default function AboutUs() {
  return (
    <chakra.div bg={NAVY_DEEP} minH="100vh" color="white">
      {/* Hero / intro */}
      <chakra.div
        display="flex"
        flexDir={{ base: 'column', lg: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 6, md: 14, xl: 24 }}
        pt={{ base: 10, md: 16 }}
        pb={{ base: 6, md: 10 }}
        gap={10}
      >
        {/* Text block */}
        <chakra.div maxW="780px" display="flex" flexDir="column" gap="18px">
          <chakra.h1
            fontWeight="800"
            lineHeight="1.15"
            fontSize={{ base: '32px', md: '52px' }}
          >
            PumpPal{' '}
            <chakra.span bgClip="text" bgGradient={`linear(to-r, ${YELLOW}, ${YELLOW_2})`}>
            </chakra.span>{' '}
            - Built to Coach What Matters
          </chakra.h1>

          <chakra.p fontSize={{ base: 'md', md: 'lg' }} color={LIGHT}>
            PumpPal is a modern AI gym assistant dedicated to simplifying training decisions. Our platform blends
            evidence-based coaching, real-time feedback and human-centred design to help athletes and everyday lifters
            progress with clarity and confidence.
          </chakra.p>
        </chakra.div>

        {/* Journey / curve card */}
        <chakra.div
          position="relative"
          w={{ base: '1500px', lg: '1800px' }}
          h={{ base: '420px', md: '480px' }}
          bg={PANEL}
          rounded="2xl"
          border="1px solid"
          borderColor="whiteAlpha.200"
          boxShadow="0 24px 60px rgba(0,0,0,0.5)"
          overflow="hidden"
        >
          <chakra.div position="absolute" insetX="0" top="0" h="10px" bg="whiteAlpha.100" />

          <chakra.svg viewBox="0 0 560 380" position="absolute" inset="0">
            <defs>
              <linearGradient id="pp-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={YELLOW} />
                <stop offset="100%" stopColor={YELLOW_2} />
              </linearGradient>
            </defs>
            <path
              d="M 20 300 C 160 120, 260 260, 360 160 C 440 90, 500 120, 540 60"
              stroke="url(#pp-gradient)"
              strokeWidth="6"
              fill="none"
            />
          </chakra.svg>

          <Milestone n="1" title="2021 • Founded" meta="From a coaching research project" left="20%" top="60%" />
          <Milestone n="2" title="220+ Companies" meta="Pilots & partner gyms worldwide" left="54%" top="53%" />
          <Milestone n="3" title="115k+ Professionals" meta="Athletes & coaches engaged" left="84%" top="32%" />
        </chakra.div>
      </chakra.div>

      {/* Team section */}
      <chakra.div px={{ base: 6, md: 14, xl: 24 }} pb={{ base: 16, md: 24 }}>
        <chakra.div mb="24px">
          <chakra.h2 fontSize={{ base: '24px', md: '32px' }} fontWeight="800" mb="6px">
            Our Talented Team
          </chakra.h2>
          <chakra.p color={LIGHT} maxW="920px">
            A multidisciplinary crew combining product craftsmanship, machine learning and applied sport science. We
            obsess over small details so you can focus on the next rep.
          </chakra.p>
        </chakra.div>

        <chakra.div
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={{ base: '16px', md: '20px' }}
        >
          <PersonCard
            name="Mila Markov"
            role="CEO & Co-Founder"
            blurb="Former product lead in digital health. Mila steers strategy and partnerships while ensuring PumpPal remains relentlessly user-centric."
            avatar="https://i.pravatar.cc/300?img=47"
            badges={['Strategy', 'Partnerships', 'Operations']}
          />
          <PersonCard
            name="Jack Newman"
            role="Senior Full-Stack Developer"
            blurb="Jack architects our platform with a focus on speed, stability and privacy. He translates complex ML outputs into elegant, practical UX."
            avatar="https://i.pravatar.cc/300?img=12"
            badges={['TypeScript', 'ML Pipelines', 'Cloud']}
          />
          <PersonCard
            name="Sarina Martins, PhD"
            role="Head Trainer • Exercise Physiology"
            blurb="Sarina blends a PhD in Exercise Physiology with a decade of elite coaching. She grounds our models in science and field-tested programming."
            avatar="https://i.pravatar.cc/300?img=30"
            badges={['Programming', 'Biomechanics', 'Data-informed Coaching']}
          />
        </chakra.div>
      </chakra.div>
    </chakra.div>
  );
}
