$targetPath = "d:\AQUA-IN-JAR\content\aquas-field\reading-notes\The Daily Laws(outline).md"
$introPath = "d:\AQUA-IN-JAR\scripts\intro_content.txt"

# Read Intro with correct UTF-8 encoding
$introContent = Get-Content -Path $introPath -Encoding UTF8 -Raw

$calendarHtml = New-Object System.Text.StringBuilder
$months = @("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
$daysInMonth = @(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)

for ($i = 0; $i -lt 12; $i++) {
    [void]$calendarHtml.AppendLine("<details>")
    [void]$calendarHtml.AppendLine("  <summary style='cursor: pointer; font-weight: bold; margin: 10px 0;'>$($months[$i])</summary>")
    [void]$calendarHtml.AppendLine("  <ul>")
    
    for ($j = 1; $j -le $daysInMonth[$i]; $j++) {
        $dateStr = "$($months[$i]) $j"
        # Example Link for Jan 1
        if ($i -eq 0 -and $j -eq 1) {
            [void]$calendarHtml.AppendLine("    <li><a href='https://example.com/daily-laws-jan-1'>$dateStr</a> (Example Link)</li>")
        }
        else {
            [void]$calendarHtml.AppendLine("    <li>$dateStr</li>")
        }
    }
    
    [void]$calendarHtml.AppendLine("  </ul>")
    [void]$calendarHtml.AppendLine("</details>")
    [void]$calendarHtml.AppendLine("")
}

$finalContent = $introContent + "`n" + $calendarHtml.ToString()

# Write with Force UTF8 (with BOM usually needed for some Windows editors, or without)
# [System.Text.Encoding]::UTF8 is UTF-8 WITH BOM.
[System.IO.File]::WriteAllText($targetPath, $finalContent, [System.Text.Encoding]::UTF8)

Write-Host "File assembled successfully."
