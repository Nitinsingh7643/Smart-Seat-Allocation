@echo off
echo Starting IHWAS Development Servers...
start cmd /k "cd server && npm run dev"
start cmd /k "cd client && npm run dev"
echo Servers are launching. Check the new windows for status.
