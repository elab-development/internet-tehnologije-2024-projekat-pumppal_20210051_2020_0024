// src/pages/MyChats.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { chakra, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
const bearer = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
});

/* Shared styles for markdown inside a bubble */
const mdStyles = {
  p: { margin: '0.4rem 0', lineHeight: 1.7 },
  strong: { fontWeight: 800, color: 'white' },
  em: { fontStyle: 'italic' },
  'h1,h2,h3,h4': {
    fontWeight: 800, color: 'white', marginTop: '0.75rem', marginBottom: '0.4rem',
  },
  ul: { paddingLeft: '1.2rem', listStyleType: 'disc', margin: '0.4rem 0' },
  ol: { paddingLeft: '1.2rem', listStyleType: 'decimal', margin: '0.4rem 0' },
  li: { margin: '0.2rem 0' },
  code: { background: 'rgba(255,255,255,0.12)', padding: '0.1rem 0.3rem', borderRadius: '4px' },
  pre: { background: 'rgba(255,255,255,0.12)', padding: '0.75rem', borderRadius: '10px', overflowX: 'auto' },
};

export default function MyChats() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [token, setToken] = useState(() => readToken());
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(false);
  const [sending, setSending] = useState(false);

  const userName = useMemo(() => sessionStorage.getItem('userName') || 'User', []);
  const userImage = useMemo(() => sessionStorage.getItem('userImage') || '', []);

  /* Auth guard + load chats */
  useEffect(() => {
    const t = readToken();
    if (!t) {
      navigate('/');
      return;
    }
    setToken(t);
    loadChats(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadChats = async (t) => {
    try {
      setLoadingChats(true);
      const res = await axios.get(`${API_BASE}/chats`, { headers: bearer(t) });
      const list = res?.data?.data || [];
      setChats(list);
      setActiveChat((prev) => prev || list[0] || null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingChats(false);
    }
  };

  /* Load messages for active chat */
  useEffect(() => {
    if (!token || !activeChat?.id) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/chats/${activeChat.id}/messages`,
          { headers: bearer(token) }
        );
        setMessages(res?.data?.data || []);
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [activeChat, token]);

  /* Auto-scroll to bottom on messages change */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /* Actions */
  const handleNewChat = async () => {
    const t = readToken();
    if (!t) return navigate('/');
    const title = window.prompt('Enter a title for your new chat:');
    if (!title || !title.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/chats`,
        { title: title.trim() },
        { headers: bearer(t) }
      );
      const created = res?.data?.data;
      if (created) {
        setChats((prev) => [...prev, created]);
        setActiveChat(created);
      }
    } catch (e) {
      console.error('Create chat error', e);
    }
  };

  const handleEditChat = async (chat) => {
    const t = readToken();
    if (!t) return navigate('/');
    const newTitle = window.prompt('Edit chat title:', chat.title);
    if (!newTitle || newTitle.trim() === '' || newTitle === chat.title) return;
    try {
      const res = await axios.put(
        `${API_BASE}/chats/${chat.id}`,
        { title: newTitle.trim() },
        { headers: bearer(t) }
      );
      const updated = res?.data?.data;
      if (updated) {
        setChats((prev) => prev.map((c) => (c.id === chat.id ? updated : c)));
        setActiveChat((prev) => (prev?.id === chat.id ? updated : prev));
      }
    } catch (e) {
      console.error('Edit chat error', e);
    }
  };

  const handleDeleteChat = async (chatId) => {
    const t = readToken();
    if (!t) return navigate('/');
    if (!window.confirm('Delete this chat?')) return;
    try {
      await axios.delete(`${API_BASE}/chats/${chatId}`, { headers: bearer(t) });
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      setActiveChat((prev) => {
        if (!prev || prev.id !== chatId) return prev;
        const remaining = chats.filter((c) => c.id !== chatId);
        return remaining.length ? remaining[0] : null;
      });
    } catch (e) {
      console.error('Delete chat error', e);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat?.id || !token || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    // Optimistic user bubble (tagged so we can replace/remove it later).
    setMessages((prev) => [...prev, { role: 'user', content, _optimistic: true }]);

    try {
      const res = await axios.post(
        `${API_BASE}/chats/${activeChat.id}/messages`,
        { content },
        { headers: bearer(token) }
      );

      const data = res?.data?.data;

      // Case A: backend returns the WHOLE conversation array -> replace (no duplicates).
      if (Array.isArray(data)) {
        setMessages(data);
      }
      // Case B: backend returns a pair { content, response: { content } }
      else if (data && data.response && typeof data.response.content === 'string') {
        setMessages((prev) => {
          const arr = [...prev];
          // remove the last optimistic user we just added
          for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i]?._optimistic) {
              arr.splice(i, 1);
              break;
            }
          }
          // push the normalized pair (user + assistant)
          arr.push({ role: 'user', content }, { role: 'assistant', content: data.response.content });
          return arr;
        });
      }
      // Case C: backend returns a single assistant message -> append after optimistic user.
      else if (data) {
        setMessages((prev) => {
          const arr = [...prev];
          // ensure last is still our optimistic user, then append assistant
          arr.push(data);
          return arr;
        });
      }
    } catch (e) {
      console.error('Send message error', e);
      // Rollback: remove optimistic user and restore input text
      setMessages((prev) => {
        const arr = [...prev];
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i]?._optimistic) {
            arr.splice(i, 1);
            break;
          }
        }
        return arr;
      });
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  /* Render helpers */
  const renderMessage = (msg, idx) => {
    if (msg?.response && typeof msg.response?.content === 'string') {
      return (
        <chakra.div key={`pair-${idx}`} mb="12px">
          <MsgRow side="user" text={msg.content} userImage={userImage} />
          <MsgRow side="bot" text={msg.response.content} />
        </chakra.div>
      );
    }
    const side = msg.role === 'user' ? 'user' : 'bot';
    return <MsgRow key={`m-${idx}`} side={side} text={msg.content} userImage={userImage} />;
  };

  return (
    <chakra.div bg={NAVY_DEEP} minH="100vh" display="flex" color="white">
      {/* Sidebar */}
      <chakra.aside
        w={{ base: '280px', md: '320px' }}
        borderRight="1px solid"
        borderColor="whiteAlpha.150"
        p="12px"
        display="flex"
        flexDir="column"
        gap="10px"
      >
        <chakra.div
          p="10px"
          rounded="xl"
          bg={PANEL}
          border="1px solid"
          borderColor="whiteAlpha.200"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <chakra.div fontWeight="800" fontSize="lg">Chats</chakra.div>
          <chakra.button
            type="button"
            onClick={handleNewChat}
            rounded="full"
            w="34px"
            h="34px"
            display="grid"
            placeItems="center"
            bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
            color="black"
            _hover={{ filter: 'brightness(0.95)' }}
            title="New chat"
          >
            <FaPlus />
          </chakra.button>
        </chakra.div>

        <chakra.div
          flex="1"
          overflow="auto"
          rounded="xl"
          border="1px solid"
          borderColor="whiteAlpha.150"
        >
          {loadingChats ? (
            <chakra.div p="12px" color={LIGHT}>Loading…</chakra.div>
          ) : chats.length === 0 ? (
            <chakra.div p="12px" color={LIGHT}>No chats yet. Create one!</chakra.div>
          ) : (
            chats.map((c) => {
              const active = activeChat?.id === c.id;
              return (
                <chakra.div
                  key={c.id}
                  px="12px"
                  py="10px"
                  borderBottom="1px solid"
                  borderColor="whiteAlpha.100"
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  gap="8px"
                  bg={active ? 'whiteAlpha.100' : 'transparent'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => setActiveChat(c)}
                >
                  <chakra.div flex="1" noOfLines={1} fontWeight={active ? '800' : '600'}>
                    {c.title}
                  </chakra.div>

                  <chakra.button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleEditChat(c); }}
                    p="4px"
                    rounded="md"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    title="Rename"
                  >
                    <FaEdit size={14} />
                  </chakra.button>
                  <chakra.button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteChat(c.id); }}
                    p="4px"
                    rounded="md"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    title="Delete"
                  >
                    <FaTrash size={14} />
                  </chakra.button>
                </chakra.div>
              );
            })
          )}
        </chakra.div>
      </chakra.aside>

      {/* Main chat area */}
      <chakra.main flex="1" display="flex" flexDir="column">
        {/* Header */}
        <chakra.header
          px={{ base: 4, md: 6 }}
          py="14px"
          borderBottom="1px solid"
          borderColor="whiteAlpha.150"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <chakra.div fontWeight="800" fontSize={{ base: 'xl', md: '2xl' }}>
            {activeChat ? activeChat.title : 'No Chat Selected'}
          </chakra.div>
        </chakra.header>

        {/* Messages */}
        <chakra.div
          flex="1"
          overflow="auto"
          px={{ base: 4, md: 6 }}
          py="16px"
          display="flex"
          flexDir="column"
          gap="18px"
        >
          {!activeChat ? (
            <chakra.div color={LIGHT} pt="20px">
              Select a chat on the left or create a new one.
            </chakra.div>
          ) : (
            <>
              {messages.map((m, i) => renderMessage(m, i))}
              <div ref={messagesEndRef} />
            </>
          )}
        </chakra.div>

        {/* Input bar */}
        <chakra.div
          p={{ base: 3, md: 4 }}
          borderTop="1px solid"
          borderColor="whiteAlpha.150"
          display="flex"
          alignItems="center"
          gap="10px"
        >
          <chakra.div
            flex="1"
            bg={PANEL}
            border="1px solid"
            borderColor="whiteAlpha.300"
            rounded="xl"
            px="16px"
            py="12px"
            opacity={sending ? 0.7 : 1}
          >
            <chakra.input
              type="text"
              placeholder={sending ? 'Waiting for response…' : 'TYPE MESSAGE HERE…'}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (!sending && e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              width="100%"
              bg="transparent"
              color="white"
              _placeholder={{ color: 'whiteAlpha.600' }}
              border="none"
              outline="none"
              disabled={sending}   // lock typing during generation
            />
          </chakra.div>

          <chakra.button
            type="button"
            onClick={handleSendMessage}
            disabled={sending || !activeChat || !newMessage.trim()}
            w="48px"
            h="48px"
            rounded="full"
            display="grid"
            placeItems="center"
            bg={`linear-gradient(90deg, ${YELLOW}, ${YELLOW_2})`}
            color="black"
            _hover={{ filter: sending ? 'none' : 'brightness(0.95)' }}
            opacity={sending ? 0.7 : 1}
            title={sending ? 'Waiting for response…' : 'Send'}
          >
            {sending ? <Spinner thickness="3px" speed="0.7s" size="sm" /> : <FaPaperPlane />}
          </chakra.button>
        </chakra.div>
      </chakra.main>
    </chakra.div>
  );
}

