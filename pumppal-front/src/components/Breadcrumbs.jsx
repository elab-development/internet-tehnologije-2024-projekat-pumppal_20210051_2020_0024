// src/components/Breadcrumbs.jsx
import React, { useMemo } from 'react';
import { chakra } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Brand colors
const NAVY_DEEP = '#0f1f36';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';

// Pages where breadcrumbs should NOT show
const DEFAULT_EXCLUDE = new Set(['/', '/home', '/dashboard']);

// Optional mapping to pretty labels
const LABEL_MAP = {
  about: 'About Us',
  'about-us': 'About Us',
  chats: 'My Chats',
  'users-analytics': 'Users Analytics',
  dashboard: 'Dashboard',
};

function labelize(slug = '') {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function Breadcrumbs({
  hideOn = DEFAULT_EXCLUDE,
  rootLabel = 'Home',
  rootPath = '/home',
}) {
  const { pathname } = useLocation();

  // Build crumbs from pathname (hook is called unconditionally)
  const crumbs = useMemo(() => {
    const segments = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean);

    const list = [{ label: rootLabel, to: rootPath }];

    let acc = '';
    segments.forEach((seg) => {
      acc += `/${seg}`;
      list.push({
        label: LABEL_MAP[seg] || labelize(seg),
        to: acc,
      });
    });

    return list;
  }, [pathname, rootLabel, rootPath]);

  // decide visibility AFTER hooks are called
  const shouldHide = hideOn.has(pathname);
  if (shouldHide) return null;

  return (
    <chakra.nav aria-label="breadcrumb" bg={NAVY_DEEP}>
      <chakra.div
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 3, md: 3 }}
        display="flex"
        alignItems="center"
        gap="10px"
        color={LIGHT}
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={`${c.to}-${i}`}>
              {i > 0 && (
                <chakra.span opacity={0.6} px="6px">
                  ›
                </chakra.span>
              )}
              {isLast ? (
                <chakra.span fontWeight="900" color="white">
                  {c.label}
                </chakra.span>
              ) : (
                <chakra.a
                  as={RouterLink}
                  to={c.to}
                  fontWeight="800"
                  _hover={{ color: YELLOW_2, textDecoration: 'underline' }}
                >
                  {c.label}
                </chakra.a>
              )}
            </React.Fragment>
          );
        })}
      </chakra.div>

      <chakra.div
        height="2px"
        bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
        opacity={0.35}
      />
    </chakra.nav>
  );
}
