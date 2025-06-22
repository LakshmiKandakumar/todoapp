import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Heading, VStack, Alert, AlertIcon, Text, Link, useColorMode, Divider
} from '@chakra-ui/react';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function AuthPage({ onLogin, onFreeUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { colorMode } = useColorMode();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!form.email || !form.password || (!isLogin && !form.confirm)) {
      setError('All fields are required.');
      return;
    }
    if (!isLogin && form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email,
          password: form.password
        });
        localStorage.setItem('token', res.data.token);
        if (onLogin) onLogin(form.email); // Pass email here
      } else {
        await axios.post('http://localhost:5000/api/auth/signup', {
          email: form.email,
          password: form.password
        });
        setMessage('Signup successful! Please login.');
        setIsLogin(true);
        setForm({ email: '', password: '', confirm: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? 'Login failed.' : 'Signup failed.'));
    }
    setLoading(false);
  };

  // Set colors for dark and light mode
  const boxBg = colorMode === 'light' ? 'white' : 'gray.900';
  const textColor = colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900';
  const inputBg = colorMode === 'light' ? 'white' : 'gray.800';
  const inputColor = colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900';

  return (
    <MotionBox
      p={8}
      rounded="md"
      shadow="lg"
      bg={boxBg}
      w="100%"
      maxW="400px"
      mx="auto"
      mt={6}
      color={textColor}
      whileHover={{
        scale: 1.04,
        rotateY: 8,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <Heading mb={6} size="lg" textAlign="center" color="purple.500">
        {isLogin ? 'Login to Your Account' : 'Create a New Account'}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel color={textColor}>Email address</FormLabel>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              bg={inputBg}
              color={inputColor}
              _placeholder={{ color: colorMode === 'light' ? 'gray.400' : 'gray.300' }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel color={textColor}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              bg={inputBg}
              color={inputColor}
              _placeholder={{ color: colorMode === 'light' ? 'gray.400' : 'gray.300' }}
            />
          </FormControl>
          {!isLogin && (
            <FormControl id="confirm" isRequired>
              <FormLabel color={textColor}>Confirm Password</FormLabel>
              <Input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                bg={inputBg}
                color={inputColor}
                _placeholder={{ color: colorMode === 'light' ? 'gray.400' : 'gray.300' }}
              />
            </FormControl>
          )}
          {error && <Alert status="error"><AlertIcon />{error}</Alert>}
          {message && <Alert status="success"><AlertIcon />{message}</Alert>}
          <Button colorScheme="purple" type="submit" isLoading={loading} w="full">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center" color={textColor}>
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <Link color="purple.400" onClick={() => setIsLogin(false)}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link color="purple.400" onClick={() => setIsLogin(true)}>
              Login
            </Link>
          </>
        )}
      </Text>
      <Divider my={4} />
      <GoogleOAuthProvider clientId="989665809105-l18ishi96uqe8tb1939m0o5rm7aeff27.apps.googleusercontent.com">
        <GoogleLogin
          width="100%"
          onSuccess={credentialResponse => {
            axios.post('http://localhost:5000/api/auth/google', {
              token: credentialResponse.credential
            })
            .then(res => {
              localStorage.setItem('token', res.data.token);
              // Extract email from Google ID token payload
              const base64Url = credentialResponse.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const payload = JSON.parse(window.atob(base64));
              if (onLogin) onLogin(payload.email);
            })
            .catch(() => setError('Google sign-in failed'));
          }}
          onError={() => setError('Google sign-in failed')}
        />
      </GoogleOAuthProvider>
      <Button
        colorScheme="gray"
        variant="outline"
        mt={4}
        w="full"
        fontWeight="bold"
        fontSize="lg"
        onClick={onFreeUser}
        _hover={{ bg: 'gray.200', color: 'purple.500' }}
      >
        Continue as Free User
      </Button>
    </MotionBox>
  );
}

export default AuthPage;