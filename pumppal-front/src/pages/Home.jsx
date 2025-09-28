import {
  Box,
  Flex,
  VStack,
  HStack,
  Stack,
  Text,
  Button,
  Image,
  SimpleGrid,
  Icon,
  Badge,
} from '@chakra-ui/react';
import {
  FaDumbbell,
  FaRobot,
  FaStopwatch,
  FaUserShield,
  FaArrowRight,
  FaBolt,
  FaChartLine,
} from 'react-icons/fa';

// Brand colors
const NAVY_DEEP = '#0f1f36';
const PANEL = '#232941';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';
const LIGHT_FADE = 'rgba(255,255,255,0.06)';

export default function Home() {
  return (
    <Box bg={NAVY_DEEP} minH="100vh" color="white">
      {/* ===== HERO ===== */}
      <Box
        position="relative"
        px={{ base: 6, md: 12, lg: 20 }}
        pt={{ base: 10, md: 16 }}
        pb={{ base: 12, md: 20 }}
        overflow="hidden"
      >
        {/* Ambient gradient / glow */}
        <Box
          position="absolute"
          top="-20%"
          right="-15%"
          w="60vw"
          h="60vw"
          rounded="full"
          filter="blur(110px)"
          bg={`radial-gradient(closest-side, ${YELLOW_2}22, transparent 60%)`}
        />
        <Flex
          align="center"
          gap={{ base: 8, lg: 16 }}
          direction={{ base: 'column', lg: 'row' }}
        >
          {/* Left */}
          <VStack align="flex-start" spacing={6} maxW="720px" zIndex={1}>
            <Badge
              px={3}
              py={1}
              rounded="full"
              bg={LIGHT_FADE}
              border="1px solid"
              borderColor="whiteAlpha.200"
              fontWeight="700"
              color={LIGHT}
              textTransform="none"
            >
              New • AI Gym Assistant
            </Badge>

            <Text
              lineHeight="1.1"
              fontWeight="900"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            >
              Train smarter with{' '}
              <Text
                as="span"
                bgClip="text"
                bgGradient={`linear(to-r, ${YELLOW}, ${YELLOW_2})`}
              >
                PumpPal AI
              </Text>
            </Text>

            <Text fontSize={{ base: 'md', md: 'lg' }} color={LIGHT}>
              Personalized plans, real-time progress, and powerful insights to
              help you hit every goal—without second-guessing your routine.
            </Text>

            <HStack spacing={4} flexWrap="wrap">
              <Button
                size="lg"
                rounded="full"
                fontWeight="800"
                rightIcon={<FaArrowRight />}
                bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
                color="black"
                _hover={{ transform: 'translateY(-2px)' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 180ms ease"
              >
                Get Started
              </Button>

              <Button
                size="lg"
                rounded="full"
                variant="outline"
                borderColor={YELLOW}
                color={YELLOW_2}
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                Learn More
              </Button>
            </HStack>

            {/* Quick trust strip */}
            <HStack
              spacing={6}
              pt={2}
              color="whiteAlpha.800"
              fontSize="sm"
              flexWrap="wrap"
            >
              <HStack>
                <Icon as={FaBolt} color={YELLOW} />
                <Text>AI Recommendations</Text>
              </HStack>
              <HStack>
                <Icon as={FaChartLine} color={YELLOW} />
                <Text>Progress Insights</Text>
              </HStack>
              <HStack>
                <Icon as={FaUserShield} color={YELLOW} />
                <Text>Private & Secure</Text>
              </HStack>
            </HStack>
          </VStack>

          {/* Right (hero image from /public) */}
          <Box
            flex="1"
            maxW={{ base: '520px', lg: '640px' }}
            w="100%"
            position="relative"
          >
            {/* Subtle glass plate behind image */}
            <Box
              position="absolute"
              inset={{ base: 4, md: 8 }}
              rounded="3xl"
              bg="rgba(255,255,255,0.04)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              filter="blur(0.5px)"
              transform="rotate(-3deg)"
            />
            <Image
              src="/images/home.png"
              alt="Athlete training"
              zIndex={1}
              position="relative"
              w="100%"
              objectFit="contain"
              draggable={false}
            />
          </Box>
        </Flex>
      </Box>

      {/* ===== FEATURE BLOCKS ===== */}
      <Box
        px={{ base: 6, md: 12, lg: 20 }}
        py={{ base: 12, md: 16 }}
        bg={PANEL}
      >
        <VStack spacing={3} textAlign="center" mb={10}>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900">
            Why choose PumpPal AI?
          </Text>
          <Text maxW="900px" color={LIGHT}>
            Everything you need to plan smarter workouts, track performance and
            stay consistent—wrapped in a clean, modern experience.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={{ base: 6, md: 10 }} px={{ base: 2, md: 4 }} >
          <FeatureCard
            icon={FaDumbbell}
            title="Smart Workout Tracking"
            desc="Log workouts in seconds. PumpPal turns your data into insights that actually help you improve."
          />
          <FeatureCard
            icon={FaRobot}
            title="AI Recommendations"
            desc="Adaptive plans and exercise picks that match your goals, recovery and schedule."
          />
          <FeatureCard
            icon={FaStopwatch}
            title="Real-Time Progress"
            desc="Live feedback and weekly summaries keep you on track—no spreadsheets needed."
          />
          <FeatureCard
            icon={FaUserShield}
            title="Safe & Reliable"
            desc="Designed with privacy in mind. Your data is protected and stays yours."
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
}

/* ---------- Small building blocks ---------- */

function FeatureCard({ icon, title, desc }) {
  return (
    <Stack
      spacing={4}
      p={6}
      m={2}
      rounded="2xl"
      bg="rgba(255,255,255,0.04)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 12px 40px rgba(0,0,0,0.35)"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 50px rgba(0,0,0,0.45)',
      }}
      transition="all 180ms ease"
      h="100%"
    >
      <Icon as={icon} boxSize={10} color={YELLOW} />
      <Text fontSize="xl" fontWeight="800">
        {title}
      </Text>
      <Text color={LIGHT}>{desc}</Text>
    </Stack>
  );
}
