const core = require('@actions/core')
const exec = require("@actions/exec");
const path = require('path')

const installSh = path.resolve(__dirname, '../../main/sh/install.sh')
const setup = async (version) => {
  const args = [installSh]
  if (version) args.push(version)

  const res = await exec.getExecOutput('bash', args, { ignoreReturnCode: true})

  console.log('stderr=', res.stderr, 'stdout=', res.stdout)
  return /.*BUN_INSTALL="([^"]+)"/.exec(res.stderr.trim())[1]
}

async function main() {
  try {
    const version = core.getInput('version')
    const BUN_INSTALL = await setup(version)

    core.addPath(path.join(BUN_INSTALL, 'bin'))
  } catch (e) {
    core.setOutput("error_message", e.message)
    core.setFailed(e.message)
  }
}

main()
