#!/usr/bin/env bash
set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
export BASE_URL="${BASE_URL:-http://localhost:3000}"
export K6_NO_USAGE_REPORT=true
BASE_URL="${BASE_URL%/}"
if [[ ! "$BASE_URL" =~ ^http://(localhost|127\.0\.0\.1|\[::1\])(:[0-9]{1,5})?$ ]]; then
  printf 'BASE_URL deve ser HTTP local (localhost, 127.0.0.1 ou [::1]).\n' >&2
  exit 1
fi

k6_bin="${K6_BIN:-k6}"
saida="${1:-resultados/$(TZ=America/Sao_Paulo date +%Y%m%d-%H%M%S)}"
mkdir -p -- "$saida"

{
  printf 'Registro: %s\nAPI: %s\n' "$(TZ=America/Sao_Paulo date --iso-8601=seconds)" "$BASE_URL"
  "$k6_bin" version
  node --version
  uname -srm
  printf 'CPUs lógicas disponíveis: '
  getconf _NPROCESSORS_ONLN
  awk -F: '/model name/ { sub(/^ +/, "", $2); print "CPU: " $2; exit }' /proc/cpuinfo
  awk '/MemTotal/ { printf "Memória total: %.2f GiB\n", $2 / 1024 / 1024 }' /proc/meminfo
  printf 'Pausas: 1 s após cada GET; 2 GETs por iteração.\n'
} > "$saida/ambiente.txt"

# Evidência da documentação e do painel local, sem seguir redirecionamentos.
for pagina in documentacao status; do
  caminho="/"
  [[ "$pagina" != status ]] || caminho="/status"
  curl --noproxy '*' --fail --silent --show-error --max-time 5 --max-redirs 0 \
    --dump-header "$saida/$pagina.headers.txt" --output "$saida/$pagina.html" \
    "$BASE_URL$caminho"
done

resultado=0
for cenario in 1 2; do
  codigo=0
  {
    printf 'Início: %s\n' "$(TZ=America/Sao_Paulo date --iso-8601=seconds)"
    printf 'Comando: k6 run --no-color --quiet -e BASE_URL=%s scripts/cenario-%s.js\n' "$BASE_URL" "$cenario"
  } > "$saida/cenario-$cenario.log"
  "$k6_bin" run --no-color --quiet \
    -e "BASE_URL=$BASE_URL" -e "SUMMARY_PATH=$saida/cenario-$cenario.json" \
    "scripts/cenario-$cenario.js" 2>&1 | tee -a "$saida/cenario-$cenario.log" || codigo=$?
  printf 'Fim: %s\nCódigo de saída: %s\n' \
    "$(TZ=America/Sao_Paulo date --iso-8601=seconds)" "$codigo" | tee -a "$saida/cenario-$cenario.log"
  [[ "$codigo" == 0 ]] || resultado=1
done

printf 'Evidências salvas em %s\n' "$saida"
exit "$resultado"
