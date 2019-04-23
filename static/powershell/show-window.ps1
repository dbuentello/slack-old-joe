param (
  [int] $showState = 9
)

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

Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class OldJoe {
     [DllImport("user32.dll")]
     [return: MarshalAs(UnmanagedType.Bool)]
     public static extern bool SetForegroundWindow(IntPtr hWnd);

     [DllImport("user32.dll")]
     [return: MarshalAs(UnmanagedType.Bool)]
     public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  }
"@

# Access Slack
$process = Get-Process slack | ForEach-Object {
  # get the process window handle
  $hwnd = $_.MainWindowHandle

  # Set the handle
  [OldJoe]::ShowWindow($hwnd, $showState)
}
