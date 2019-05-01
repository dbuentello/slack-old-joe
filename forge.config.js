/* tslint:disable */

const path = require('path')
const fs = require('fs')
const packageJson = require('./package.json')

const { version } = packageJson
const iconDir = path.resolve(__dirname, 'assets')

module.exports = {
  hooks: {
    generateAssets: require('./tools/generateAssets')
  },
  packagerConfig: {
    name: 'Old Joe',
    executableName: 'old-joe',
    asar: false,
    icon: path.resolve(iconDir, 'icon'),
    // TODO: FIXME?
    // ignore: [
    //   /^\/\.vscode\//,
    //   /^\/tools\//
    // ],
    appBundleId: 'com.slack.old-joe',
    appCategoryType: 'public.app-category.developer-tools',
    win32metadata: {
      OriginalFilename: 'Old Joe',
    },
    osxSign: {
      identity: 'Developer ID Application: Felix Rieseberg (LT94ZKYDCJ)'
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch) => {
        const certificateFile = process.env.CI
          ? path.join(__dirname, 'cert.p12')
          : process.env.WINDOWS_CERTIFICATE_FILE;

        if (!certificateFile || !fs.existsSync(certificateFile)) {
          console.warn(`Warning: Could not find certificate file at ${certificateFile}`)
        }

        return {
          name: 'old-joe',
          authors: 'Felix Rieseberg',
          exe: 'old-joe.exe',
          iconUrl: 'https://raw.githubusercontent.com/electron/fiddle/0119f0ce697f5ff7dec4fe51f17620c78cfd488b/assets/icons/fiddle.ico',
          loadingGif: './assets/loading.gif',
          noMsi: true,
          remoteReleases: '',
          setupExe: `old-joe-${version}-${arch}-setup.exe`,
          setupIcon: path.resolve(iconDir, 'fiddle.ico'),
          certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
          certificateFile
        }
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        icon: {
          scalable: path.resolve(iconDir, 'fiddle.svg')
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux']
    }
  ],
  // publishers: [
  //   {
  //     name: '@electron-forge/publisher-github',
  //     config: {
  //       repository: {
  //         owner: 'electron',
  //         name: 'fiddle'
  //       },
  //       draft: true,
  //       prerelease: true
  //     }
  //   }
  // ]
}
