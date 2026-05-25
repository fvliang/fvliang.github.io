# OpenClaw (Docker) on Synology DSM Deployment Guide (Reproducible)

This document records the full set of actions taken from "starting deployment" to "working OpenClaw UI" on a Synology NAS (DSM) with Docker already installed.

It includes:
- Commands executed (chronological, including failed attempts and fixes)
- Files created/modified and exact content changes (with line numbers based on the final state)

Security note:
- Do NOT paste real secrets into this file. Replace placeholders only on the target NAS.
- Secrets involved in the original session included: NAS SSH password, `OPENAI_API_KEY`, and `OPENCLAW_GATEWAY_TOKEN`.

---

## 0. Assumptions / Prereqs

- Synology DSM with:
  - `docker` and `docker compose` available on the NAS (Compose v2)
  - outbound internet access (for `git clone`, Docker base images, npm/pnpm during build)
- You can SSH into the NAS as a user with `sudo` privileges.
- Ports:
  - You want to access OpenClaw UI via `http://<NAS_IP>:1871/` (host port `1871` -> container port `18789`).

---

## 1. What Was Deployed

- Repo cloned on NAS: `~/openclaw` (from `https://github.com/openclaw/openclaw.git`)
- Docker image built on NAS: `openclaw:local`
- Docker Compose used from `~/openclaw/docker-compose.yml`
- OpenClaw state on NAS host:
  - config dir: `~/.openclaw`
  - workspace dir: `~/.openclaw/workspace`

Model/provider configuration used (OpenAI-compatible endpoint):
- Provider id: `dashscope` (custom provider)
- Base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- API mode: `openai-completions`
- Model: `qwen3-max-2026-01-23`

Additional integrations enabled:
- Feishu channel (pairing-based access control)
- Media directory mount (read/write) for subtitles and file operations:
  - Host: `/volume1/WD_4T/pt/downloads/link`
  - Container: `/mnt/movies`
- Web search provider:
  - `web_search` provider switched to `serpapi` (Google engine) using `SERPAPI_API_KEY`

---

## 2. Files Created / Modified (Final State)

### 2.1 `~/openclaw/.env` (created)

Final file (line numbers from `nl -ba ~/openclaw/.env`, redacted):

1. `OPENCLAW_CONFIG_DIR=/var/services/homes/<USER>/.openclaw`
2. `OPENCLAW_WORKSPACE_DIR=/var/services/homes/<USER>/.openclaw/workspace`
3. `OPENCLAW_GATEWAY_PORT=1871`
4. `OPENCLAW_BRIDGE_PORT=18790`
5. `OPENCLAW_GATEWAY_BIND=lan`
6. `OPENCLAW_GATEWAY_TOKEN=<OPENCLAW_GATEWAY_TOKEN>`
7. `OPENCLAW_IMAGE=openclaw:local`
8. `OPENCLAW_EXTRA_MOUNTS=`
9. `OPENCLAW_HOME_VOLUME=`
10. `OPENCLAW_DOCKER_APT_PACKAGES=`
11. `OPENAI_MODEL_NAME=qwen3-max-2026-01-23`
12. `OPENAI_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1`
13. `OPENAI_API_KEY=<OPENAI_API_KEY>`
14. `FEISHU_APP_ID=<FEISHU_APP_ID>`
15. `FEISHU_APP_SECRET=<FEISHU_APP_SECRET>`
16. `FEISHU_DOMAIN=feishu`
17. *(blank line)*
18. `SERPAPI_API_KEY=<SERPAPI_API_KEY>`

Notes:
- In the original deployment the token and keys were real values. For reproduction, fill:
  - `<OPENCLAW_GATEWAY_TOKEN>`: generate with `openssl rand -hex 32`
  - `<OPENAI_API_KEY>`: your DashScope-compatible key
  - `<FEISHU_APP_ID>` / `<FEISHU_APP_SECRET>`: your Feishu app credentials
  - `<SERPAPI_API_KEY>`: your SerpApi key (Google engine)

