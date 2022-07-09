const core = require('@actions/core')
const {setup} = require('./index.js')

function main() {
  try {
    const version = core.getInput('version')
    setup(version)

  } catch (e) {
    core.setOutput("error_message", error.message)
    core.setFailed(e.message)
  }
}

main()
