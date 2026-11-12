param(
  [string]$BaseUrl = 'http://localhost:3000'
)

$ErrorActionPreference = 'Stop'
if ($BaseUrl -notmatch '^https?://(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$') {
  throw 'Por segurança, BaseUrl deve usar localhost, 127.0.0.1 ou ::1. Testes remotos são proibidos.'
}
$k6Command = Get-Command k6 -ErrorAction SilentlyContinue
if ($k6Command) {
  $k6Exe = $k6Command.Source
} else {
  $defaultK6 = Join-Path $env:ProgramFiles 'k6\k6.exe'
  if (Test-Path -LiteralPath $defaultK6) {
    $k6Exe = $defaultK6
  } else {
    throw 'k6 não foi encontrado no PATH nem em C:\Program Files\k6\k6.exe.'
  }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$resultsDir = Join-Path $projectRoot 'resultados'
New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null
$profiles = @(
  @{ Name = 'cenario-1'; Script = (Join-Path $projectRoot 'k6/carga-inicial.js') },
  @{ Name = 'cenario-2'; Script = (Join-Path $projectRoot 'k6/carga-progressiva.js') }
)

foreach ($profile in $profiles) {
  Write-Host "Executando $($profile.Name) contra $BaseUrl"
  $summary = Join-Path $resultsDir ($profile.Name + '.json')
  $log = Join-Path $resultsDir ($profile.Name + '.log')
  & $k6Exe run --env "BASE_URL=$BaseUrl" --summary-export $summary $profile.Script 2>&1 | Tee-Object -FilePath $log
  $exitCode = $LASTEXITCODE
  if ($exitCode -ne 0) {
    throw "k6 encerrou $($profile.Name) com código $exitCode. Consulte $log; thresholds/checks podem ter falhado."
  }
}
Write-Host "Concluído. Evidências em $resultsDir"
