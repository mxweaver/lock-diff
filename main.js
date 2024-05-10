#!/usr/bin/env node

import commander from 'commander';
import { readFileSync } from 'fs';

import { diff, print } from './lib.js';

commander
	.version('0.5.0')
  .arguments('<oldPath> <newPath>')
  .option('-f, --format <format>', 'changes the output format', 'text')
  .option('-p, --pretty', 'improves readability of certain output formats', false)
  .option('-c, --color', 'colorizes certain output formats', false)
  .action((oldPath, newPath) => {
    const oldLock = JSON.parse(readFileSync(oldPath));
    const newLock = JSON.parse(readFileSync(newPath));

    const changes = diff(oldLock, newLock);

    print(changes, {
      format: commander.format,
      pretty: commander.pretty,
      color: commander.color,
    });

    if (Object.keys(changes).length > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  })
  .parse(process.argv);