### 2.2 `~/openclaw/docker-compose.yml` (modified)

Final file (line numbers from `nl -ba ~/openclaw/docker-compose.yml`).

Changes made vs upstream:
- Added environment variables to both `openclaw-gateway` and `openclaw-cli`:
  - `OPENAI_API_KEY`
  - `OPENAI_API_BASE`
  - `OPENAI_MODEL_NAME`
- Added Feishu channel env vars to both services:
  - `FEISHU_APP_ID`
  - `FEISHU_APP_SECRET`
  - `FEISHU_DOMAIN`
- Added SerpApi env var to both services:
  - `SERPAPI_API_KEY`
- Added media directory bind-mount to both services:
  - `/volume1/WD_4T/pt/downloads/link:/mnt/movies:rw`
- Port mapping is driven by `.env` via:
  - line 23: `- "${OPENCLAW_GATEWAY_PORT:-18789}:18789"`

Final relevant blocks:

`openclaw-gateway.environment` additions:
- line 11-13: `OPENAI_API_KEY` / `OPENAI_API_BASE` / `OPENAI_MODEL_NAME`
- line 14-16: `FEISHU_APP_ID` / `FEISHU_APP_SECRET` / `FEISHU_DOMAIN`
- line 17: `SERPAPI_API_KEY: ${SERPAPI_API_KEY}`

`openclaw-cli.environment` additions:
- line 48-50: `OPENAI_API_KEY` / `OPENAI_API_BASE` / `OPENAI_MODEL_NAME`
- line 51-53: `FEISHU_APP_ID` / `FEISHU_APP_SECRET` / `FEISHU_DOMAIN`
- line 54: `SERPAPI_API_KEY: ${SERPAPI_API_KEY}`

`volumes` mount:
- line 21: `- /volume1/WD_4T/pt/downloads/link:/mnt/movies:rw`

Backup created during the session:
- `~/openclaw/docker-compose.yml.bak*`

### 2.3 `~/.openclaw/openclaw.json` (modified/overwritten)

Final file (line numbers from `nl -ba ~/.openclaw/openclaw.json`, redacted).

Key changes:
- Set default model to a custom provider/model:
  - line 42-44: `"model": { "primary": "dashscope/qwen3-max-2026-01-23" }`
- Added custom provider `dashscope` using OpenAI-compatible API:
  - line 12-39: `"models": { "providers": { "dashscope": { ... } } }`
  - line 17: `"apiKey": "<REDACTED>"` (stored in `openclaw.json` in this deployment)
- Gateway configuration:
  - line 63: port `1871`
  - line 65: bind `lan`
  - line 69-72: token auth (`gateway.auth.token`)
- Allow HTTP access from IP address for Control UI (bypass secure-context requirement):
  - line 66-68: `"controlUi": { "allowInsecureAuth": true }`

- Feishu channel configuration:
  - line 85-97: `channels.feishu` uses env vars (`${FEISHU_APP_ID}`, `${FEISHU_APP_SECRET}`, `${FEISHU_DOMAIN}`)
- Web search provider switched to SerpApi:
  - line 98-109: `tools.web.search.provider="serpapi"` and `tools.web.search.serpapi.*`

Backup created during the session:
- `~/.openclaw/openclaw.json.bak` (created earlier when rewriting the file)

### 2.4 `/etc/ssh/sshd_config` and `/etc.defaults/ssh/sshd_config` (modified)

Goal: prevent SSH sessions dropping after a few minutes (NAT idle timeout) by enabling server keepalives.

Appended lines (tail shown by `nl -ba /etc/ssh/sshd_config | tail ...`):

- `# Keep SSH sessions alive through NAT/firewalls (Synology)`
- `TCPKeepAlive yes`
- `ClientAliveInterval 30`
- `ClientAliveCountMax 6`

