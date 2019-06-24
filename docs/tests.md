## Tests

Old Joe currently verifies the following:

#### Sign In
- Opens and loads the sign-in window, loads the correct url
- Displays a visible sign-in button
- Signs into a first team
- Does not display a quick switcher when only one team is signed in
- Signs into a second team
- Displays a quick switcher when a second team is present
- Can now switch teams using the quick switcher (via shortcut) (Disabled: Not available in Sonic as of 6/16)

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
- Can cancel a download
- Can change download location

#### Application Window
- Can maximize the window
- Can enter fullscreen display
- Can leave fullscreen display
- Can minimize the window
- Can un-minimize the window

#### Reloading & Resetting
- Cmd/Ctrl + R reloads the workspace
- Cmd/Ctrl + Shift + R reloads everything
- Can "Restart and Clear Cache"
- Can still switch teams post-reset (via shortcut)
- Can switch to the #random channel post-reset
- Can post a message post-reset

#### Menus (Workspaces)
- Can select the "next" workspace using the window menu
- Can select the "previous" workspace using the window menu
- Can select a workspace by name using the window menu
- Can select the "next" workspace using the keyboard shortcut
- Can select the "previous" workspace using the shortcut
- Can select a workspace using the Dock menu
- Can select a workspace using the Quick Switcher

### Menus (Shortcuts)
- Can open the "Preferences"
- Can "Close" the window
- Can "undo"
- Can "redo"
- Can "select all"
- Can "copy"
- Can "paste"
- Can "paste and match style"
- Can "find"
- Can "use selection to find"
- Can "zoom in"
- Can "zoom in" (again)
- Can "zoom out"
- Can go back to "actual size"
- Can go "back" in history
- Can go "forward" in history
- Can display keyboard shortcuts
- Can close the keyboard shortcuts

### Menus (Context)
- Can "copy" (editable)
- Can "paste" (editable)
- Can "cut" (editable)
- Can "copy" (static)
- Can "inspect element" (static)
- Can "copy image url"
- Can "copy image"
- Can "copy link"

### Menus (Cancel)
- Can cancel the "Reset App Data" dialog
- Can cancel the "Restart and Collect Net Logs" dialog

#### Logs
- Revealing logs (window menu) results in logs in the downloads folder
- Said logs contain the files we expect to be in there
- `Restart and Collect Net Logs` restarts Slack, net log collection is enabled
- Clicking on the `Stop logging` button results in a log zip file with a `net.log`

#### Child Windows
- "About Slack" box contains the expected version number and modifiers (macOS)
- "About Slack" window contains the expected version number and modifiers (Windows, Linux)
- "About Slack" window contains an acknowledgements button
- Creating a new post opens a posts window (Disabled: Not available in Sonic as of 6/16)
- Can create a post that's being saved and shared back to the correct channel (Disabled: Not available in Sonic as of 6/16)

#### Deep Links
- `slack://open?team=` works and opens the correct team ((Disabled: Not available in Sonic as of 6/16))
- `slack://channel` works and opens the correct channel
- `slack://file` works and opens the right file

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
- Launches without hardware acceleration on next launch (and Chrome uses software acceleration)
- Can enable hardware acceleration
- Launches with hardware acceleration on next launch (and is actually using it)
- Can enable launch on login (Windows)
- Can disable launch on login (Windows)
- Has the Windows notification method options (Windows)
- Can select the HTML notification method (and trigger a preference change)

#### Spellcheck
- Corrects misspelled words and replaces on correction via context menu

#### Processes
- Leaves no processes behind after being closed
- Has the right number of processes while running (and not more or less)

#### Sign Out
- Signing out removes a team
- Going back down to one team results in the quick switcher being removed
- Signing out of the last team opens the sign-in window
