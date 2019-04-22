# Access Slack
$process = Get-Process slack | Select-Object -Index 0

# get the process window handle
$title = $process.MainWindowTitle

$wshell = New-Object -ComObject wscript.shell
$wshell.AppActivate($title)
