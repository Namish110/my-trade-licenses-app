param(
  [switch]$InstallDeps,
  [switch]$Deploy
)

$ErrorActionPreference = "Stop"

if ($Deploy) {
  Write-Host "Starting production deploy build..." -ForegroundColor Cyan
} else {
  Write-Host "Starting production build..." -ForegroundColor Cyan
}

if ($InstallDeps) {
  Write-Host "Installing dependencies (npm ci)..." -ForegroundColor Yellow
  npm ci
}

if ($Deploy) {
  Write-Host "Running Angular production build for deploy..." -ForegroundColor Yellow
  npm run build
} else {
  Write-Host "Running Angular production build..." -ForegroundColor Yellow
  npm run build
}

if ($Deploy) {
  $htmlFiles = Get-ChildItem -Path "dist\my-trade-licenses-app\browser" -Filter "index*.html" -ErrorAction SilentlyContinue
  foreach ($file in $htmlFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $updated = $content -replace '<base href="/">', '<base href="/gba/">'
    if ($updated -ne $content) {
      Set-Content -LiteralPath $file.FullName -Value $updated
    }
  }
  Write-Host "Patched deploy base href to /gba/ in generated HTML." -ForegroundColor Green

  $buildRoot = "build"
  $buildAppDir = Join-Path $buildRoot "my-trade-licenses-app"

  if (Test-Path $buildAppDir) {
    Remove-Item -LiteralPath $buildAppDir -Recurse -Force
  }

  New-Item -ItemType Directory -Path $buildRoot -Force | Out-Null
  Copy-Item -LiteralPath "dist\my-trade-licenses-app" -Destination $buildAppDir -Recurse -Force
  Write-Host "Copied deploy output to build\\my-trade-licenses-app." -ForegroundColor Green
}

Write-Host "Build completed. Output is in dist/" -ForegroundColor Green
