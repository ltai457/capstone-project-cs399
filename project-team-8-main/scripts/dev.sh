#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

if [[ -x "$HOME/.dotnet/dotnet" ]]; then
  export DOTNET_ROOT="$HOME/.dotnet"
  export PATH="$DOTNET_ROOT:$PATH"
fi

if ! command -v dotnet >/dev/null || [[ "$(dotnet --version 2>/dev/null)" != 10.* ]]; then
  echo "Install the .NET 10 SDK before starting the app. See README.md." >&2
  exit 1
fi

export ASPNETCORE_ENVIRONMENT=Development
api_port="${API_PORT:-8081}"
frontend_port="${FRONTEND_PORT:-5173}"
export API_PROXY_TARGET="http://localhost:$api_port"

if [[ ! -d client/node_modules ]]; then
  npm --prefix client ci
fi

backend_pid=""
frontend_pid=""
cleanup() {
  if [[ -n "$frontend_pid" ]]; then kill "$frontend_pid" 2>/dev/null || true; fi
  if [[ -n "$backend_pid" ]]; then kill "$backend_pid" 2>/dev/null || true; fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

dotnet run --project "Project Authentication.csproj" --no-launch-profile --urls "$API_PROXY_TARGET" &
backend_pid=$!

ready=false
for ((attempt = 0; attempt < 60; attempt++)); do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    echo "The backend could not start. Check its output above and README.md." >&2
    exit 1
  fi
  if curl --fail --silent --output /dev/null "$API_PROXY_TARGET/api/Projects/GetAllProject"; then
    ready=true
    break
  fi
  sleep 1
done

if [[ "$ready" != true ]]; then
  echo "The backend could not query PostgreSQL. Check the database connection setting." >&2
  exit 1
fi

echo "Frontend: http://localhost:$frontend_port/app/"
echo "Swagger:  $API_PROXY_TARGET/swagger"
echo "Press Ctrl+C to stop both servers."
npm --prefix client run dev -- --host localhost --port "$frontend_port" --strictPort &
frontend_pid=$!
wait "$frontend_pid"
