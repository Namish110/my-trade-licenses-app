param(
  [switch]$InstallDeps
)

$ErrorActionPreference = "Stop"

Write-Host "Starting build..." -ForegroundColor Cyan

if ($InstallDeps) {
  Write-Host "Installing dependencies (npm ci)..." -ForegroundColor Yellow
  npm ci
}

Write-Host "Running Angular build..." -ForegroundColor Yellow
npm run build

Write-Host "Build completed." -ForegroundColor Green
