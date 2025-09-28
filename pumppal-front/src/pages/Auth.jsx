// src/pages/Auth.jsx
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  IconButton,
  Image as ChakraImage,
  Separator,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import useImageUpload from '../hooks/useImageUpload';

const slides = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg',
  '/images/slide5.jpg',
];

// PumpPal brand colors
const NAVY_DEEP = '#0f1f36';
const PANEL = '#232941';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';
const LIGHT_FADE = 'rgba(255,255,255,0.06)';

/** Input with a left icon (no InputGroup needed) */
function Field({ icon, inputProps }) {
  return (
    <Box position="relative" w="100%">
      <Box
        position="absolute"
        left="14px"
        top="50%"
        transform="translateY(-50%)"
        opacity={0.85}
        pointerEvents="none"
        fontSize="sm"
      >
        {icon}
      </Box>
      <Input
        pl="44px"
        h="48px"
        rounded="xl"
        bg={LIGHT_FADE}
        border="1px solid"
        borderColor="whiteAlpha.200"
        _hover={{ borderColor: 'whiteAlpha.300', bg: 'rgba(255,255,255,0.08)' }}
        _focus={{
          borderColor: YELLOW,
          boxShadow: '0 0 0 4px rgba(245,180,0,0.18)',
          bg: 'rgba(255,255,255,0.09)',
        }}
        _placeholder={{ color: 'whiteAlpha.700' }}
        transition="all 200ms ease"
        {...inputProps}
      />
    </Box>
  );
}

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    image_url: '',
  });
  const [notice, setNotice] = useState(null);

  const { imageUrl, uploading, uploadError, onFileSelect, removeImage } = useImageUpload();
  const { error: authError, isLoading: authLoading, submitAuth } = useAuth();

  useEffect(() => {
    if (imageUrl) setForm((p) => ({ ...p, image_url: imageUrl }));
  }, [imageUrl]);

  const resetAll = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      image_url: '',
    });
    removeImage();
  };

  useEffect(() => {
    resetAll();
    setNotice(null);
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);

    const payload = { ...form, role: 'regular' };

    try {
      const userData = await submitAuth(mode, payload);

      if (mode === 'register') {
        setNotice({ type: 'success', msg: 'Account created! You can log in now.' });
        setMode('login');
        resetAll();
      } else {
        if (userData.role === 'regular') window.location.replace('/home');
        else window.location.replace('/dashboard');
      }
    } catch {
      if (authError) setNotice({ type: 'error', msg: authError });
    }
  };

  // Left slider
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const fileInputRef = useRef(null);

  return (
    <Flex minH="100dvh" w="100%" overflow="hidden" bg={NAVY_DEEP}>
      {/* LEFT: Slider */}
      <Box
        flex={{ base: 0, md: 1 }}
        position="relative"
        display={{ base: 'none', md: 'block' }}
        bg="black"
      >
        {slides.map((src, i) => (
          <Box
            key={src}
            position="absolute"
            inset="0"
            bgImage={`url(${src})`}
            bgSize="cover"
            bgPos="center"
            bgRepeat="no-repeat"
            opacity={i === current ? 1 : 0}
            transform={i === current ? 'scale(1.02)' : 'scale(1)'}
            transition="all 900ms ease"
          />
        ))}

        <HStack
          spacing={2}
          position="absolute"
          bottom={6}
          left="50%"
          transform="translateX(-50%)"
        >
          {slides.map((_, i) => (
            <Box
              key={i}
              w={i === current ? '22px' : '8px'}
              h="8px"
              rounded="full"
              bg={i === current ? YELLOW : 'whiteAlpha.800'}
              opacity={i === current ? 1 : 0.65}
              transition="all 250ms ease"
              cursor="pointer"
              onClick={() => setCurrent(i)}
            />
          ))}
        </HStack>

        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-t, rgba(0,0,0,0.55), rgba(0,0,0,0.15))"
          pointerEvents="none"
        />
      </Box>

      {/* RIGHT: Auth Panel */}
      <Flex flex="1" align="center" justify="center" p={{ base: 6, md: 10 }}>
        <Box
          w="full"
          maxW="560px"
          rounded="2xl"
          bg={PANEL}
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          boxShadow="0 24px 70px rgba(0,0,0,0.55)"
          p={{ base: 6, md: 8 }}
        >
          <VStack spacing={1} mb={5}>
            <ChakraImage
              src="/images/logo.png"
              alt="PumpPal logo"
              w="190px"
              rounded="lg"
              boxShadow="lg"
            />
          </VStack>

          {/* Segmented control (no Tabs, so no underline ever) */}
          <Box mb="3" position="relative">
            <HStack
              bg="rgba(255,255,255,0.06)"
              p="1"
              rounded="full"
              border="1px solid"
              borderColor="whiteAlpha.200"
              position="relative"
              overflow="hidden"
            >
              {/* pill indicator under the selected button */}
              <Box
                position="absolute"
                top="4px"
                bottom="4px"
                left="4px"
                w="calc(51.1% - 8px)"
                rounded="full"
                bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
                boxShadow="0 6px 18px rgba(245,180,0,0.35)"
                transition="all 200ms ease"
                transform={mode === 'login' ? 'translateX(0)' : 'translateX(100%)'}
                zIndex={0}
              />

              <Button
                onClick={() => setMode('login')}
                variant="ghost"
                rounded="full"
                flex="1"
                fontWeight="700"
                letterSpacing="0.2px"
                color={mode === 'login' ? 'black' : 'white'}
                zIndex={1}
              >
                Login
              </Button>

              <Button
                onClick={() => setMode('register')}
                variant="ghost"
                rounded="full"
                flex="1"
                fontWeight="700"
                letterSpacing="0.2px"
                color={mode === 'register' ? 'black' : 'white'}
                zIndex={1}
              >
                Register
              </Button>
            </HStack>
          </Box>

          {notice && (
            <Box
              mb={4}
              px={3}
              py={2}
              rounded="md"
              bg={notice.type === 'success' ? 'green.500' : 'red.500'}
              color="white"
              fontSize="sm"
            >
              {notice.msg}
            </Box>
          )}
          {!notice && authError && (
            <Box bg="red.500" color="white" rounded="md" px={3} py={2} mb={4} fontSize="sm">
              {authError}
            </Box>
          )}

          {mode === 'login' ? (
            <>
              <Text fontSize="2xl" fontWeight="800" mb={4} color="white">
                Login to PumpPal
              </Text>

              <Box as="form" onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <Field
                    icon={<FaEnvelope />}
                    inputProps={{
                      name: 'email',
                      type: 'email',
                      placeholder: 'Email',
                      value: form.email,
                      onChange: handleChange,
                    }}
                  />
                  <Field
                    icon={<FaLock />}
                    inputProps={{
                      name: 'password',
                      type: 'password',
                      placeholder: 'Password',
                      value: form.password,
                      onChange: handleChange,
                    }}
                  />

                  <Button
                    type="submit"
                    disabled={authLoading}
                    h="52px"
                    rounded="xl"
                    fontWeight="800"
                    bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
                    color="black"
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: '0 10px 24px rgba(245,180,0,0.35)',
                    }}
                    _active={{ transform: 'translateY(0px)' }}
                    transition="all 180ms ease"
                  >
                    {authLoading ? 'Logging in…' : 'Login'}
                  </Button>
                </VStack>
              </Box>
            </>
          ) : (
            <>
              <Text fontSize="2xl" fontWeight="800" mb={4} color="white">
                Create your PumpPal account
              </Text>

              <Box as="form" onSubmit={handleSubmit}>
                <VStack spacing={5} align="stretch">
                  {/* Two-column grid on md+, stacked on mobile */}
                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    columnGap={{ base: 4, md: 6 }}
                    rowGap={{ base: 4, md: 5 }}
                  >
                    <Field
                      icon={<FaUser />}
                      inputProps={{
                        name: 'name',
                        placeholder: 'Name',
                        value: form.name,
                        onChange: handleChange,
                      }}
                    />
                    <Field
                      icon={<FaEnvelope />}
                      inputProps={{
                        name: 'email',
                        type: 'email',
                        placeholder: 'Email',
                        value: form.email,
                        onChange: handleChange,
                      }}
                    />
                    <Field
                      icon={<FaLock />}
                      inputProps={{
                        name: 'password',
                        type: 'password',
                        placeholder: 'Password',
                        value: form.password,
                        onChange: handleChange,
                      }}
                    />
                    <Field
                      icon={<FaLock />}
                      inputProps={{
                        name: 'password_confirmation',
                        type: 'password',
                        placeholder: 'Confirm Password',
                        value: form.password_confirmation,
                        onChange: handleChange,
                      }}
                    />
                  </SimpleGrid>

                  {/* Compact upload row */}
                  <Box
                    mt={{ base: 3, md: 4 }}
                    border="1px dashed"
                    borderColor={form.image_url ? 'green.400' : 'whiteAlpha.300'}
                    rounded="xl"
                    p={3}
                    bg="rgba(255,255,255,0.04)"
                  >
                    <HStack justify="space-between" align="center" spacing={4}>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        leftIcon={<FaImage />}
                        variant="outline"
                        rounded="xl"
                        borderColor="whiteAlpha.300"
                        color="white"
                        _hover={{ bg: 'whiteAlpha.100' }}
                        disabled={uploading}
                      >
                        {uploading
                          ? 'Uploading…'
                          : form.image_url
                          ? 'Change avatar'
                          : 'Upload an avatar image'}
                      </Button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => onFileSelect(e.target.files?.[0])}
                      />

                      {form.image_url ? (
                        <HStack spacing={2}>
                          <FaCheckCircle color="#48BB78" />
                          <Text color="green.300" fontWeight="600">
                            Uploaded
                          </Text>
                          <ChakraImage
                            src={form.image_url}
                            alt="avatar"
                            h="48px"
                            w="48px"
                            rounded="full"
                            objectFit="cover"
                            border="2px solid"
                            borderColor="whiteAlpha.400"
                            boxShadow="0 6px 18px rgba(0,0,0,0.35)"
                          />
                          <IconButton
                            aria-label="Remove avatar"
                            onClick={() => {
                              removeImage();
                              setForm((f) => ({ ...f, image_url: '' }));
                            }}
                            rounded="full"
                          >
                            <FaTimesCircle />
                          </IconButton>
                        </HStack>
                      ) : (
                        <Text color="whiteAlpha.700" fontSize="sm">
                          JPG/PNG recommended • up to 2MB
                        </Text>
                      )}
                    </HStack>

                    {uploadError && (
                      <Text mt={2} color="red.300" fontSize="sm">
                        {uploadError}
                      </Text>
                    )}
                  </Box>

                  <Button
                    type="submit"
                    disabled={authLoading}
                    h="52px"
                    rounded="xl"
                    fontWeight="800"
                    bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
                    color="black"
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: '0 10px 24px rgba(245,180,0,0.35)',
                    }}
                    _active={{ transform: 'translateY(0px)' }}
                    transition="all 180ms ease"
                  >
                    {authLoading ? 'Creating…' : 'Create account'}
                  </Button>
                </VStack>
              </Box>
            </>
          )}

          <Separator mt={6} borderColor="whiteAlpha.200" />
          <Text mt={4} fontSize="sm" color="whiteAlpha.800" textAlign="center">
            © {new Date().getFullYear()} PumpPal
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
