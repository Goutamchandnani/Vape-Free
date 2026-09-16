#!/usr/bin/env node
/**
 * Starts Firebase emulators and Expo Metro together for local development.
 * Waits for Auth emulator (9099) before launching Expo with LAN + cleared cache.
 */
const { spawn } = require('node:child_process');
const waitOn = require('wait-on');

const isWindows = process.platform === 'win32';

function spawnNpm(script, name) {
  const child = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', script], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.error(`[dev] ${name} stopped (${signal})`);
    } else if (code && code !== 0) {
      console.error(`[dev] ${name} exited with code ${code}`);
    }
  });

  return child;
}

function spawnExpo() {
  const child = spawn(
    isWindows ? 'npx.cmd' : 'npx',
    ['expo', 'start', '--lan', '--clear'],
    { stdio: 'inherit', env: process.env },
  );

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  return child;
}

console.log('[dev] Starting Firebase emulators...');
const emulators = spawnNpm('emulators', 'emulators');

let emulatorsReady = false;
let expoProcess = null;

function startExpoOnce() {
  if (expoProcess) {
    return;
  }

  console.log('[dev] Starting Expo (LAN, cleared cache)...');
  expoProcess = spawnExpo();
}

emulators.on('exit', (code) => {
  if (code === 0 || code === null) {
    return;
  }

  if (emulatorsReady) {
    console.error('[dev] Firebase emulators stopped while Expo was running.');
    shutdown(code);
    return;
  }

  console.warn(
    '[dev] Firebase emulators did not start (exit code %s).',
    code,
  );
  console.warn(
    '[dev] Install a Java runtime for emulators (e.g. brew install --cask temurin), or run: npm start',
  );
  console.warn('[dev] Starting Expo anyway — backend calls fail until emulators or production Firebase are available.');
  startExpoOnce();
});

function shutdown(exitCode = 0) {
  if (!emulators.killed) {
    emulators.kill('SIGINT');
  }
  if (expoProcess && !expoProcess.killed) {
    expoProcess.kill('SIGINT');
  }
  setTimeout(() => process.exit(exitCode), 250);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

waitOn({
  resources: ['tcp:127.0.0.1:9099', 'tcp:127.0.0.1:8080', 'tcp:127.0.0.1:5001'],
  timeout: 120000,
  interval: 1000,
  delay: 2000,
  window: 1000,
})
  .then(() => {
    emulatorsReady = true;
    console.log('[dev] Emulators ready.');
    startExpoOnce();
  })
  .catch((error) => {
    console.error('[dev] Timed out waiting for Firebase emulators on ports 9099/8080/5001.');
    console.error(error instanceof Error ? error.message : error);
    console.warn('[dev] Start emulators manually with: npm run emulators');
    console.warn('[dev] Starting Expo anyway.');
    startExpoOnce();
  });
