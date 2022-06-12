Run these commands in both the windows VMs in a powershell that is in admin mode.
New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4

This will allow the ping commmand to work from outside. 
