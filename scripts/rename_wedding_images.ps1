$ErrorActionPreference = 'Stop'

# Repository root assumed to be the current script's parent dir
$repoRoot = Split-Path -Path $PSScriptRoot -Parent
$imagesDir = Join-Path $repoRoot 'static\images\posts'

if (-not (Test-Path $imagesDir)) {
  Write-Error "Images directory not found: $imagesDir"
}

# Support both UTF-8 and mojibake filenames (WeChat photos sometimes appear garbled on non-UTF consoles)
$wx1 = Get-ChildItem -LiteralPath $imagesDir -Filter '微信图片_*.jpg' -ErrorAction SilentlyContinue
$wx2 = Get-ChildItem -LiteralPath $imagesDir -Filter '*΢��ͼƬ*.jpg' -ErrorAction SilentlyContinue
$files = @()
if ($wx1) { $files += $wx1 }
if ($wx2) { $files += $wx2 }
$files = $files | Sort-Object LastWriteTime, Name -Unique

if ($files.Count -eq 0) {
  Write-Host 'No WeChat photo files matched. Nothing to rename.'
  exit 0
}

$i = 1
foreach ($f in $files) {
  $newName = ('wedding-2025-10-03-{0:D3}.jpg' -f $i)
  $target = Join-Path $imagesDir $newName
  if (Test-Path $target) {
    # Find next available index to avoid collisions if re-run
    while (Test-Path $target) {
      $i++
      $newName = ('wedding-2025-10-03-{0:D3}.jpg' -f $i)
      $target = Join-Path $imagesDir $newName
    }
  }
  Rename-Item -LiteralPath $f.FullName -NewName $newName
  Write-Host ("Renamed: {0} -> {1}" -f $f.Name, $newName)
  $i++
}

Write-Host 'Done.'


