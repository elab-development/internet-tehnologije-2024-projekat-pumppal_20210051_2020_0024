// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import { chakra } from '@chakra-ui/react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaUserShield, FaComments, FaChartLine } from 'react-icons/fa';

/* Brand colors */
const NAVY_DEEP = '#0f1f36';
const PANEL = '#232941';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';
const LIGHT_FADE = 'rgba(255,255,255,0.06)';

/* API base */
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const token = useMemo(() => sessionStorage.getItem('token'), []);
  const userRole = useMemo(() => sessionStorage.getItem('userRole') || 'regular', []);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [stats, setStats] = useState({
    totals: {
      users: 0,
      regular_users: 0,
      administrators: 0,
      chats: 0,
      messages: 0,
    },
    derived: {
      users_with_at_least_one_chat: 0,
      avg_chats_per_user: 0,
      avg_messages_per_chat: 0,
      new_users_last_7_days: 0,
    },
    top_users_by_chats: [],
  });

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    if (userRole !== 'administrator') {
      // Redirect non-admins away, no partial render
      navigate('/home', { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/statistics`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const data = res?.data?.data || {};
        setStats({
          totals: data.totals || {},
          derived: data.derived || {},
          top_users_by_chats: Array.isArray(data.top_users_by_chats)
            ? data.top_users_by_chats
            : [],
        });
        setErr('');
      } catch (e) {
        setErr('Could not load admin statistics.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, userRole, navigate]);

  const kpis = [
    {
      label: 'Total Users',
      value: stats.totals.users,
      icon: FaUsers,
    },
    {
      label: 'Regular Users',
      value: stats.totals.regular_users,
      icon: FaUsers,
    },
    {
      label: 'Administrators',
      value: stats.totals.administrators,
      icon: FaUserShield,
    },
    {
      label: 'Total Chats',
      value: stats.totals.chats,
      icon: FaComments,
    },
    {
      label: 'Total Messages',
      value: stats.totals.messages,
      icon: FaChartLine,
    },
  ];

  const roleBars = [
    { label: 'Regular', count: Number(stats.totals.regular_users || 0) },
    { label: 'Admins', count: Number(stats.totals.administrators || 0) },
  ];

  const volumeBars = [
    { label: 'Chats', count: Number(stats.totals.chats || 0) },
    { label: 'Messages', count: Number(stats.totals.messages || 0) },
  ];

  return (
    <chakra.div bg={NAVY_DEEP} minH="100vh" color="white">
      {/* Header / hero */}
      <chakra.div
        position="relative"
        px={{ base: '24px', md: '48px', lg: '80px' }}
        pt={{ base: '40px', md: '56px' }}
        pb={{ base: '40px', md: '56px' }}
        overflow="hidden"
      >
        <chakra.div
          position="absolute"
          top="-25%"
          right="-15%"
          w="60vw"
          h="60vw"
          borderRadius="9999px"
          filter="blur(110px)"
          bg={`radial-gradient(closest-side, ${YELLOW_2}22, transparent 60%)`}
        />
        <chakra.div
          display="flex"
          flexDir={{ base: 'column', lg: 'row' }}
          gap={{ base: '32px', lg: '56px' }}
          alignItems="center"
        >
          {/* Left copy */}
          <chakra.div maxW="760px" zIndex={1} display="flex" flexDir="column" gap="16px">
            <chakra.div
              display="inline-flex"
              alignItems="center"
              gap="8px"
              px="12px"
              py="6px"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="9999px"
              bg={LIGHT_FADE}
              color={LIGHT}
              fontWeight="700"
              width="fit-content"
            >
              Admin • Control Center
            </chakra.div>

            <chakra.div fontWeight="900" fontSize={{ base: '28px', md: '48px' }} lineHeight="1.1">
              Admin Dashboard
            </chakra.div>

            <chakra.div color={LIGHT} fontSize={{ base: '14px', md: '16px' }}>
              Monitor user growth, engagement and platform activity at a glance. Keep your PumpPal
              AI community thriving with instant insights.
            </chakra.div>

            <chakra.div display="flex" gap="12px" pt="8px" flexWrap="wrap">
              <chakra.a
                as={RouterLink}
                href={undefined}
                to="/users-analytics"
                px="18px"
                py="10px"
                borderRadius="9999px"
                bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
                color="black"
                fontWeight="800"
              >
                View Users Analytics
              </chakra.a>
            </chakra.div>
          </chakra.div>

          {/* Right image */}
          <chakra.div position="relative" w="100%" maxW={{ base: '520px', lg: '680px' }}>
            <chakra.div
              position="absolute"
              inset={{ base: '16px', md: '24px' }}
              borderRadius="24px"
              bg="rgba(255,255,255,0.04)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              transform="rotate(-3deg)"
            />
            <chakra.img
              src="/images/dashboard.png"
              alt="Dashboard illustration"
              style={{ position: 'relative', width: '100%', objectFit: 'contain' }}
              draggable={false}
            />
          </chakra.div>
        </chakra.div>
      </chakra.div>

      {/* Error banner */}
      {err && (
        <chakra.div
          role="alert"
          bg="rgba(255,99,71,0.15)"
          border="1px solid rgba(255,99,71,0.35)"
          color="tomato"
          px="24px"
          py="12px"
          mx={{ base: '24px', md: '48px', lg: '80px' }}
          mb="16px"
          borderRadius="14px"
        >
          {err}
        </chakra.div>
      )}

      {/* KPI cards */}
      <chakra.div px={{ base: '24px', md: '48px', lg: '80px' }} pb={{ base: '24px', md: '40px' }}>
        <chakra.div
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            sm: '1fr 1fr',
            xl: 'repeat(5, minmax(0,1fr))',
          }}
          gap={{ base: '16px', md: '20px' }}
        >
          {kpis.map((k) => (
            <StatCard key={k.label} icon={k.icon} label={k.label} value={k.value} loading={loading} />
          ))}
        </chakra.div>
      </chakra.div>

      {/* Panels */}
      <chakra.div px={{ base: '24px', md: '48px', lg: '80px' }} pb="56px">
        <chakra.div
          display="grid"
          gridTemplateColumns={{ base: '1fr', xl: '1fr 1fr' }}
          gap={{ base: '16px', md: '20px' }}
        >
          <Panel title="Users by Role" subtitle="Current distribution">
            <Bars data={roleBars} loading={loading} />
          </Panel>

          <Panel title="Usage Volume" subtitle="Chats vs. Messages">
            <Bars data={volumeBars} loading={loading} />
          </Panel>
        </chakra.div>

        <chakra.div mt="20px">
          <Panel title="Top Users by Chats" subtitle="Top 5">
            <TopUsers data={stats.top_users_by_chats} loading={loading} />
          </Panel>
        </chakra.div>
      </chakra.div>
    </chakra.div>
  );
}

/* ========== Small building blocks (chakra primitives only) ========== */

function StatCard({ icon: IconCmp, label, value, loading }) {
  return (
    <chakra.div
      p="16px"
      borderRadius="16px"
      bg="rgba(255,255,255,0.04)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 12px 40px rgba(0,0,0,0.35)"
    >
      <chakra.div display="flex" justifyContent="space-between" alignItems="center" mb="8px">
        <chakra.div display="flex" alignItems="center" gap="10px">
          <chakra.div
            w="34px"
            h="34px"
            borderRadius="9999px"
            display="grid"
            placeItems="center"
            bg={LIGHT_FADE}
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <IconCmp color={YELLOW} />
          </chakra.div>
          <chakra.div color={LIGHT} fontSize="14px">
            {label}
          </chakra.div>
        </chakra.div>
        <chakra.div
          px="8px"
          py="2px"
          borderRadius="9999px"
          bg={LIGHT_FADE}
          border="1px solid"
          borderColor="whiteAlpha.200"
          color={LIGHT}
          fontSize="12px"
        >
          Live
        </chakra.div>
      </chakra.div>

      <chakra.div fontSize="28px" fontWeight="900" minH="36px">
        {loading ? '—' : formatNumber(value)}
      </chakra.div>
    </chakra.div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <chakra.div
      p="16px"
      borderRadius="18px"
      bg={PANEL}
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 12px 40px rgba(0,0,0,0.35)"
    >
      <chakra.div mb="10px">
        <chakra.div fontWeight="900" fontSize="18px">
          {title}
        </chakra.div>
        {subtitle && (
          <chakra.div color={LIGHT} fontSize="13px">
            {subtitle}
          </chakra.div>
        )}
      </chakra.div>
      {children}
    </chakra.div>
  );
}

/* Simple vertical bars built with divs */
function Bars({ data = [], loading }) {
  const values = data.map((d) => Number(d.count || 0));
  const max = Math.max(1, ...values);

  return (
    <chakra.div
      display="flex"
      alignItems="flex-end"
      gap="10px"
      minH="200px"
      p="12px"
      borderRadius="12px"
      bg="rgba(255,255,255,0.03)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      {loading ? (
        <chakra.div color={LIGHT}>Loading…</chakra.div>
      ) : data.length === 0 ? (
        <chakra.div color={LIGHT}>No data.</chakra.div>
      ) : (
        data.map((d) => {
          const h = Math.max(6, Math.round((Number(d.count) / max) * 160));
          return (
            <chakra.div key={d.label} display="flex" flexDir="column" alignItems="center" gap="8px">
              <chakra.div
                w="28px"
                h={`${h}px`}
                borderRadius="8px"
                bg={YELLOW}
                _hover={{ bg: YELLOW_2 }}
                title={`${d.label}: ${formatNumber(d.count)}`}
              />
              <chakra.div color={LIGHT} fontSize="12px">
                {d.label}
              </chakra.div>
              <chakra.div fontWeight="800" fontSize="12px">
                {formatNumber(d.count)}
              </chakra.div>
            </chakra.div>
          );
        })
      )}
    </chakra.div>
  );
}

function TopUsers({ data = [], loading }) {
  if (loading) return <chakra.div color={LIGHT}>Loading…</chakra.div>;
  if (!Array.isArray(data) || data.length === 0) {
    return <chakra.div color={LIGHT}>No users found.</chakra.div>;
  }

  return (
    <chakra.div display="flex" flexDir="column" gap="10px">
      {data.map((u) => (
        <chakra.div
          key={u.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p="10px"
          borderRadius="12px"
          bg="rgba(255,255,255,0.03)"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <chakra.div display="flex" alignItems="center" gap="12px">
            <chakra.img
              src={u.image_url || '/images/default-avatar.png'}
              alt={u.name}
              width="36px"
              height="36px"
              style={{
                borderRadius: '9999px',
                objectFit: 'cover',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            />
            <chakra.div>
              <chakra.div fontWeight="800">{u.name}</chakra.div>
              <chakra.div color={LIGHT} fontSize="12px">
                {u.email} • {u.role}
              </chakra.div>
            </chakra.div>
          </chakra.div>

          <chakra.div fontWeight="900">{formatNumber(u.chats_count)}</chakra.div>
        </chakra.div>
      ))}
    </chakra.div>
  );
}

/* Utils */
function formatNumber(n) {
  try {
    return new Intl.NumberFormat().format(Number(n || 0));
  } catch {
    return String(n ?? 0);
  }
}
