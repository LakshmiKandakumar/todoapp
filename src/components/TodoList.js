import React, { useEffect } from 'react';
import { VStack, HStack, Text, IconButton, Box, useColorMode, Checkbox, Divider, Heading, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

function TodoList({ todos, deleteTodo, toggleTodo }) {
  const { colorMode } = useColorMode();
  const toast = useToast();

  // In-app notification for todos with deadlines within 1 hour
  useEffect(() => {
    const now = new Date();
    todos.forEach(todo => {
      if (
        todo.deadline &&
        !todo.completed &&
        !todo.notified && // prevent duplicate notifications (optional, see note below)
        new Date(todo.deadline) - now < 3600000 && // less than 1 hour left
        new Date(todo.deadline) - now > 0
      ) {
        toast({
          title: 'Deadline Approaching!',
          description: `Todo "${todo.content}" is due soon.`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        // Optionally, you can set a "notified" flag in your todo state to avoid repeated notifications
        // This requires managing the notified state in your parent component or localStorage
      }
    });
  }, [todos, toast]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const renderTodo = todo => (
    <HStack
      key={todo.id}
      w="100%"
      justify="space-between"
      p={4}
      borderRadius="md"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
      boxShadow="sm"
    >
      <Box>
        <Checkbox
          isChecked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          colorScheme="purple"
          mr={2}
        />
        <Text
          as={todo.completed ? 's' : undefined}
          fontWeight="bold"
          color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'}
          display="inline"
        >
          {todo.content}
        </Text>
        {todo.deadline && !isNaN(new Date(todo.deadline)) && (
          <Text fontSize="sm" color={colorMode === 'light' ? 'gray.500' : 'gray.300'}>
            Deadline: {new Date(todo.deadline).toLocaleString()}
          </Text>
        )}
      </Box>
      <IconButton
        icon={<DeleteIcon />}
        colorScheme="red"
        variant="ghost"
        onClick={() => deleteTodo(todo.id)}
        aria-label="Delete todo"
      />
    </HStack>
  );

  return (
    <VStack spacing={4} w="100%">
      <Heading size="md" alignSelf="flex-start" color="purple.500">Works need to be done</Heading>
      {activeTodos.length > 0 ? activeTodos.map(renderTodo) : <Text color="gray.400">No active todos</Text>}
      <Divider />
      <Heading size="md" alignSelf="flex-start" color="green.500" mt={2}>Works already completed</Heading>
      {completedTodos.length > 0 ? completedTodos.map(renderTodo) : <Text color="gray.400">No completed todos</Text>}
    </VStack>
  );
}

export default TodoList;