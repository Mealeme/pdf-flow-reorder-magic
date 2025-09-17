import { spawn } from 'child_process';

// Start the backend server
const backend = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

// Start the frontend dev server
const frontend = spawn('vite', [], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Stopping servers...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// Log when processes exit
backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});