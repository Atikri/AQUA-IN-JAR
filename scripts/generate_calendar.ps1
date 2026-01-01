$months = @("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
$daysInMonth = @(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)

for ($i = 0; $i -lt 12; $i++) {
    Write-Output "<details>"
    Write-Output "  <summary style='cursor: pointer; font-weight: bold; margin: 10px 0;'>$($months[$i])</summary>"
    Write-Output "  <ul>"
    for ($j = 1; $j -le $daysInMonth[$i]; $j++) {
        Write-Output "    <li>$($months[$i]) $j</li>"
    }
    Write-Output "  </ul>"
    Write-Output "</details>"
    Write-Output ""
}
