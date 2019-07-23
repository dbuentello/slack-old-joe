property finderwindownumber: 1
tell application "Slack"
	set TotalNumberOfFinderWindows to (count of (every window where visible is true))
end tell

log TotalNumberOfFinderWindows
