[CmdletBinding()]
param([string]$ProjectPath = 'C:\Users\white\Desktop\The Doll Marker (HAZEL)')
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath (Join-Path $ProjectPath '.git'))) { throw "Not a Git checkout: $ProjectPath" }
$remote = (& git -C $ProjectPath remote get-url origin)
if ($LASTEXITCODE -ne 0 -or $remote -notmatch '^((https://github\.com/)|(git@github\.com:))ShadowWalkerNC/hazel-the-dollmaker(\.git)?/?$') { throw 'Unexpected origin. No files changed.' }
$changes = & git -C $ProjectPath status --porcelain --untracked-files=all
if ($LASTEXITCODE -ne 0 -or $changes) { throw 'Uncommitted or untracked files exist. Back up or commit them first. No files changed.' }
$branch = & git -C $ProjectPath branch --show-current
if ($branch -ne 'main') { throw 'Switch to main after reviewing your current branch. No files changed.' }
& git -C $ProjectPath fetch origin
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed.' }
& git -C $ProjectPath rev-parse --verify 'origin/backup/pre-collectibles-merge-2026-10-21'
if ($LASTEXITCODE -ne 0) { throw 'Remote backup branch missing. Update cancelled.' }
$backup = 'backup/windows-before-unified-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
& git -C $ProjectPath branch $backup HEAD
if ($LASTEXITCODE -ne 0) { throw 'Could not preserve current HEAD. Update cancelled.' }
& git -C $ProjectPath merge --ff-only origin/main
if ($LASTEXITCODE -ne 0) { throw 'Branches diverged. Backup retained; resolve local changes before continuing.' }
Write-Host "Unified source updated in $ProjectPath. Previous version preserved on $backup."
Write-Host 'Next: pnpm install --frozen-lockfile; pnpm dev'
