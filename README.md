# Old Joe Smoke Testing

![oldjoe](https://user-images.githubusercontent.com/1426799/56905640-df966d80-6aa0-11e9-9338-8f083bd73a1a.jpg)

Old Joe is a test automation framework for smoke-testing Slack. It verifies that Slack's most important features
work.

## Setup

 * Ensure that you're connected to the Internet only via Wi-Fi and that all other network adapters are disabled - including possible `vEthernet` adapters on Windows.
 * Ensure that Slack isn't already running. Old Joe will make backups of your user data dir and restore it after the test. It'll also kill Slack if you don't.
 * Do not interact with the computer while the test is running. Old Joe will restart Slack multiple times and automate mouse, keyboard, and app focus.
 * If you're running the `Sign In` test suite, ensure that your browser is signed into both the [Old Joe One](https://old-joe.slack.com) and [Old Joe Two](https://oldjoetwo.slack.com) workspaces. There is only one account, get in touch with Felix for credentials.
 * macOS: Let Old Joe control your computer (`System Preferences - Security & Privacy - Accessibility`). macOS will ask during your first run. macOS might at any point decide that Old Joe's automation is too much automation and inform you accordingly.
 * macOS: Close all other apps that might send notifications.
 * linux: make sur the tool `nmcli` is installed to ensure correct network tests.

> :warning: If and when Chromedriver crashes, you'll see error messages complaining that Chrome crashed (which means that chromedriver crashed) or that there's no connection to Chrome (again, Chromedriver crashed). You'll see this happening because Slack is gone. Don't let that distract you, just restart the test.

## Tests
You can find a list of tests [here](docs/tests.md).

## Internals
Old Joe uses [Chromedriver](http://chromedriver.chromium.org/) driven by [webdriverio](https://webdriver.io/docs/api.html). Assertions are being done with [Cherio](https://github.com/cheeriojs/cheerio). Automation is being done by WebDriver, Chrome's DevTools protocol, and – where necessary – with AppleScript, PowerShell, and Robotjs. There are no dependencies for the system that's running the test.

Check out the [`src/smoke`](src/smoke) folder to see test suites. The whole framework is built to look and feel just like any other test suite - with a large library of helpers for common Slack operations (switching teams, opening channels, clicking on menu items, and more). All of this stuff is pretty movable - you can swap out Chromedriver for another protocol with ease, swapping out Cheerio for another assertion library is just as easy.

### Who's Joe?
Joe Camel (officially Old Joe) was the advertising mascot for Camel cigarettes from late 1987 to July 12, 1997, appearing in magazine advertisements, billboards, and other print media.

He's advertising smoking. This is a smoke test suite. Get it? GET IT?!

### Rapid Prototyping & Development

The easiest way to write tests is to do it live. Start Old Joe, deselect all tests, and open up Old Joe's developer tools. The `BrowserObject` client will be available as `window.client`, all helpers can be found in `window.helpers`.

### Development Tips & Tricks

#### `kb_list_mouse_interceptor` blocks my mouse clicks

Slack's `webapp` will block mouse clicks if keyboard navigation is enabled. Easily fixable: Call `element.moveTo()` before trying to click on the element that'd otherwise be blocked by the mouse interceptor.

#### Can I see where the tools clicked?

Call `helpers.traceClicks(window.client)` from Old Joe's developer tools. Little red dots will appear in the currently selected browser context whenever something clicks there (human or robot).

### Building
This repository automatically builds new tags and stages them in https://github.com/felixrieseberg/slack-old-joe/releases.
