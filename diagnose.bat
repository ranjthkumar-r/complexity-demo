@echo off
echo START > diag.log
mkdir test_dir
if exist test_dir echo MKDIR_SUCCESS >> diag.log
call npm --version >> diag.log
echo END >> diag.log
