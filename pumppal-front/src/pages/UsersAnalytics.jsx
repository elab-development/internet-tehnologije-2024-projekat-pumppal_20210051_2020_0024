// src/pages/UsersAnalytics.jsx
import { useEffect, useMemo, useState } from 'react';
import { chakra } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa';

/* Brand palette */
const NAVY_DEEP = '#0f1f36';
const PANEL = '#232941';
const YELLOW = '#F5B400';
const YELLOW_2 = '#FFC53D';
const LIGHT = '#c9d4e6';
const LIGHT_FADE = 'rgba(255,255,255,0.06)';

/* API base (adjust if needed) */
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

/* Helpers */
const readToken = () =>
  (typeof window === 'undefined' ? null : sessionStorage.getItem('token'));
const readRole = () =>
  (typeof window === 'undefined' ? 'regular' : sessionStorage.getItem('userRole') || 'regular');
const bearer = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
});

const PER_PAGE = 4;

export default function UsersAnalytics() {
  const navigate = useNavigate();

  const token = useMemo(() => readToken(), []);
  const role = useMemo(() => readRole(), []);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null); // {type: 'success'|'error', msg: string}
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const [page, setPage] = useState(1);

  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);

  /* Guard + fetch */
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    if (String(role).toLowerCase() !== 'administrator') {
      navigate('/home');
      return;
    }

    const loadUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users`, { headers: bearer(token) });
        // Accept both {data: [...] } and [...]
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
        // Exclude administrators
        const filtered = list.filter((u) => String(u.role).toLowerCase() !== 'administrator');
        setAllUsers(filtered);
      } catch (e) {
        console.error(e);
        setNotice({ type: 'error', msg: 'Failed to load users.' });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token, role, navigate]);

  /* Derived view: search, sort, paginate */
  const view = useMemo(() => {
    let out = [...allUsers];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter((u) => (u.name || '').toLowerCase().includes(q));
    }
    out.sort((a, b) => {
      const na = (a.name || '').toLowerCase();
      const nb = (b.name || '').toLowerCase();
      return sortAsc ? na.localeCompare(nb) : nb.localeCompare(na);
    });
    return out;
  }, [allUsers, search, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(view.length / PER_PAGE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const pageSlice = view.slice((pageSafe - 1) * PER_PAGE, pageSafe * PER_PAGE);

  useEffect(() => {
    // whenever data / search / sort changes, keep page in range
    if (page !== pageSafe) setPage(pageSafe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.length, pageSafe]);

  /* Editing */
  const startEdit = (u) => {
    setEditRowId(u.id);
    setEditForm({ name: u.name || '', email: u.email || '' });
    setNotice(null);
  };

  const cancelEdit = () => {
    setEditRowId(null);
    setEditForm({ name: '', email: '' });
  };

  const saveEdit = async (id) => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setNotice({ type: 'error', msg: 'Name and email are required.' });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      // Try PUT first, fallback to PATCH if needed
      let res;
      try {
        res = await axios.put(`${API_BASE}/users/${id}`, editForm, { headers: bearer(token) });
      } catch (e) {
        res = await axios.patch(`${API_BASE}/users/${id}`, editForm, { headers: bearer(token) });
      }
      const updated = res?.data?.data || res?.data || { id, ...editForm };
      setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      setNotice({ type: 'success', msg: 'User updated.' });
      cancelEdit();
    } catch (e) {
      console.error(e);
      setNotice({ type: 'error', msg: 'Failed to update user.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <chakra.div bg={NAVY_DEEP} minH="100vh" color="white" p={{ base: 4, md: 8, lg: 16 }}>
      {/* Notice bar */}
      {notice && (
        <chakra.div
          role="alert"
          bg={notice.type === 'success' ? 'rgba(56,178,172,0.15)' : 'rgba(255,99,71,0.15)'}
          border="1px solid"
          borderColor={notice.type === 'success' ? 'rgba(56,178,172,0.45)' : 'rgba(255,99,71,0.35)'}
          color={notice.type === 'success' ? 'teal.200' : 'tomato'}
          px={6}
          py={3}
          rounded="xl"
          mb={4}
        >
          {notice.msg}
        </chakra.div>
      )}

      {/* Header */}
      <chakra.div mb={6} display="flex" flexDir={{ base: 'column', md: 'row' }} gap={4} alignItems="center">
        <chakra.div flex="1">
          <chakra.div fontWeight="900" fontSize={{ base: '2xl', md: '3xl' }}>
            Users Analytics
          </chakra.div>
          <chakra.div color={LIGHT} mt={1}>
            Manage your community: search, sort and edit user details. (Administrators are hidden.)
          </chakra.div>
        </chakra.div>

        {/* Search + Sort */}
        <chakra.div display="flex" gap={3} alignItems="center" w={{ base: '100%', md: 'auto' }}>
          <chakra.label
            display="flex"
            alignItems="center"
            gap="8px"
            px="12px"
            py="10px"
            rounded="xl"
            bg={PANEL}
            border="1px solid"
            borderColor="whiteAlpha.200"
            w={{ base: '100%', md: '280px' }}
          >
            <FaSearch />
            <chakra.input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              bg="transparent"
              color="white"
              _placeholder={{ color: 'whiteAlpha.600' }}
              border="none"
              outline="none"
              flex="1"
            />
          </chakra.label>

          <chakra.button
            type="button"
            onClick={() => setSortAsc((v) => !v)}
            display="flex"
            alignItems="center"
            gap="8px"
            px="14px"
            py="10px"
            rounded="full"
            bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
            color="black"
            fontWeight="800"
            _hover={{ filter: 'brightness(0.95)' }}
            title="Toggle sort by name"
          >
            {sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
            Sort
          </chakra.button>
        </chakra.div>
      </chakra.div>

      {/* Table Panel */}
      <chakra.div
        rounded="2xl"
        bg={PANEL}
        border="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="0 12px 40px rgba(0,0,0,0.35)"
        p={{ base: 2, md: 3 }}
      >
        {/* Table Head */}
        <chakra.div
          display="grid"
          gridTemplateColumns="80px 1fr 1.2fr 160px 140px"
          gap="10px"
          px={{ base: 2, md: 3 }}
          py="12px"
          color={LIGHT}
          borderBottom="1px solid"
          borderColor="whiteAlpha.200"
          fontWeight="700"
        >
          <chakra.div>Avatar</chakra.div>
          <chakra.div>Name</chakra.div>
          <chakra.div>Email</chakra.div>
          <chakra.div>Role</chakra.div>
          <chakra.div textAlign="right">Actions</chakra.div>
        </chakra.div>

        {/* Table Body */}
        {loading ? (
          <chakra.div p="16px" color={LIGHT}>Loading users…</chakra.div>
        ) : pageSlice.length === 0 ? (
          <chakra.div p="16px" color={LIGHT}>No users found.</chakra.div>
        ) : (
          pageSlice.map((u) => {
            const editing = editRowId === u.id;
            return (
              <chakra.div
                key={u.id}
                display="grid"
                gridTemplateColumns="80px 1fr 1.2fr 160px 140px"
                gap="10px"
                px={{ base: 2, md: 3 }}
                py="14px"
                borderBottom="1px solid"
                borderColor="whiteAlpha.100"
                alignItems="center"
              >
                {/* Avatar */}
                <chakra.div>
                  <chakra.img
                    src={u.imageUrl || '/images/logo.png'}
                    alt={u.name || 'user'}
                    width="44px"
                    height="44px"
                    style={{
                      borderRadius: '9999px',
                      border: '2px solid rgba(255,255,255,0.35)',
                      objectFit: 'cover',
                    }}
                  />
                </chakra.div>

                {/* Name */}
                <chakra.div>
                  {editing ? (
                    <chakra.input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      bg="whiteAlpha.100"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                      rounded="md"
                      px="10px"
                      py="8px"
                      color="white"
                    />
                  ) : (
                    <chakra.div fontWeight="700">{u.name}</chakra.div>
                  )}
                </chakra.div>

                {/* Email */}
                <chakra.div>
                  {editing ? (
                    <chakra.input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                      bg="whiteAlpha.100"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                      rounded="md"
                      px="10px"
                      py="8px"
                      color="white"
                    />
                  ) : (
                    <chakra.div color={LIGHT}>{u.email}</chakra.div>
                  )}
                </chakra.div>

                {/* Role */}
                <chakra.div>
                  <chakra.span
                    px="10px"
                    py="6px"
                    rounded="full"
                    bg={LIGHT_FADE}
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    color={LIGHT}
                    fontSize="sm"
                  >
                    {u.role || 'regular'}
                  </chakra.span>
                </chakra.div>

                {/* Actions */}
                <chakra.div textAlign="right" display="flex" justifyContent="flex-end" gap="8px">
                  {editing ? (
                    <>
                      <chakra.button
                        type="button"
                        onClick={() => saveEdit(u.id)}
                        disabled={saving}
                        display="inline-flex"
                        alignItems="center"
                        gap="8px"
                        px="12px"
                        py="8px"
                        rounded="full"
                        bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
                        color="black"
                        fontWeight="800"
                        _hover={{ filter: 'brightness(0.95)' }}
                        title="Save"
                      >
                        <FaSave />
                        Save
                      </chakra.button>
                      <chakra.button
                        type="button"
                        onClick={cancelEdit}
                        display="inline-flex"
                        alignItems="center"
                        gap="8px"
                        px="12px"
                        py="8px"
                        rounded="full"
                        bg="whiteAlpha.200"
                        color="white"
                        _hover={{ bg: 'whiteAlpha.300' }}
                        title="Cancel"
                      >
                        <FaTimes />
                        Cancel
                      </chakra.button>
                    </>
                  ) : (
                    <chakra.button
                      type="button"
                      onClick={() => startEdit(u)}
                      display="inline-flex"
                      alignItems="center"
                      gap="8px"
                      px="12px"
                      py="8px"
                      rounded="full"
                      bg="whiteAlpha.200"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.300' }}
                      title="Edit"
                    >
                      <FaEdit />
                      Edit
                    </chakra.button>
                  )}
                </chakra.div>
              </chakra.div>
            );
          })
        )}

        {/* Pagination */}
        {!loading && view.length > 0 && (
          <chakra.div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            px={{ base: 2, md: 3 }}
            py="12px"
          >
            <chakra.div color={LIGHT} fontSize="sm">
              Showing {((pageSafe - 1) * PER_PAGE) + 1}–
              {Math.min(pageSafe * PER_PAGE, view.length)} of {view.length}
            </chakra.div>

            <chakra.div display="flex" gap="8px" alignItems="center">
              <chakra.button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                p="8px"
                rounded="full"
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                opacity={pageSafe <= 1 ? 0.6 : 1}
                title="Previous"
              >
                <FaChevronLeft />
              </chakra.button>

              <chakra.span px="10px" py="6px" rounded="md" bg={LIGHT_FADE} border="1px solid" borderColor="whiteAlpha.200">
                {pageSafe} / {totalPages}
              </chakra.span>

              <chakra.button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe >= totalPages}
                p="8px"
                rounded="full"
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                opacity={pageSafe >= totalPages ? 0.6 : 1}
                title="Next"
              >
                <FaChevronRight />
              </chakra.button>
            </chakra.div>
          </chakra.div>
        )}
      </chakra.div>
    </chakra.div>
  );
}
