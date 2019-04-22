param (
  [int] $showState = 9
)

# this enum works in PowerShell 5 only
# in earlier versions, simply remove the enum,
# and use the numbers for the desired window state
# directly

# Enum ShowStates
# {
#   Hide = 0
#   Normal = 1
#   Minimized = 2
#   Maximized = 3
#   ShowNoActivateRecentPosition = 4
#   Show = 5
#   MinimizeActivateNext = 6
#   MinimizeNoActivate = 7
#   ShowNoActivate = 8
#   Restore = 9
#   ShowDefault = 10
#   ForceMinimize = 11
# }

# the C#-style signature of an API function (see also www.pinvoke.net)
$code = '[DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);'

# add signature as new type to PowerShell (for this session)
$type = Add-Type -MemberDefinition $code -Name myAPI -PassThru

# Access Slack
$process = Get-Process Firefox | Select-Object -Index 0

# get the process window handle
$hwnd = $process.MainWindowHandle

# restore the window handle again
$type::ShowWindowAsync($hwnd, $showState)