Backups created during the session:
- `/etc/ssh/sshd_config.bak.<timestamp>`
- `/etc.defaults/ssh/sshd_config.bak.<timestamp>`

Service restart:
- `sudo systemctl restart sshd`

Verification:
- `sudo sshd -T | egrep -i 'clientalive|tcpkeepalive'`

### 2.5 `~/openclaw/src/agents/tools/web-search.ts` (modified)

Goal: add a new `web_search` provider: `serpapi` (calls `https://serpapi.com/search?engine=google`).

High-level changes (grep line numbers in the final file):
- line 20: `SEARCH_PROVIDERS` extended to include `"serpapi"`.
- line 26: `DEFAULT_SERPAPI_BASE_URL` added.
- line 161+: missing-key payload added for SerpApi.
- line 485+: `runWebSearch` accepts `serpapiBaseUrl` / `serpapiEngine`.
- line 521+: SerpApi request path and result mapping.

### 2.6 `~/openclaw/src/config/zod-schema.agent-runtime.ts` (modified)

Goal: make config validation accept:
- `tools.web.search.provider = "serpapi"`
- `tools.web.search.serpapi = { apiKey, baseUrl, engine }`

High-level changes (grep line numbers in the final file):
- line 174: provider union extended with `z.literal("serpapi")`.
- line 187+: added `serpapi` object schema under `ToolsWebSearchSchema`.

### 2.7 Synology ACL for media directory (modified)

Goal: allow the container user (uid 1000, `node`) to read/write the mounted folder:
- `/volume1/WD_4T/pt/downloads/link` (host)
- `/mnt/movies` (container)

Commands used:

```bash
# Verify container can see the mount
sudo docker compose run -T --rm openclaw-cli sh -lc 'ls -la /mnt/movies | head'

# Synology ACL: allow read/write for "everyone" (LAN-only trusted setup)
sudo synoacltool -add /volume1/WD_4T/pt/downloads/link everyone:*:allow:rwxpdDaARWc--:fd--

# Verify write
sudo docker compose run -T --rm openclaw-cli sh -lc 'echo test > /mnt/movies/.openclaw_write_test'
```

Important:
- Do **not** run `synoacltool -enforce-inherit` on this folder for this setup; it can remove the added ACE.

### 2.8 Passwordless SSH (authorized_keys) (modified)

Goal: enable key-based login for `ssh NAS` without typing the NAS password.

NAS file modified:
- `~/.ssh/authorized_keys` (appended your local `~/.ssh/id_rsa.pub` or equivalent)

Typical commands:

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -N '' -f ~/.ssh/id_rsa
ssh-copy-id -i ~/.ssh/id_rsa.pub NAS

# Or manually on the NAS
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat >> ~/.ssh/authorized_keys < ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/authorized_keys
```

---

## 3. Commands Executed (Chronological Log)

This is a best-effort chronological transcript of the commands used in the deployment session (including exploratory reads and failure paths). Replace placeholders when reproducing.

### 3.1 SSH into NAS

```bash
ssh NAS
```

### 3.2 Initial docs discovery (exploratory)

```bash
curl -L https://clawd-bot.com | head -n 120
curl -L https://raw.githubusercontent.com/clawdbot/clawdbot/main/README.md | head -n 200
```

### 3.3 Clone OpenClaw repo on NAS

```bash
rm -rf ~/openclaw
git clone --depth=1 https://github.com/openclaw/openclaw.git ~/openclaw
cd ~/openclaw
```

Explore docker docs:

```bash
find docs -type f | grep -Ei 'docker|install' | head -n 50
sed -n '1,240p' docs/install/docker.md
sed -n '1,220p' docker-compose.yml
```

### 3.4 Create `~/openclaw/.env`

Generated a gateway token:

```bash
openssl rand -hex 32
```

Wrote `.env` (template):

```bash
cd ~/openclaw
cat > .env <<'EOF'
OPENCLAW_CONFIG_DIR=$HOME/.openclaw
OPENCLAW_WORKSPACE_DIR=$HOME/.openclaw/workspace
OPENCLAW_GATEWAY_PORT=1871
OPENCLAW_BRIDGE_PORT=18790
OPENCLAW_GATEWAY_BIND=lan
OPENCLAW_GATEWAY_TOKEN=<OPENCLAW_GATEWAY_TOKEN>
OPENCLAW_IMAGE=openclaw:local
OPENCLAW_EXTRA_MOUNTS=
OPENCLAW_HOME_VOLUME=
OPENCLAW_DOCKER_APT_PACKAGES=
OPENAI_MODEL_NAME=qwen3-max-2026-01-23
OPENAI_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_API_KEY=<OPENAI_API_KEY>
EOF

