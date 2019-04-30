param (
  [string] $name
)

Get-CimInstance Win32_StartupCommand | Select-Object Name, command, Location, User | Where-Object -Property Name -like $name | Format-List