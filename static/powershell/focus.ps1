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

  # restore the window handle again
  [OldJoe]::ShowWindow($hwnd, 5)
  [OldJoe]::SetForegroundWindow($hwnd)
}
