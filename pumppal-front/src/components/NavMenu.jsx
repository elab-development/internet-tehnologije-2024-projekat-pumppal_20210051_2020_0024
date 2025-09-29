// src/components/NavMenu.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { chakra } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const NAVY_DEEP = '#232941';
const PANEL = '#232941';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';
const LIGHT_FADE = 'rgba(255,255,255,0.06)';

// Point to your backend. Change with REACT_APP_API_URL if needed.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Admin menu (adjust paths if your routes differ)
const ADMIN_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users-analytics', label: 'Users Analytics' },
];

// Read the exact keys you provided from sessionStorage
function readSessionUserExact() {
  if (typeof window === 'undefined') return { token: null };
  return {
    token: sessionStorage.getItem('token'),
    email: sessionStorage.getItem('userEmail') || '',
    id: sessionStorage.getItem('userId') || '',
    image: sessionStorage.getItem('userImage') || '',
    name: sessionStorage.getItem('userName') || 'User',
    role: sessionStorage.getItem('userRole') || 'Regular',
  };
}

function PillLink({ to, active, children, onClick }) {
  return (
    <RouterLink to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
      <chakra.button
        type="button"
        px="14px"
        py="8px"
        borderRadius="9999px"
        fontWeight="700"
        color={active ? 'black' : 'white'}
        bg={active ? `linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})` : 'transparent'}
        _hover={active ? { filter: 'brightness(0.95)' } : { bg: LIGHT_FADE }}
      >
        {children}
      </chakra.button>
    </RouterLink>
  );
}

