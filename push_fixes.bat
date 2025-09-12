@echo off
cd /d D:\AQUA-IN-JAR
git add .
git commit -m "fix: resolve Hugo build issues - fix filename special chars, relref links, and add buildFuture config"
git push origin master
pause

