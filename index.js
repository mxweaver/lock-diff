#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const semver = require('semver');
const commander = require('commander');

function diff (oldLock, newLock) {
  const changes = {};

  for (const [name, { version }] of Object.entries(oldLock.dependencies)) {
    changes[name] = [version, null];
  }

  for (const [name, { version }] of Object.entries(newLock.dependencies)) {
    if (changes[name]) {
      changes[name] = [changes[name][0], version];
    } else {
      changes[name] = [null, version];
    }
  }

  return changes;
}

function print (changes) {
  for (const [name, [oldVersion, newVersion]] of Object.entries(changes)) {
    if (!oldVersion) {

      console.log(`${name} ${chalk.red('removed')}`);

    } else if (!newVersion) {

      console.log(`${name} ${chalk.green('added')}`);
    
    } else if (!semver.eq(oldVersion, newVersion)) {

      const color = semver.gt(oldVersion, newVersion)
        ? chalk.red
        : chalk.green;

      console.log(`${name} ${color(`${oldVersion} -> ${newVersion}`)}`);
    
    }
  }
}

commander
  .version('0.1.0')
  .arguments('<oldPath> <newPath>')
  .action((oldPath, newPath) => {
    const oldLock = JSON.parse(fs.readFileSync(oldPath));
    const newLock = JSON.parse(fs.readFileSync(newPath));

    const changes = diff(oldLock, newLock);
    
    print(changes);
  })
  .parse(process.argv);