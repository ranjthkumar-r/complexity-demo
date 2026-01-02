@echo off
mkdir legacy
move index.html legacy\
move styles.css legacy\
move scripts.js legacy\
move package.json legacy\
move data legacy\
move analyzer legacy\
move tests legacy\
move README.md legacy\
echo Setup Complete > setup.log
