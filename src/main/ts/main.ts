import * as core from '@actions/core'
import path from 'path'
import { install, pickVersion, getPlatform, getArch } from './install.js'
import { restoreCache } from './cache.js'
import { keys, DEFAULT_REPO, DEFAULT_VERSION } from './constants.js'
import { getConfig } from './config.js'
import { getInput } from './util.js'

async function main() {
  // prettier-ignore
  try {
    const range =     getInput('bun-version') || getInput('version') || DEFAULT_VERSION
    const repo =      getInput('bun-repo') || DEFAULT_REPO
    const platform =  getInput('platform') || getPlatform()
    const arch =      getInput('arch') || getArch()
    const cache =     getInput('cache')
    const cacheBin =  getInput('cache-bin')
    const token =     getInput('token')
    const config =    getConfig(getInput('bun-config') || getInput('config'))

    const version =         await pickVersion(repo, range)
    const bunInstallPath =  await install(repo, version, platform, arch, token, cacheBin)
    const bunCachePath =    path.resolve(config?.install?.cache?.dir || path.join(bunInstallPath, 'install/cache'))

    core.saveState(keys.INSTALL_PATH, bunInstallPath)
    core.saveState(keys.CACHE_PATH, bunCachePath)

    cache && (await restoreCache(bunCachePath, platform, arch))

    core.setOutput('bun-version', version)
    core.info(`Bun ${version}-${platform}-${arch} is installed from ${repo}`)
  } catch (e: any) {
    core.setOutput('error', e.message)
    core.setFailed(e.message)
  }
}

await main()
