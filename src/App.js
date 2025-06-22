import React, { useState, useEffect, useRef } from 'react';
import {
  VStack,
  IconButton,
  Box,
  Heading,
  useColorMode,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaCog } from "react-icons/fa";
import Particles from "react-tsparticles";
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import emailjs from 'emailjs-com';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [todos, setTodos] = useState(() => {
    const email = localStorage.getItem('userEmail');
    return email ? JSON.parse(localStorage.getItem(`todos_${email}`)) || [] : [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isFreeUser, setIsFreeUser] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // For email notification: avoid duplicate emails
  const notifiedRef = useRef({});

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`todos_${userEmail}`, JSON.stringify(todos));
    }
  }, [todos, userEmail]);

  // EmailJS: Send deadline notification email
  function sendDeadlineEmail(todo) {
    emailjs.send(
      'service_40o8pyf',      // Replace with your EmailJS service ID
      'template_8dxerkb',     // Replace with your EmailJS template ID
      {
        to_email: userEmail,
        todo_content: todo.content,
        todo_deadline: todo.deadline
      },
      'XZQbiTMFXqilrmhLH'       // Replace with your EmailJS public key
    ).then(
      (response) => {
        console.log('Email sent!', response.status, response.text);
      },
      (err) => {
        console.error('Failed to send email:', err);
      }
    );
  }

  // Check for todos with deadlines within 1 hour and send email
  useEffect(() => {
    const now = new Date();
    todos.forEach(todo => {
      if (
        todo.deadline &&
        !todo.completed &&
        !notifiedRef.current[todo.id] &&
        new Date(todo.deadline) - now < 3600000 && // less than 1 hour left
        new Date(todo.deadline) - now > 0
      ) {
        sendDeadlineEmail(todo);
        notifiedRef.current[todo.id] = true; // Mark as notified
      }
    });
  }, [todos]); // eslint-disable-line

  function deleteTodo(id) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  function addTodo(todo) {
    setTodos([...todos, todo]);
  }

  function toggleTodo(id) {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    setTodos(JSON.parse(localStorage.getItem(`todos_${email}`)) || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsFreeUser(false);
    setUserEmail('');
    setTodos([]);
    setShowProfile(false);
  };

  const handleFreeUser = () => setIsFreeUser(true);

  const textColor = colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900';

  return (
    <div
      className="animated-bg"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        background: "linear-gradient(to right, #a1c4fd, #c2e9fb)" // Gradient Sky Blue to Purple
      }}
    >
      <Particles
        options={{
          background: { color: "#fbc2eb" },
          fpsLimit: 60,
          particles: {
            color: { value: "#a18cd1" },
            links: { enable: true, color: "#fff", distance: 150 },
            move: { enable: true, speed: 2 },
            number: { value: 50 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: 3 }
          }
        }}
        style={{
          position: "absolute",
          zIndex: 0,
          width: "100vw",
          height: "100vh"
        }}
      />
      <Flex
        minH="100vh"
        w="100vw"
        align="center"
        justify="center"
        color={textColor}
        transition="background 0.5s"
        style={{ position: "relative", zIndex: 1 }}
        px={{ base: 2, md: 0 }}
      >
        <VStack
          p={{ base: 2, sm: 4, md: 8 }}
          spacing={6}
          w="100%"
          maxW={{ base: "98vw", sm: "90vw", md: "500px" }}
          borderRadius="2xl"
          boxShadow="2xl"
          bg={colorMode === 'light' ? 'whiteAlpha.900' : 'gray.800'}
          mt={0}
        >
          {/* Settings Icon with Profile and Theme inside */}
          {isLoggedIn && !showProfile && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaCog />}
                variant="ghost"
                alignSelf="flex-end"
                size="lg"
                aria-label="Settings"
                mb={2}
              />
              <MenuList>
                <MenuItem
                  icon={
                    <Avatar
                      name={userEmail}
                      size="xs"
                      bg="purple.400"
                      color="white"
                      src=""
                      mr={2}
                    />
                  }
                  onClick={() => setShowProfile(true)}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                  onClick={toggleColorMode}
                >
                  Theme: {colorMode === 'light' ? 'Dark' : 'Light'}
                </MenuItem>
                <MenuDivider />
                <MenuItem isDisabled>{userEmail}</MenuItem>
                <MenuItem onClick={handleLogout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          {showProfile ? (
            <ProfilePage
              userEmail={userEmail}
              onClose={() => setShowProfile(false)}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <Box w="100%" textAlign="center">
                <Heading
                  mb={8}
                  fontWeight="extrabold"
                  size={{ base: "lg", sm: "xl", md: "2xl" }}
                  bgGradient={colorMode === 'light'
                    ? "linear(to-r, cyan.400, purple.400, pink.400)"
                    : "linear(to-r, cyan.200, purple.200, pink.200)"}
                  bgClip="text"
                  letterSpacing="tight"
                  color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'}
                >
                  Todo Application
                </Heading>
              </Box>
              {!isLoggedIn && !isFreeUser ? (
                <AuthPage onLogin={handleLogin} onFreeUser={handleFreeUser} />
              ) : (
                <>
                  <TodoList todos={todos} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />
                  <AddTodo addTodo={addTodo} />
                </>
              )}
            </>
          )}
        </VStack>
      </Flex>
    </div>
  );
}

export default App;