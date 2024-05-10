import chalk from 'chalk';
const { green, red, bold } = chalk;
import { eq, gt, valid, lt } from 'semver';
import { table } from 'table';


export function diff(oldLock, newLock) {
  const changes = {};

  Object.entries(oldLock.dependencies).forEach(([name, { version }]) => {
    changes[name] = [version, null];
  });

  Object.entries(newLock.dependencies).forEach(([name, { version }]) => {
    if (changes[name]) {
      if (eq(changes[name][0], version)) {
        delete changes[name];
      } else {
        changes[name] = [changes[name][0], version];
      }
    } else {
      changes[name] = [null, version];
    }
  });

  return changes;
}

export function printJSON(changes, options) {
  if (options.pretty) {
    console.log(JSON.stringify(changes, null, 2));
  } else {
    console.log(JSON.stringify(changes));
  }
}

export function printText(changes, options) {
  Object.entries(changes).forEach(([name, [oldVersion, newVersion]]) => {
    if (!oldVersion) {
      if (options.color) {
        console.log(`${name} ${green('added')}`);
      } else {
        console.log(`${name} added`);
      }
    } else if (!newVersion) {
      if (options.color) {
        console.log(`${name} ${red('removed')}`);
      } else {
        console.log(`${name} removed`);
      }
    } else if (!eq(oldVersion, newVersion)) {
      if (options.color) {
        const color = gt(oldVersion, newVersion)
          ? red
          : green;
        console.log(`${name} ${color(`${oldVersion} -> ${newVersion}`)}`);
      } else {
        console.log(`${name} ${oldVersion} -> ${newVersion}`);
      }
    }
  });
}

export function printTable(changes, options) {
  let data = Object.entries(changes)
    .map(([name, [oldVersion, newVersion]]) => ([
      name,
      oldVersion,
      newVersion,
    ]));

  if (options.color) {
    data = data.map(([name, oldVersion, newVersion]) => {
      if (valid(oldVersion) && valid(newVersion)) {
        if (lt(oldVersion, newVersion)) {
          oldVersion = red(oldVersion);
          newVersion = green(newVersion);
        } else if (gt(oldVersion, newVersion)) {
          oldVersion = green(oldVersion);
          newVersion = red(newVersion);
        }
      }

      return [name, oldVersion, newVersion];
    });
  }

  data.unshift(['package', 'old version', 'new version']);

  if (options.color) {
    data[0] = data[0].map((heading) => bold(heading));
  }

  console.log(table(data));
}

export function print(changes, options) {
  switch (options.format) {
    case 'json':
      printJSON(changes, options);
      break;
    case 'table':
      printTable(changes, options);
      break;
    case 'text':
    default:
      printText(changes, options);
      break;
  }
}