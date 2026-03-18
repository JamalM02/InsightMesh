#!/usr/bin/env node

/**
 * Start only PM2 processes that aren't already running.
 * Usage: node scripts/pm2-start-missing.js
 *
 * This reads ecosystem.config.js, checks which apps are already
 * online in PM2, and only starts the ones that are stopped or missing.
 */

const { execSync } = require('child_process');
const path = require('path');

const ecosystemPath = path.join(__dirname, '..', 'ecosystem.config.js');
const ecosystem = require(ecosystemPath);

function getRunningProcesses() {
  try {
    const output = execSync('pm2 jlist', { encoding: 'utf-8' });
    const processes = JSON.parse(output);
    const running = new Map();
    for (const proc of processes) {
      running.set(proc.name, proc.pm2_env.status);
    }
    return running;
  } catch {
    // PM2 daemon not running or no processes
    return new Map();
  }
}

function main() {
  const running = getRunningProcesses();
  const apps = ecosystem.apps || [];
  const toStart = [];
  const alreadyRunning = [];

  for (const app of apps) {
    const status = running.get(app.name);
    if (status === 'online') {
      alreadyRunning.push(app.name);
    } else {
      toStart.push(app.name);
    }
  }

  if (alreadyRunning.length > 0) {
    console.log(`✓ Already running: ${alreadyRunning.join(', ')}`);
  }

  if (toStart.length === 0) {
    console.log('✓ All processes are already running. Nothing to start.');
    return;
  }

  console.log(`→ Starting: ${toStart.join(', ')}`);

  for (const name of toStart) {
    try {
      const status = running.get(name);
      if (status && status !== 'online') {
        // Process exists but is stopped/errored — restart it
        console.log(`  Restarting ${name} (was ${status})...`);
        execSync(`pm2 restart ${name}`, { stdio: 'inherit' });
      } else {
        // Process doesn't exist — start it from ecosystem
        console.log(`  Starting ${name}...`);
        execSync(`pm2 start "${ecosystemPath}" --only ${name}`, {
          stdio: 'inherit',
        });
      }
    } catch (err) {
      console.error(`  ✗ Failed to start ${name}: ${err.message}`);
    }
  }

  console.log('\n✓ Done. Current status:');
  execSync('pm2 status', { stdio: 'inherit' });
}

main();
