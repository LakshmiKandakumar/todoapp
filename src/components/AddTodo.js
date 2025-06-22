import React, { useState } from 'react';
import { HStack, Input, Button, useColorMode, FormControl, FormLabel } from '@chakra-ui/react';

function AddTodo({ addTodo }) {
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState('');
  const { colorMode } = useColorMode();

  const handleSubmit = e => {
    e.preventDefault();
    if (!content) return;
    addTodo({
      id: Date.now(),
      content,
      deadline,
      completed: false
    });
    setContent('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <HStack spacing={4} w="100%">
        <FormControl>
          <FormLabel color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'} mb={1}>Todo</FormLabel>
          <Input
            variant="filled"
            placeholder="Add a new todo"
            value={content}
            onChange={e => setContent(e.target.value)}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'}
          />
        </FormControl>
        <FormControl>
          <FormLabel color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'} mb={1}>Deadline</FormLabel>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'}
          />
        </FormControl>
        <Button colorScheme="purple" type="submit" px={6}>
          Add
        </Button>
      </HStack>
    </form>
  );
}

export default AddTodo;