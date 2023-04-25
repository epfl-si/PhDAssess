#!/usr/bin/env -S npm exec --yes --package=zx@latest zx --
import deployProcess from './scripts/deployProcess.mjs'

$.verbose = false

if (!argv._[0]) {
  argv._ = ['run'];
}

if (argv.help || argv._[0] === 'help') {
  argv._[0] === 'help' ? await help(...argv._slice(1)) : await help(...argv._)
} else if (argv._[0] === 'run') {
  await run(...argv._.slice(1));
} else if (argv._[0] === 'clean') {
  await clean(...argv._.slice(1));
} else if (argv._[0] === 'deploy-bpmn') {
  await deployProcess();
} else if (argv._[0] === 'read-snapshot') {
  await readSnapshot(...argv._.slice(1));
} else {
  await help(...argv._);
}

async function help(args) {
  await echo`${chalk.yellow('Helping soon ?')}`;
}

async function run(args) {
  await echo`${__filename}`
}

async function clean(args) {
}

async function readSnapshot(args) {
  if (await question('Do you want to start the docker build of the zeebe_tools first ? [y/N] ') === 'y') {
    const dockerBuild = await $`docker build -t zeebe-tools docker/zeebe-tools`
    //console.log(dockerBuild)
    for await (const chunk of dockerBuild.stderr) {
      echo(chalk.yellow(dockerBuild))
    }
  }

  const snapshotPath = await question('Path to snapshot ? (should have the CURRENT file inside) ')
  const outputFilePath = await question('Full path of the destination file: ')

  if (!snapshotPath || !outputFilePath) {
    console.log('Aborting, no all paths were given for the output file')
  } else {
    await spinner(
      'decompressing the snapshot...', () =>
      $`docker run -v $PWD/scripts:/scripts -v $PWD/docker/zeebe-tools/perllib:/docker/zeebe-tools/perllib -v ${snapshotPath}:/snapshot zeebe-tools perl /scripts/read-snapshot.pl /snapshot > ${outputFilePath}`
    )
    console.log('Done.')
  }
}
