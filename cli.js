#!/usr/bin/env node
const path = require('path')
const sao = require('sao')
const cac = require('cac')
const chalk = require('chalk')
const envinfo = require('envinfo')
const { version } = require('./package.json')

const generator = path.resolve(__dirname, './')

const cli = cac('create-nuxt-app')

const showEnvInfo = async () => {
  console.log(chalk.bold('\nEnvironment Info:'))
  const result = await envinfo
    .run({
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmGlobalPackages: ['nuxt', 'create-nuxt-app']
    })
  console.log(result)
  process.exit(1)
}

cli
  .command('[out-dir]', 'Generate in a custom directory or current directory')
  .option('-e, --edge', 'To install `nuxt-edge` instead of `nuxt`')
  .option('-i, --info', 'Print out debugging information relating to the local environment')
  .option('-y, --yes', 'Use default options')
  .option('--verbose', 'Show debug logs')
  .action((outDir = '.', cliOptions) => {
    if (cliOptions.info) {
      return showEnvInfo()
    }
    console.log()
    console.log(chalk`{cyan create-nuxt-app v${version}}`)
    console.log(chalk`✨  Generating Nuxt.js project in {cyan ${outDir}}`)

    const { verbose, yes } = cliOptions
    const logLevel = verbose ? 4 : 2
    // See https://saojs.org/api.html#standalone-cli
    sao({ generator, outDir, logLevel, cliOptions, yes })
      .run()
      .catch((err) => {
        console.trace(err)
        process.exit(1)
      })
  })

cli.help()

cli.version(version)

cli.parse()
