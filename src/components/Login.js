import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Heading, VStack, Alert, AlertIcon
} from '@chakra-ui/react';
import axios from 'axios';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);
      if (onLogin) onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
    setLoading(false);
  };

  return (
    <Box p={6} rounded="md" shadow="md" bg="white" w="100%" maxW="400px" mx="auto" mb={6}>
      <Heading mb={4} size="lg" textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
          </FormControl>
          {error && <Alert status="error"><AlertIcon />{error}</Alert>}
          <Button colorScheme="purple" type="submit" isLoading={loading} w="full">Login</Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Login;