mkdir -p "$HOME/.openclaw/workspace"
```

### 3.5 Modify `~/openclaw/docker-compose.yml` to pass OpenAI-compatible env vars

In the session this was done by creating a backup and using `awk` to insert lines after `CLAUDE_WEB_COOKIE`.

Repro-friendly edit method:

```bash
cd ~/openclaw
cp docker-compose.yml docker-compose.yml.bak
```

Then manually add the following lines to BOTH services under `environment:`:

```yaml
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      OPENAI_API_BASE: ${OPENAI_API_BASE}
      OPENAI_MODEL_NAME: ${OPENAI_MODEL_NAME}
```

### 3.6 Build Docker image (required sudo on Synology)

Initial failure encountered:
- `permission denied while trying to connect to the Docker daemon socket`

Fix: use sudo.

```bash
cd ~/openclaw
sudo docker build -t openclaw:local -f Dockerfile .
```

### 3.7 Run onboarding (non-interactive) inside container

First attempt failed because `docker-compose.yml` had `tty: true` and the environment was not a TTY:
- `the input device is not a TTY`

Fix: add `-T` to disable pseudo-tty:

```bash
cd ~/openclaw
OPENCLAW_GATEWAY_TOKEN="$(grep '^OPENCLAW_GATEWAY_TOKEN=' .env | cut -d= -f2-)"
OPENAI_API_KEY="$(grep '^OPENAI_API_KEY=' .env | cut -d= -f2-)"

sudo docker compose run -T --rm openclaw-cli onboard \
  --non-interactive --accept-risk \
  --auth-choice openai-api-key --openai-api-key "$OPENAI_API_KEY" \
  --gateway-bind lan --gateway-auth token --gateway-token "$OPENCLAW_GATEWAY_TOKEN" \
  --gateway-port 1871 \
  --skip-channels --skip-skills --skip-ui --skip-health
```

Next failure encountered:
- `EACCES: permission denied, open '/home/node/.openclaw/.env'`

Fix: `chown` the host bind-mount directories to uid/gid 1000 (container runs as `node`, uid 1000):

```bash
sudo chown -R 1000:1000 "$HOME/.openclaw"
```

Then rerun the onboarding command above.

### 3.8 Configure DashScope provider + default model in `~/.openclaw/openclaw.json`

In-session this was done by overwriting `~/.openclaw/openclaw.json` with a JSON including:
- `agents.defaults.model.primary = "dashscope/qwen3-max-2026-01-23"`
- `models.providers.dashscope.baseUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1"`
- `models.providers.dashscope.apiKey = "${OPENAI_API_KEY}"`
- `models.providers.dashscope.api = "openai-completions"`

Repro approach: edit `~/.openclaw/openclaw.json` to match the final structure shown in section 2.3, but keep secrets as `${OPENAI_API_KEY}` and token as `<OPENCLAW_GATEWAY_TOKEN>` then restart gateway.

### 3.9 Start gateway container and verify port mapping

