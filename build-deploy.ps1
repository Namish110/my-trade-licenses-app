param()

$ErrorActionPreference = "Stop"

Write-Host "Running production build for deploy..." -ForegroundColor Cyan
try {
  npm run build
} catch {
  if (-not (Test-Path "dist\my-trade-licenses-app\browser")) {
    throw
  }
  Write-Host "Build reported an error after generating output. Continuing with packaging..." -ForegroundColor Yellow
}

$htmlFiles = Get-ChildItem -Path "dist\my-trade-licenses-app\browser" -Filter "index*.html" -ErrorAction SilentlyContinue
foreach ($file in $htmlFiles) {
  $content = Get-Content -LiteralPath $file.FullName -Raw
  $updated = $content -replace '<base href="/">', '<base href="/gba/">'
  if ($updated -ne $content) {
    Set-Content -LiteralPath $file.FullName -Value $updated
  }
}

$buildRoot = "build"
$browserRoot = "dist\my-trade-licenses-app\browser"

if (Test-Path $buildRoot) {
  Remove-Item -LiteralPath $buildRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $buildRoot -Force | Out-Null
Copy-Item -Path (Join-Path $browserRoot "*") -Destination $buildRoot -Recurse -Force

$csrIndex = Join-Path $buildRoot "index.csr.html"
$htmlIndex = Join-Path $buildRoot "index.html"
if (Test-Path $csrIndex) {
  Copy-Item -LiteralPath $csrIndex -Destination $htmlIndex -Force
}

Write-Host "Deploy build ready in build" -ForegroundColor Green
