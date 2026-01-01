$filePath = "d:\AQUA-IN-JAR\content\aquas-field\reading-notes\The Daily Laws(outline).md"
$months = @("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
$daysInMonth = @(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)

# Read the file to get frontmatter and intro
$content = Get-Content -Path $filePath -Encoding UTF8 -Raw
$regex = "(?s)^(---.*?---.*?\n)(<ul class=`"toc-drawer`">.*)$"
$matches = [regex]::Matches($content, $regex)

if ($matches.Count -eq 0) {
    Write-Host "Regex didn't match. Exiting."
    return
}

$header = $matches[0].Groups[1].Value

$calendarHtml = New-Object System.Text.StringBuilder
[void]$calendarHtml.AppendLine("<ul class='toc-drawer'>")

for ($i = 0; $i -lt 12; $i++) {
    [void]$calendarHtml.AppendLine("  <li class='drawer-item'>")
    [void]$calendarHtml.AppendLine("    <details>")
    if ($i -eq 0) {
        [void]$calendarHtml.AppendLine("      <summary style='cursor: pointer; font-weight: bold; margin: 10px 0;'><a href='https://tikri.site/aquas-field/reading-notes/January/'>$($months[$i])</a></summary>")
    }
    else {
        [void]$calendarHtml.AppendLine("      <summary style='cursor: pointer; font-weight: bold; margin: 10px 0;'>$($months[$i])</summary>")
    }
    [void]$calendarHtml.AppendLine("      <ul>")
    
    for ($j = 1; $j -le $daysInMonth[$i]; $j++) {
        $dateStr = "$($months[$i]) $j"
        # January 1st link
        if ($i -eq 0 -and $j -eq 1) {
            [void]$calendarHtml.AppendLine("        <li><a href='https://tikri.site/aquas-field/reading-notes/January1-Discover-Your-Calling/'>January 1:Discover Your Calling</a></li>")
        }
        else {
            [void]$calendarHtml.AppendLine("        <li>$dateStr</li>")
        }
    }
    
    [void]$calendarHtml.AppendLine("      </ul>")
    [void]$calendarHtml.AppendLine("    </details>")
    [void]$calendarHtml.AppendLine("  </li>")
}

[void]$calendarHtml.AppendLine("</ul>")

$finalContent = $header + $calendarHtml.ToString()

[System.IO.File]::WriteAllText($filePath, $finalContent, [System.Text.Encoding]::UTF8)
Write-Host "File updated with full drawer structure."
