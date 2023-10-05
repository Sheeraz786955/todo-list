import inquirer from 'inquirer';
import chalk from 'chalk';
import * as fs from 'fs';

interface TodoItem {
  text: string;
  completed: boolean;
}

const todoFilePath = 'todos.json';

function readTodos(): TodoItem[] {
  try {
    const data = fs.readFileSync(todoFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeTodos(todos: TodoItem[]): void {
  fs.writeFileSync(todoFilePath, JSON.stringify(todos, null, 2), 'utf-8');
}

async function main() {
  let todos: TodoItem[] = readTodos();

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: ['Add a todo', 'Mark todo as completed', 'List todos', 'Quit'],
      },
    ]);

    if (action === 'Quit') {
      break;
    }

    if (action === 'Add a todo') {
      const { todoText } = await inquirer.prompt([
        {
          type: 'input',
          name: 'todoText',
          message: 'Enter your todo:',
        },
      ]);
      todos.push({ text: todoText, completed: false });
      writeTodos(todos);
      console.log('Todo added.');
    }

    if (action === 'Mark todo as completed') {
      const { todoIndex } = await inquirer.prompt([
        {
          type: 'list',
          name: 'todoIndex',
          message: 'Select a todo to mark as completed:',
          choices: todos.map((todo, index) => ({
            name: `${index + 1}. ${todo.text}`,
            value: index,
          })),
        },
      ]);
      todos[todoIndex].completed = true;
      writeTodos(todos);
      console.log('Todo marked as completed.');
    }

    if (action === 'List todos') {
      todos.forEach((todo, index) => {
        console.log(`${index + 1}. [${todo.completed ? 'x' : ' '}] ${todo.text}`);
      });
    }
  }
}

main();


