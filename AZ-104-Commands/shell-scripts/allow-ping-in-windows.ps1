New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
Install-WindowsFeature -name Web-Server -IncludeManagementTools