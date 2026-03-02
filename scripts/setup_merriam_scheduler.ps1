# setup_merriam_scheduler.ps1
# ─────────────────────────────────────────────────────────────────────────────
# 在 Windows 任务计划程序中注册"每日 Merriam 词汇生成"任务。
# 以管理员身份运行一次即可：
#   powershell -ExecutionPolicy Bypass -File scripts\setup_merriam_scheduler.ps1
# ─────────────────────────────────────────────────────────────────────────────

$TaskName   = "MerriamVocabDaily"
$ScriptPath = "d:\AQUA-IN-JAR\scripts\generate_merriam_unit.py"
$PythonExe  = (Get-Command python -ErrorAction SilentlyContinue).Source

if (-not $PythonExe) {
    Write-Error "找不到 python.exe，请确认 Python 已安装并在 PATH 中。"
    exit 1
}

Write-Host "Python 路径: $PythonExe"

# 每天 07:00 触发（可修改 -At 参数改变时间）
$Trigger = New-ScheduledTaskTrigger -Daily -At "07:00"

$Action  = New-ScheduledTaskAction `
    -Execute $PythonExe `
    -Argument "`"$ScriptPath`"" `
    -WorkingDirectory "d:\AQUA-IN-JAR"

$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable:$false

# 如果任务已存在则先删除
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "已删除旧任务。"
}

Register-ScheduledTask `
    -TaskName $TaskName `
    -Trigger   $Trigger `
    -Action    $Action `
    -Settings  $Settings `
    -RunLevel  Highest `
    -Description "每天自动生成 Merriam Vocabulary Builder 词汇单元" `
    | Out-Null

Write-Host ""
Write-Host "✅ 已注册任务: $TaskName"
Write-Host "   触发时间: 每天 07:00"
Write-Host "   执行: $PythonExe `"$ScriptPath`""
Write-Host ""
Write-Host "手动立即触发（测试用）:"
Write-Host "  Start-ScheduledTask -TaskName `"$TaskName`""
Write-Host ""
Write-Host "查看任务状态:"
Write-Host "  Get-ScheduledTask -TaskName `"$TaskName`""
