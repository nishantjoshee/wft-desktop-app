!include WinVer.nsh
!include LogicLib.nsh

Function .onInit
System::Call 'kernel32::GetEnvironmentVariable(t "APPDATA", t .r0, i ${NSIS_MAX_STRLEN})'
StrCpy $1 "$0\Microsoft\Windows\Start Menu\Programs\Startup\YourAppName.lnk"
CreateShortcut "$1" "$EXEDIR\wft-setup.exe"
FunctionEnd

Function un.onUninstSuccess
Delete "$SMSTARTUP\wft-setup.lnk"
FunctionEnd