```bash
cd ~/openclaw
sudo docker compose down --remove-orphans
sudo docker compose up -d openclaw-gateway
sudo docker compose ps
```

Expected `ps` ports include:
- `0.0.0.0:1871->18789/tcp`

Basic HTTP check:

```bash
curl -v http://127.0.0.1:1871/ | head -n 60
```

### 3.10 Verify model is registered

```bash
cd ~/openclaw
sudo docker compose run -T --rm openclaw-cli models list
```

Should show:
- `dashscope/qwen3-max-2026-01-23` and `Auth yes`

### 3.11 Generate a Control UI URL with token

```bash
cd ~/openclaw
sudo docker compose run -T --rm openclaw-cli dashboard --no-open
```

It prints a URL like:
- `http://127.0.0.1:1871/?token=<OPENCLAW_GATEWAY_TOKEN>`

Replace `127.0.0.1` with your NAS LAN IP.

### 3.12 Allow Control UI from `http://<NAS_IP>:1871/` (no HTTPS)

Issue encountered:
- `disconnected (1008): control ui requires HTTPS or localhost (secure context)`

Root cause:
- Gateway enforces a secure-context requirement by default for Control UI device/auth.

Fix applied:
- Set `gateway.controlUi.allowInsecureAuth=true` in `~/.openclaw/openclaw.json`, then restart gateway.

Command used:

```bash
python3 - <<'PY'
import json, os
p=os.path.expanduser('~/.openclaw/openclaw.json')
with open(p,'r',encoding='utf-8') as f:
  cfg=json.load(f)
gw=cfg.setdefault('gateway',{})
cu=gw.setdefault('controlUi',{})
cu['allowInsecureAuth']=True
with open(p,'w',encoding='utf-8') as f:
  json.dump(cfg,f,ensure_ascii=True,indent=2)
  f.write('\n')
print('updated',p)
PY

cd ~/openclaw
sudo docker compose restart openclaw-gateway
```

### 3.13 (Optional) Fix SSH disconnecting after a few minutes (server-side keepalives)

Goal:
- prevent idle SSH sessions from being killed by NAT/firewalls.

Commands used (high level):

```bash
sudo -v

# backup + append keepalive config to both files:
# /etc/ssh/sshd_config and /etc.defaults/ssh/sshd_config

sudo systemctl restart sshd
sudo sshd -T | egrep -i 'clientalive|tcpkeepalive'
```

Appended config:

```text
TCPKeepAlive yes
ClientAliveInterval 30
ClientAliveCountMax 6
```

### 3.14 (Optional) Configure Feishu channel + approve pairing

1. Add Feishu env vars into `~/openclaw/.env` (section 2.1) and propagate them into Compose `environment:` (section 2.2).
2. Ensure Feishu plugin is enabled in `~/.openclaw/openclaw.json`:
   - `plugins.entries.feishu.enabled=true`
   - `channels.feishu.enabled=true`
3. Restart gateway:

```bash
cd ~/openclaw
sudo docker compose up -d --force-recreate
```

4. In Feishu, after you message the bot, OpenClaw returns a pairing code like:
   - `Pairing code: <CODE>`
5. Approve it from the NAS:

```bash
cd ~/openclaw
sudo docker compose run -T --rm openclaw-cli pairing approve feishu <CODE>
```

### 3.15 (Optional) Mount media folder with write access (Synology ACL)

1. Add the bind-mount in `~/openclaw/docker-compose.yml` for both services:
   - `/volume1/WD_4T/pt/downloads/link:/mnt/movies:rw`
2. Synology ACL fix (allows container user to write):

```bash
sudo synoacltool -add /volume1/WD_4T/pt/downloads/link everyone:*:allow:rwxpdDaARWc--:fd--
```

3. Verify write from container:

```bash
cd ~/openclaw
sudo docker compose run -T --rm openclaw-cli sh -lc 'echo test > /mnt/movies/.openclaw_write_test'
```

