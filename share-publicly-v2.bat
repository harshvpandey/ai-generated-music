@echo off
TITLE JioAIMusic - Advanced Public Sharing
CLS

:MENU
CLS
ECHO ========================================================
ECHO          JioAIMusic Public Sharing Utility V2
ECHO ========================================================
ECHO.
ECHO Please select a tunneling service to try:
ECHO.
ECHO 1. Pinggy.io      (Try this first - easiest URL)
ECHO 2. Localhost.run  (Reliable backup)
ECHO 3. Serveo.net     (Alternative backup)
ECHO.
SET /P M=Type 1, 2, or 3 then press ENTER: 

IF %M%==1 GOTO PINGGY
IF %M%==2 GOTO LOCALHOST
IF %M%==3 GOTO SERVEO

:PINGGY
CLS
ECHO Connecting to Pinggy.io...
ECHO --------------------------------------------------------
ECHO Look for a URL like: https://rand0m.a.pinggy.io
ECHO IF ASKED FOR PASSWORD, TYPE: pass1234
ECHO --------------------------------------------------------
ssh -p 443 -R0:localhost:8000 a.pinggy.io
PAUSE
GOTO MENU

:LOCALHOST
CLS
ECHO Connecting to Localhost.run...
ECHO --------------------------------------------------------
ECHO Look for a URL like: https://random-name.localhost.run
ECHO IF ASKED FOR PASSWORD, TYPE: pass1234
ECHO --------------------------------------------------------
ssh -R 80:localhost:8000 nokey@localhost.run
PAUSE
GOTO MENU

:SERVEO
CLS
ECHO Connecting to Serveo.net...
ECHO --------------------------------------------------------
ECHO Look for a URL like: https://random.serveo.net
ECHO IF ASKED FOR PASSWORD, TYPE: pass1234
ECHO --------------------------------------------------------
ssh -R 80:localhost:8000 serveo.net
PAUSE
GOTO MENU
