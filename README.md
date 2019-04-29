# Old Joe Smoke Testing

![oldjoe](https://user-images.githubusercontent.com/1426799/56905640-df966d80-6aa0-11e9-9338-8f083bd73a1a.jpg)

Old Joe is a test automation framework for smoke-testing Slack. It verifies that Slack's most important features
work.

## Setup

 * Ensure that you're connected to the Internet only via Wi-Fi and that all other network adapters are disabled - including possible `vEthernet` adapters on Windows.
 * Ensure that Slack isn't already running. Old Joe will make backups of your user data dir and restore it after the test.
 * Do not interact with the computer while the test is running. Old Joe will restart Slack multiple times and automate mouse, keyboard, and app focus.
 * If you're running the `Sign In` test suite, ensure that your browser is signed into both the [Old Joe One](https://old-joe.slack.com) and [Old Joe Two](https://oldjoetwo.slack.com) workspaces. There is only one account, get in touch with Felix for credentials.
 * macOS: Let Old Joe control your computer (`System Preferences - Security & Privacy - Accessibility`). macOS will ask during your first run.
 * macOS: Close all other apps that might send notifications.

## Tests

Old Joe currently verifies the following:

#### Sign In
- Opens and loads the sign-in window, loads the correct url
- Displays a visible sign-in button
- Signs into a first team
- Does not display a quick switcher when only one team is signed in
- Signs into a second team
- Displays a quick switcher when a second team is present
- Can now switch teams using the quick switcher (via shortcut)

#### Messaging
- Can switch to a channel
- Can post a message
- Can play a YouTube video

#### Notifications
- Can send a notification (by triggering one from webapp)
- Clicking on the notification opens the right channel
- Clicking on the notification opens the right channel _and_ opens Slack if closed
- Can send a notification for a threaded message (by triggering one from webapp)
- Clicking on the notification opens the thread in the flexpane

#### Downloads
- Can download an in-channel file
- Downloading a file results in a file on disk that has the right content
- Can pause and resume a larger download, file on disk remains unchanged while paused

#### Application Window
- Can maximize the window
- Can enter fullscreen display (and leave it)
- Can minimize the window

#### Reloading
- Cmd/Ctrl + R reloads the workspace
- Cmd/Ctrl + Shift + R reloads everything

#### Menus
- Can select the "next" workspace using the window menu
- Can select the "previous" workspace using the window menu
- Can select a workspace by name using the window menu
- Can select the "next" workspace using the keyboard shortcut
- Can select the "previous" workspace using the shortcut
- Can select a workspace using the Dock menu
- Can select a workspace using the Quick Switcher

#### Logs
- Revealing logs (window menu) results in logs in the downloads folder
- Said logs contain the files we expect to be in there
- `Restart and Collect Net Logs` restarts Slack, net log collection is enabled
- Clicking on the `Stop logging` button results in a log zip file with a `net.log`

#### Child Windows
- About box contains the expected version number and modifiers (macOS)
- Creating a new post opens a posts window
- Can create a post that's being saved and shared back to the correct channel

#### Deep Links
- `slack://open?team=` works and opens the correct team

#### Network
- Disconnecting from Wi-fi eventually results in the usual `Slack is trying to connect` messages
- Reconnecting to Wi-Fi allows Slack to recover and go back online

#### Developer Tools
- Can open the `webapp` devtools via window menu
- Can close the `webapp` devtools via window menu
- Can open the Electron devtools via window menu
- Can close the Electron devtools via window menu

#### Preferences
- Can open the preferences
- Can disable hardware acceleration
- Can open the `/slackgpuinfo` window by typing it into the message box
- Has hardware acceleration enabled by default (and is actually using it)
- Persists these setting across teams
- Launches without hardware acceleration on next launch (and Chrome uses software acceleration)
- Can enable hardware acceleration
- Launches with hardware acceleration on next launch (and is actually using it)
- Can enable launch on login (Windows)
- Can disable launch on login (Windows)
- Has the Windows notification method options (Windows)

#### Spellcheck
- Corrects misspelled words and replaces on correction via context menu

#### Processes
- Leaves no processes behind after being closed
- Has the right number of processes while running (and not more or less)

#### Sign Out
- Signing out removes a team