export default function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState(() => readSessionUserExact());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Poll sessionStorage (lightweight) so the bar reacts to login changes
  useEffect(() => {
    const tick = () => setState(readSessionUserExact());
    const id = setInterval(tick, 700);
    const onStorage = () => tick();
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(id);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const { token, name, role, image } = useMemo(
    () => ({
      token: state.token,
      name: state.name,
      role: state.role,
      image: state.image,
    }),
    [state]
  );

  // Hide nav entirely when not authenticated
  if (!token) return null;

  const isAdmin = String(role).toLowerCase() === 'administrator';
  const isActive = (p) => location.pathname === p;

  const clearAndRedirect = () => {
    try {
      sessionStorage.clear();
    } catch {}
    navigate('/', { replace: true });
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
    } catch {
      // ignore network errors; we still clear session
    } finally {
      setLoggingOut(false);
      clearAndRedirect();
    }
  };

  return (
    <chakra.header
      position="sticky"
      top="0"
      zIndex="1000"
      w="100%"
      bg={NAVY_DEEP}
      borderBottom="1px solid"
      borderColor="whiteAlpha.150"
    >
      <chakra.div
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={3}
        display="flex"
        alignItems="center"
        minH="64px"
        gap="12px"
      >
        {/* Brand */}
        <RouterLink
          to={isAdmin ? '/dashboard' : '/home'}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <chakra.img
            src="/images/logo.png"
            alt="PumpPal"
            width={{ base: '100px', md: '100px' }}
            height="auto"
            style={{ display: 'block' }}
          />
        </RouterLink>

        <chakra.div flex="1" />

        {/* Desktop links */}
        <chakra.nav display={{ base: 'none', md: 'flex' }} gap="8px" alignItems="center">
          {isAdmin ? (
            <>
              <PillLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</PillLink>
              <PillLink to="/users-analytics" active={isActive('/users-analytics')}>Users Analytics</PillLink>
            </>
          ) : (
            <>
              <PillLink to="/home" active={isActive('/home')}>Home</PillLink>
              <PillLink to="/about" active={isActive('/about')}>About Us</PillLink>
              <PillLink to="/chats" active={isActive('/chats')}>My Chats</PillLink>
            </>
          )}
        </chakra.nav>

        {/* Desktop user */}
        <chakra.div display={{ base: 'none', md: 'flex' }} alignItems="center" gap="14px">
          <chakra.div display="flex" alignItems="center" gap="10px" minW="0">
            <chakra.img
              src={image || '/images/logo.png'}
              alt={name}
              width="50px"
              height="50px"
              style={{
                borderRadius: '9999px',
                border: '2px solid rgba(255,255,255,0.35)',
                objectFit: 'cover',
              }}
            />
            <chakra.div lineHeight="1.1" minW="0">
              <chakra.div color="white" fontWeight="700" noOfLines={1}>{name}</chakra.div>
              <chakra.div color={LIGHT} fontSize="12px" noOfLines={1}>{role}</chakra.div>
            </chakra.div>
          </chakra.div>

          <chakra.button
            type="button"
            onClick={handleLogout}
            borderRadius="9999px"
            color="black"
            fontWeight="800"
            px="18px"
            height="40px"
            bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
            _hover={{ filter: 'brightness(0.95)' }}
            disabled={loggingOut}
            opacity={loggingOut ? 0.7 : 1}
          >
            {loggingOut ? 'Logging out…' : 'Logout'}
          </chakra.button>
        </chakra.div>

        {/* Mobile hamburger */}
        <chakra.button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          display={{ base: 'inline-flex', md: 'none' }}
          color="white"
          p="8px"
          borderRadius="10px"
          _hover={{ bg: LIGHT_FADE }}
        >
          <chakra.span position="relative" width="20px" height="14px" display="block">
            <chakra.span position="absolute" insetX="0" top="0" height="2px" bg="white" borderRadius="9999px" />
            <chakra.span position="absolute" insetX="0" top="6px" height="2px" bg="white" borderRadius="9999px" />
            <chakra.span position="absolute" insetX="0" bottom="0" height="2px" bg="white" borderRadius="9999px" />
          </chakra.span>
        </chakra.button>
      </chakra.div>

      <chakra.div height="2px" bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`} opacity={0.35} />

      {/* Mobile sheet */}
      {mobileOpen && (
        <chakra.div
          position="fixed"
          inset="0"
          zIndex="1400"
          bg="rgba(0,0,0,0.6)"
          onClick={() => setMobileOpen(false)}
        >
          <chakra.aside
            position="absolute"
            right="0"
            top="0"
            bottom="0"
            width="84%"
            maxW="360px"
            bg={PANEL}
            borderLeft="1px solid rgba(255,255,255,0.2)"
            p="16px"
            onClick={(e) => e.stopPropagation()}
          >
            <chakra.div display="flex" alignItems="center" justifyContent="space-between" mb="16px">
              <chakra.div display="flex" alignItems="center" gap="10px">
                <chakra.img
                  src={image || '/images/logo.png'}
                  alt={name}
                  width="34px"
                  height="34px"
                  style={{
                    borderRadius: '9999px',
                    border: '2px solid rgba(255,255,255,0.35)',
                    objectFit: 'cover',
                  }}
                />
                <chakra.div lineHeight="1.1">
                  <chakra.div color="white" fontWeight="700">{name}</chakra.div>
                  <chakra.div color={LIGHT} fontSize="12px">{role}</chakra.div>
                </chakra.div>
              </chakra.div>
              <chakra.button
                type="button"
                aria-label="Close"
                onClick={() => setMobileOpen(false)}
                color="white"
                p="8px"
                borderRadius="10px"
                _hover={{ bg: LIGHT_FADE }}
              >
                <chakra.span position="relative" width="18px" height="18px" display="block">
                  <chakra.span position="absolute" left="0" right="0" top="8px" height="2px" bg="white" transform="rotate(45deg)" />
                  <chakra.span position="absolute" left="0" right="0" top="8px" height="2px" bg="white" transform="rotate(-45deg)" />
                </chakra.span>
              </chakra.button>
            </chakra.div>

            <chakra.nav display="grid" gap="10px">
              {isAdmin ? (
                <>
                  <PillLink to="/dashboard" active={isActive('/dashboard')} onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </PillLink>
                  <PillLink
                    to="/users-analytics"
                    active={isActive('/users-analytics')}
                    onClick={() => setMobileOpen(false)}
                  >
                    Users Analytics
                  </PillLink>
                </>
              ) : (
                <>
                  <PillLink to="/home" active={isActive('/home')} onClick={() => setMobileOpen(false)}>
                    Home
                  </PillLink>
                  <PillLink to="/about" active={isActive('/about')} onClick={() => setMobileOpen(false)}>
                    About Us
                  </PillLink>
                  <PillLink to="/chats" active={isActive('/chats')} onClick={() => setMobileOpen(false)}>
                    My Chats
                  </PillLink>
                </>
              )}

              <chakra.button
                type="button"
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                borderRadius="9999px"
                color="black"
                fontWeight="800"
                height="44px"
                mt="6px"
                bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
                _hover={{ filter: 'brightness(0.95)' }}
                disabled={loggingOut}
                opacity={loggingOut ? 0.7 : 1}
              >
                {loggingOut ? 'Logging out…' : 'Logout'}
              </chakra.button>
            </chakra.nav>
          </chakra.aside>
        </chakra.div>
      )}
    </chakra.header>
  );
}
