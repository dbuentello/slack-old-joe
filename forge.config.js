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
        const options = {
          name: 'old-joe',
          authors: 'Felix Rieseberg',
          exe: 'old-joe.exe',
          iconUrl: 'https://raw.githubusercontent.com/electron/fiddle/0119f0ce697f5ff7dec4fe51f17620c78cfd488b/assets/icons/fiddle.ico',
          noMsi: true,
          noDelta: true,
          setupExe: `old-joe-${version}-${arch}-setup.exe`,
          setupIcon: path.resolve(iconDir, 'icon.ico')
        }

        const certificateFile = process.env.CI
          ? path.join(__dirname, 'cert.p12')
          : process.env.WINDOWS_CERTIFICATE_FILE;

        if (!certificateFile || !fs.existsSync(certificateFile)) {
          console.warn(`Warning: Could not find certificate file at ${certificateFile}`)
        } else {
          options.certificatePassword = process.env.WINDOWS_CERTIFICATE_PASSWORD;
          options.certificateFile = certificateFile;
        }

        return options;
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
        icon: path.resolve(iconDir, 'icon.png')
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux']
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'felixrieseberg',
          name: 'slack-old-joe'
        },
        draft: true,
        prerelease: true
      }
    }
  ]
}
