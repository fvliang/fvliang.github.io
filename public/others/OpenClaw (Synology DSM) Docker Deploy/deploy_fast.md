# OpenClaw (Synology DSM) Docker Deploy (Fast)

Goal: from zero to a working OpenClaw UI at `http://<NAS_IP>:1871/` with:
- DashScope (OpenAI-compatible) model: `qwen3-max-2026-01-23`
- Feishu enabled (optional)
- Media folder mounted RW: `/volume1/WD_4T/pt/downloads/link` -> `/mnt/movies`
- `web_search` provider: SerpApi (Google engine) (optional, requires source patch + rebuild)

All commands below run on the NAS via SSH, unless noted.

Security: replace placeholders (`<...>`) only on the NAS. Do not commit secrets.

---

## 1. Clone Repo

```bash
rm -rf ~/openclaw
git clone --depth=1 https://github.com/openclaw/openclaw.git ~/openclaw
cd ~/openclaw
```

## 2. Create `~/openclaw/.env`

Generate a gateway token:

```bash
openssl rand -hex 32
```

Create `.env`:

```bash
cat > ~/openclaw/.env <<'EOF'
OPENCLAW_CONFIG_DIR=/var/services/homes/<USER>/.openclaw
OPENCLAW_WORKSPACE_DIR=/var/services/homes/<USER>/.openclaw/workspace
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

FEISHU_APP_ID=<FEISHU_APP_ID>
FEISHU_APP_SECRET=<FEISHU_APP_SECRET>
FEISHU_DOMAIN=feishu

SERPAPI_API_KEY=<SERPAPI_API_KEY>
EOF
```

Create state dirs + fix bind-mount ownership (container runs as uid 1000):

```bash
mkdir -p /var/services/homes/<USER>/.openclaw/workspace
sudo chown -R 1000:1000 /var/services/homes/<USER>/.openclaw
```

## 3. Modify `~/openclaw/docker-compose.yml`

1. Backup:

```bash
cd ~/openclaw
cp -a docker-compose.yml docker-compose.yml.bak
```

2. Edit both `openclaw-gateway.environment` and `openclaw-cli.environment` to include:

```yaml
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      OPENAI_API_BASE: ${OPENAI_API_BASE}
      OPENAI_MODEL_NAME: ${OPENAI_MODEL_NAME}
      FEISHU_APP_ID: ${FEISHU_APP_ID}
      FEISHU_APP_SECRET: ${FEISHU_APP_SECRET}
      FEISHU_DOMAIN: ${FEISHU_DOMAIN}
      SERPAPI_API_KEY: ${SERPAPI_API_KEY}
```

3. Add the media mount under `volumes:` for both services:

```yaml
      - /volume1/WD_4T/pt/downloads/link:/mnt/movies:rw
```

## 4. Create/Update `~/.openclaw/openclaw.json`

Edit (or overwrite) `/var/services/homes/<USER>/.openclaw/openclaw.json` to include at least:

```json5
{
  "models": {
    "mode": "merge",
    "providers": {
      "dashscope": {
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "apiKey": "<OPENAI_API_KEY>",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3-max-2026-01-23",
            "name": "Qwen3 Max (2026-01-23)",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": { "defaults": { "model": { "primary": "dashscope/qwen3-max-2026-01-23" } } },
  "gateway": {
    "port": 1871,
    "mode": "local",
    "bind": "lan",
    "controlUi": { "allowInsecureAuth": true },
    "auth": { "mode": "token", "token": "<OPENCLAW_GATEWAY_TOKEN>" }
  },
  "tools": { "web": { "search": { "provider": "brave" } } }
}
```

Note:
- If you want Feishu, add the `plugins.entries.feishu` + `channels.feishu` blocks (see section 7).
- If you want SerpApi `web_search`, do NOT set it here until section 8 is done (or the gateway can crash-loop).

## 5. Build Image + Start Containers

Build:

```bash
cd ~/openclaw
sudo /usr/local/bin/docker build -t openclaw:local .
```

Start:

```bash
cd ~/openclaw
sudo /usr/local/bin/docker compose up -d --force-recreate
sudo /usr/local/bin/docker compose ps
```

Verify ports include `0.0.0.0:1871->18789/tcp`.

Open UI URL (prints a localhost URL; replace host with NAS IP):

```bash
cd ~/openclaw
sudo /usr/local/bin/docker compose run -T --rm openclaw-cli dashboard --no-open
```

## 6. Synology ACL (Media Folder RW)

Allow write (trusted LAN only):

```bash
sudo synoacltool -add /volume1/WD_4T/pt/downloads/link everyone:*:allow:rwxpdDaARWc--:fd--
```

Verify write from container:

```bash
cd ~/openclaw
sudo /usr/local/bin/docker compose run -T --rm openclaw-cli sh -lc 'echo test > /mnt/movies/.openclaw_write_test'
```

## 7. Feishu Pairing Approve (When You See a Pairing Code)

Enable Feishu in `/var/services/homes/<USER>/.openclaw/openclaw.json`:

```json5
{
  plugins: { entries: { feishu: { enabled: true } } },
  channels: {
    feishu: {
      enabled: true,
      dmPolicy: "pairing",
      accounts: { main: { appId: "${FEISHU_APP_ID}", appSecret: "${FEISHU_APP_SECRET}" } },
      domain: "${FEISHU_DOMAIN}",
    },
  },
}
```

Restart:

```bash
cd ~/openclaw
sudo /usr/local/bin/docker compose up -d --force-recreate
```

When Feishu chat replies with `Pairing code: <CODE>`:

```bash
cd ~/openclaw
sudo /usr/local/bin/docker compose run -T --rm openclaw-cli pairing approve feishu <CODE>
```

## 8. (Optional) Enable SerpApi `web_search` (Requires Source Patch + Rebuild)

If you set `tools.web.search.provider="serpapi"` in `openclaw.json`, you must patch OpenClaw source
to add the provider and update config validation, then rebuild.

Files to modify:
- `~/openclaw/src/agents/tools/web-search.ts` (add provider + HTTP call + mapping)
- `~/openclaw/src/config/zod-schema.agent-runtime.ts` (allow `"serpapi"` and `tools.web.search.serpapi`)

Then set `/var/services/homes/<USER>/.openclaw/openclaw.json`:

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

Then:

```bash
cd ~/openclaw
sudo /usr/local/bin/docker build -t openclaw:local .
sudo /usr/local/bin/docker compose up -d --force-recreate
sudo /usr/local/bin/docker compose ps
```

If the gateway enters a restart loop, check logs:

```bash
cd ~/openclaw
sudo /usr/local/bin/docker compose logs --tail=200 openclaw-gateway
```

Common cause: schema not updated; fix `zod-schema.agent-runtime.ts`, rebuild, restart.