### 3.16 Add SerpApi web_search provider + enable it

1. Patch source code (sections 2.5-2.6):
   - `~/openclaw/src/agents/tools/web-search.ts`
   - `~/openclaw/src/config/zod-schema.agent-runtime.ts`
2. Add `SERPAPI_API_KEY=<SERPAPI_API_KEY>` to `~/openclaw/.env`.
3. Add `SERPAPI_API_KEY: ${SERPAPI_API_KEY}` to both services in `~/openclaw/docker-compose.yml`.
4. Set `~/.openclaw/openclaw.json`:

```json5
{
  tools: {
    web: {
      search: {
        provider: "serpapi",
        serpapi: {
          apiKey: "${SERPAPI_API_KEY}",
          baseUrl: "https://serpapi.com/search",
          engine: "google",
        },
      },
    },
  },
}
```

5. Rebuild and restart:

```bash
cd ~/openclaw
sudo docker build -t openclaw:local .
sudo docker compose up -d --force-recreate
sudo docker compose ps
```

If you forget step (2.6) (schema update), the gateway can get stuck in a restart loop with errors like:
- `tools.web.search.provider: Invalid input`
- `tools.web.search: Unrecognized key: "serpapi"`
Fix: patch `zod-schema.agent-runtime.ts`, rebuild, and restart again.

---

## 4. Reproduction Checklist (On a Fresh Synology NAS)

1. SSH in; ensure Docker works with sudo:
   - `sudo docker ps`
2. Clone repo:
   - `git clone --depth=1 https://github.com/openclaw/openclaw.git ~/openclaw`
3. Create `~/openclaw/.env` (section 2.1) and fill in:
   - `<OPENAI_API_KEY>`
   - `<OPENCLAW_GATEWAY_TOKEN>` (generate)
   - `<SERPAPI_API_KEY>` (if using SerpApi web_search)
   - `<FEISHU_APP_ID>` / `<FEISHU_APP_SECRET>` (if using Feishu)
4. Modify `~/openclaw/docker-compose.yml` to pass the OpenAI-compatible env vars (section 2.2).
   - also add `SERPAPI_API_KEY` and `FEISHU_*` env vars if you will use those integrations
5. Build image:
   - `sudo docker build -t openclaw:local -f ~/openclaw/Dockerfile ~/openclaw`
6. Fix permissions for bind mounts:
   - `sudo mkdir -p ~/.openclaw ~/.openclaw/workspace`
   - `sudo chown -R 1000:1000 ~/.openclaw`
7. Run non-interactive onboarding:
   - use the `docker compose run -T ... onboard ...` command from section 3.7
8. Edit `~/.openclaw/openclaw.json` to include:
   - provider `dashscope` with baseUrl and api mode
   - default model `dashscope/qwen3-max-2026-01-23`
   - `gateway.port=1871`
   - `gateway.controlUi.allowInsecureAuth=true`
   - `tools.web.search.provider="serpapi"` (if enabling SerpApi)
   - `channels.feishu` (if enabling Feishu)
9. Start gateway:
   - `sudo docker compose -f ~/openclaw/docker-compose.yml up -d openclaw-gateway`
10. Open UI:
   - `http://<NAS_IP>:1871/?token=<OPENCLAW_GATEWAY_TOKEN>`

---

## 5. Notes / Known Gotchas

- `docker compose run` may fail with `the input device is not a TTY` because `openclaw-cli` has `tty: true`. Use `docker compose run -T ...` for non-interactive runs.
- Permission errors under `/home/node/.openclaw` are fixed by making the host bind mount owned by uid 1000:
  - `sudo chown -R 1000:1000 ~/.openclaw`
- Allowing `gateway.controlUi.allowInsecureAuth=true` reduces security; use only on trusted LAN.
- SerpApi support required patching OpenClaw source + rebuilding `openclaw:local` (sections 2.5-2.6).