/* ---------- Message row (user / bot) ---------- */

function MsgRow({ side, text, userImage }) {
  const isUser = side === 'user';
  const avatarSrc = isUser
    ? (userImage || '/images/logo.png')
    : '/images/logo.png';

  return (
    <chakra.div
      display="grid"
      gridTemplateColumns="44px 1fr 44px"
      alignItems="start"
      gap="12px"
      mb="6px"
    >
      {isUser ? <AvatarImg src={avatarSrc} alt="You" /> : <chakra.div />}

      <chakra.div
        justifySelf={isUser ? 'start' : 'end'}
        maxW={{ base: '100%', md: '80%' }}
        bg="whiteAlpha.100"
        border="1px solid"
        borderColor="whiteAlpha.300"
        rounded="xl"
        px="16px"
        py="14px"
      >
        <chakra.div sx={mdStyles}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text || ''}
          </ReactMarkdown>
        </chakra.div>
      </chakra.div>

      {isUser ? <chakra.div /> : <AvatarImg src={avatarSrc} alt="PumpPal" />}
    </chakra.div>
  );
}

function AvatarImg({ src, alt }) {
  return (
    <chakra.img
      src={src}
      alt={alt}
      width="44px"
      height="44px"
      style={{
        borderRadius: '9999px',
        objectFit: 'cover',
        border: '1px solid rgba(255,255,255,0.35)',
        background: 'rgba(0,0,0,0.2)',
      }}
    />
  );
}
