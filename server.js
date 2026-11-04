const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const CONFIG_FILE = path.join(ROOT, ".mp-config.json");
const USERS_FILE = path.join(ROOT, ".users.json");

// Lê ou inicializa a base de clientes cadastrados por e-mail
function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    }
  } catch {}
  saveUsers([]);
  return [];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch {}
}

// Lê ou inicializa a configuração segura do servidor (com segredo criptográfico HMAC-SHA256 para assinar licenças)
function getServerConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      let changed = false;
      if (!parsed.hmacSecret) {
        parsed.hmacSecret = crypto.randomBytes(32).toString("hex");
        changed = true;
      }
      if (!parsed.adminPassword) {
        parsed.adminPassword = "admin1977";
        changed = true;
      }
      if (changed) saveServerConfig(parsed);
      return parsed;
    }
  } catch {}
  const initial = {
    mpAccessToken: process.env.MP_ACCESS_TOKEN || "",
    hmacSecret: crypto.randomBytes(32).toString("hex"),
    adminPassword: "admin1977",
  };
  saveServerConfig(initial);
  return initial;
}

function saveServerConfig(cfg) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), "utf8");
  } catch {}
}

// Gera um Token de Licença assinado criptograficamente pelo servidor (impossível de falsificar no navegador)
function issueSignedLicense(plan, paymentId) {
  const cfg = getServerConfig();
  const payload = JSON.stringify({
    plan,
    paymentId: String(paymentId || "verified"),
    issuedAt: Date.now(),
  });
  const b64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", cfg.hmacSecret).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

function verifySignedLicense(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [b64, sig] = token.split(".");
  const cfg = getServerConfig();
  const expected = crypto.createHmac("sha256", cfg.hmacSecret).update(b64).digest("base64url");
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
};

function stripHtmlToText(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);

  let jsonLdText = "";
  const ldMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of ldMatches) {
    const inner = block.replace(/<script[^>]*>|<\/script>/gi, "");
    try {
      const parsed = JSON.parse(inner);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const it of items) {
        if (it && (it["@type"] === "JobPosting" || it.title || it.description)) {
          jsonLdText += `${it.title || ""}\n${it.description || ""}\n${it.skills || ""}\n${it.qualifications || ""}\n`;
        }
      }
    } catch {}
  }

  const bodyClean = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(br|p|div|li|h[1-6]|tr)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();

  const parts = [
    titleMatch ? titleMatch[1].trim() : "",
    descMatch ? descMatch[1].trim() : "",
    jsonLdText.replace(/<[^>]+>/g, " ").trim(),
    bodyClean.slice(0, 12000),
  ].filter(Boolean);

  return {
    title: titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "",
    text: parts.join("\n\n").trim(),
  };
}

// Consulta oficial à API do Mercado Pago para validar se um pagamento é real e está aprovado (approved)
async function verifyMercadoPagoPayment({ paymentId, orderId, mpAccessToken }) {
  if (!mpAccessToken) {
    return { verified: false, reason: "missing_token" };
  }
  // 1) Se informou um payment_id específico (vindo do retorno automático do Mercado Pago ou comprovante)
  if (paymentId && /^\d+$/.test(String(paymentId).trim())) {
    const resp = await fetch(`https://api.mercadopago.com/v1/payments/${String(paymentId).trim()}`, {
      headers: { Authorization: `Bearer ${mpAccessToken}` },
    });
    if (!resp.ok) return { verified: false, reason: "not_found" };
    const pay = await resp.json();
    if (pay.status === "approved") {
      const amount = Number(pay.transaction_amount || 0);
      const plan = amount >= 25 ? "pro" : "avulso";
      const licenseToken = issueSignedLicense(plan, pay.id);
      const payerEmail = (pay.payer && pay.payer.email) ? pay.payer.email.toLowerCase().trim() : "";
      if (payerEmail) {
        const users = getUsers();
        let u = users.find((x) => x.email.toLowerCase() === payerEmail);
        if (!u) {
          u = { email: payerEmail, plan, grantedAt: new Date().toISOString(), notes: `Pagamento Mercado Pago (#${pay.id})` };
          users.push(u);
        } else {
          u.plan = plan;
          u.grantedAt = new Date().toISOString();
          u.notes = `Upgrade Mercado Pago (#${pay.id})`;
          u.expiresAt = null;
        }
        saveUsers(users);
      }
      return { verified: true, plan, paymentId: pay.id, amount, licenseToken, payerEmail };
    }
    return { verified: false, status: pay.status };
  }

  // 2) Busca pagamentos recém-aprovados dos links oficiais (R$ 19,90 = Intermediário / R$ 29,90 = Pro Completo)
  const searchUrl = `https://api.mercadopago.com/v1/payments/search?sort=date_approved&criteria=desc&status=approved&limit=10`;

  const resp = await fetch(searchUrl, { headers: { Authorization: `Bearer ${mpAccessToken}` } });
  if (!resp.ok) return { verified: false, reason: "search_error" };
  const data = await resp.json();
  const recent = (data.results || []).find((p) => {
    const approvedTime = new Date(p.date_approved || p.date_created).getTime();
    return Date.now() - approvedTime < 20 * 60 * 1000 && Number(p.transaction_amount) >= 19;
  });
  if (recent) {
    const amount = Number(recent.transaction_amount || 0);
    const plan = amount >= 25 ? "pro" : "avulso";
    const licenseToken = issueSignedLicense(plan, recent.id);
    const payerEmail = (recent.payer && recent.payer.email) ? recent.payer.email.toLowerCase().trim() : "";
    if (payerEmail) {
      const users = getUsers();
      let u = users.find((x) => x.email.toLowerCase() === payerEmail);
      if (!u) {
        u = { email: payerEmail, plan, grantedAt: new Date().toISOString(), notes: `Pagamento Mercado Pago (#${recent.id})` };
        users.push(u);
      } else {
        u.plan = plan;
        u.grantedAt = new Date().toISOString();
        u.notes = `Upgrade Mercado Pago (#${recent.id})`;
        u.expiresAt = null;
      }
      saveUsers(users);
    }
    return { verified: true, plan, paymentId: recent.id, amount, licenseToken, payerEmail };
  }
  return { verified: false, reason: "no_recent_approved" };
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || "/", `http://localhost:${PORT}`);

  // 1) Cria link de Checkout dinâmico vinculado ao pedido do usuário (com auto_return) se o Access Token estiver configurado
  if (parsedUrl.pathname === "/api/create-checkout" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { plan, orderId, origin } = JSON.parse(body || "{}");
        const cfg = getServerConfig();
        const fallbackUrl = plan === "avulso" ? "https://mpago.la/1BaWCc3" : "https://mpago.la/2JuwzB7";
        if (!cfg.mpAccessToken) {
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ checkoutUrl: fallbackUrl, mode: "static_link" }));
        }
        const isPro = plan === "pro";
        const backUrl = `${origin || `http://localhost:${PORT}`}/?order_id=${encodeURIComponent(orderId || "")}`;
        const prefResp = await fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cfg.mpAccessToken}`,
          },
          body: JSON.stringify({
            items: [
              {
                title: isPro
                  ? "Adapta Currículo — Plano Pro Completo Vitalício (Pagamento Único)"
                  : "Adapta Currículo — Plano Intermediário Avulso (Pagamento Único)",
                quantity: 1,
                currency_id: "BRL",
                unit_price: isPro ? 29.9 : 19.9,
              },
            ],
            external_reference: String(orderId || Date.now()),
            back_urls: { success: backUrl, pending: backUrl, failure: backUrl },
            auto_return: "approved",
          }),
        });
        if (prefResp.ok) {
          const pref = await prefResp.json();
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ checkoutUrl: pref.init_point || fallbackUrl, mode: "dynamic_preference" }));
        }
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify({ checkoutUrl: fallbackUrl, mode: "static_link" }));
      } catch {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify({ checkoutUrl: "https://mpago.la/2JuwzB7", mode: "static_link" }));
      }
    });
    return;
  }

  // 2) Endpoint para validar pagamento direto na API oficial do Mercado Pago + emitir Licença Criptográfica
  if (parsedUrl.pathname === "/api/verify-payment") {
    const paymentId = parsedUrl.searchParams.get("payment_id") || "";
    const orderId = parsedUrl.searchParams.get("order_id") || "";
    const cfg = getServerConfig();
    try {
      const result = await verifyMercadoPagoPayment({ paymentId, orderId, mpAccessToken: cfg.mpAccessToken });
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ ...result, hasTokenConfigured: Boolean(cfg.mpAccessToken) }));
    } catch {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ verified: false, error: "Erro ao consultar Mercado Pago" }));
    }
  }

  // 3) Endpoint para verificar se o Token de Licença salvo no navegador do cliente é autêntico (Antifraude contra F12/localStorage)
  if (parsedUrl.pathname === "/api/validate-license") {
    const token = parsedUrl.searchParams.get("token") || "";
    const data = verifySignedLicense(token);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify({ valid: Boolean(data), plan: data ? data.plan : "free" }));
  }

  // 3.1) Endpoint para o usuário vincular seu e-mail / rede social e carregar o plano ativo (com suporte a teste temporário)
  if (parsedUrl.pathname === "/api/check-email" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { email, name, provider } = JSON.parse(body || "{}");
        const cleanEmail = (email || "").trim().toLowerCase();
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ ok: false, error: "E-mail inválido" }));
        }
        const users = getUsers();
        let u = users.find((x) => x.email.toLowerCase() === cleanEmail);
        const nowIso = new Date().toISOString();
        if (!u) {
          // Cadastra novo lead como plano grátis
          u = {
            email: cleanEmail,
            name: (name || cleanEmail.split("@")[0]).trim(),
            provider: provider || "email",
            plan: "free",
            createdAt: nowIso,
            lastLogin: nowIso,
          };
          users.push(u);
          saveUsers(users);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ ok: true, plan: "free", isNew: true, email: cleanEmail, name: u.name, provider: u.provider }));
        }

        // Atualiza nome, provedor e timestamp de login
        if (name && (!u.name || u.name === cleanEmail.split("@")[0])) u.name = name.trim();
        if (provider) u.provider = provider;
        u.lastLogin = nowIso;
        saveUsers(users);

        // Se tiver prazo de expiração (teste cortesia)
        if (u.expiresAt) {
          if (Date.now() > Number(u.expiresAt)) {
            u.plan = "free";
            u.expired = true;
            saveUsers(users);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            return res.end(JSON.stringify({ ok: true, plan: "free", expired: true, email: cleanEmail, name: u.name, provider: u.provider }));
          }
          const daysLeft = Math.ceil((Number(u.expiresAt) - Date.now()) / (24 * 60 * 60 * 1000));
          const licenseToken = issueSignedLicense(u.plan, "trial-" + cleanEmail);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ ok: true, plan: u.plan, isTrial: true, daysLeft, licenseToken, email: cleanEmail, name: u.name, provider: u.provider }));
        }
        // Plano definitivo (avulso, pro ou free)
        const licenseToken = u.plan !== "free" ? issueSignedLicense(u.plan, "email-" + cleanEmail) : null;
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify({ ok: true, plan: u.plan, licenseToken, email: cleanEmail, name: u.name, provider: u.provider, isVitalicio: u.plan !== "free" }));
      } catch {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify({ ok: false, error: "Erro interno no servidor" }));
      }
    });
    return;
  }

  // 3.2) Autenticação do Administrador com Senha Mestra
  if (parsedUrl.pathname === "/api/admin/auth" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { password } = JSON.parse(body || "{}");
        const cfg = getServerConfig();
        const valid = password && password === cfg.adminPassword;
        res.writeHead(valid ? 200 : 401, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: valid }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  // 3.3) Listar clientes cadastrados (Exclusivo Administrador)
  if (parsedUrl.pathname === "/api/admin/users" && req.method === "GET") {
    const auth = req.headers["x-admin-key"] || parsedUrl.searchParams.get("key") || "";
    const cfg = getServerConfig();
    if (auth !== cfg.adminPassword) {
      res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ ok: false, error: "Senha de administrador incorreta" }));
    }
    const users = getUsers().map((u) => {
      let isExpired = false;
      let daysLeft = null;
      if (u.expiresAt) {
        if (Date.now() > Number(u.expiresAt)) {
          isExpired = true;
          daysLeft = 0;
        } else {
          daysLeft = Math.ceil((Number(u.expiresAt) - Date.now()) / (24 * 60 * 60 * 1000));
        }
      }
      return { ...u, isExpired, daysLeft };
    });
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify({ ok: true, users }));
  }

  // 3.4) Criar, Liberar ou Alterar Licença de Cliente (Exclusivo Administrador)
  if (parsedUrl.pathname === "/api/admin/users" && req.method === "POST") {
    const auth = req.headers["x-admin-key"] || "";
    const cfg = getServerConfig();
    if (auth !== cfg.adminPassword) {
      res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ ok: false, error: "Senha de administrador incorreta" }));
    }
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { email, plan, days, notes } = JSON.parse(body || "{}");
        const cleanEmail = (email || "").trim().toLowerCase();
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ ok: false, error: "E-mail inválido" }));
        }
        const users = getUsers();
        let u = users.find((x) => x.email.toLowerCase() === cleanEmail);
        const expiresAt = days && Number(days) > 0 ? Date.now() + Number(days) * 24 * 60 * 60 * 1000 : null;
        if (!u) {
          u = {
            email: cleanEmail,
            plan: plan || "pro",
            grantedAt: new Date().toISOString(),
            expiresAt,
            notes: notes || "Liberado manualmente pelo administrador",
          };
          users.unshift(u);
        } else {
          u.plan = plan || "pro";
          u.expiresAt = expiresAt;
          u.grantedAt = new Date().toISOString();
          if (notes) u.notes = notes;
        }
        saveUsers(users);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: true, user: u, users }));
      } catch {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: false, error: "Erro ao salvar cliente" }));
      }
    });
    return;
  }

  // 3.5) Excluir Cliente (Exclusivo Administrador)
  if (parsedUrl.pathname === "/api/admin/users" && req.method === "DELETE") {
    const auth = req.headers["x-admin-key"] || "";
    const cfg = getServerConfig();
    if (auth !== cfg.adminPassword) {
      res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ ok: false, error: "Senha de administrador incorreta" }));
    }
    const emailToDelete = (parsedUrl.searchParams.get("email") || "").toLowerCase().trim();
    let users = getUsers();
    users = users.filter((x) => x.email.toLowerCase() !== emailToDelete);
    saveUsers(users);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify({ ok: true, users }));
  }

  // 3.6) Trocar Senha Mestra do Administrador
  if (parsedUrl.pathname === "/api/admin/change-password" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { currentPassword, newPassword } = JSON.parse(body || "{}");
        const cfg = getServerConfig();
        if (currentPassword !== cfg.adminPassword) {
          res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ ok: false, error: "Senha atual incorreta" }));
        }
        if (!newPassword || newPassword.length < 4) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify({ ok: false, error: "Nova senha deve ter pelo menos 4 caracteres" }));
        }
        cfg.adminPassword = newPassword.trim();
        saveServerConfig(cfg);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: false, error: "Erro ao trocar senha" }));
      }
    });
    return;
  }

  // 4) Endpoint para o Administrador salvar configurações e emitir licença de teste assinada
  if (parsedUrl.pathname === "/api/admin-config" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const cfg = getServerConfig();
        if (typeof payload.mpAccessToken === "string" && payload.mpAccessToken.trim()) {
          cfg.mpAccessToken = payload.mpAccessToken.trim();
          saveServerConfig(cfg);
        }
        let testLicense = null;
        if (payload.adminPlan === "avulso" || payload.adminPlan === "pro") {
          testLicense = issueSignedLicense(payload.adminPlan, "admin-grant");
        }
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: true, hasTokenConfigured: Boolean(cfg.mpAccessToken), licenseToken: testLicense }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  // 5) Endpoint para buscar e extrair o conteúdo de um link de vaga
  if (parsedUrl.pathname === "/api/fetch-job") {
    const targetUrl = parsedUrl.searchParams.get("url");
    if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ error: "Informe um link válido começando com http:// ou https://" }));
    }
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        },
        redirect: "follow",
      });
      const html = await response.text();
      const extracted = stripHtmlToText(html);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(extracted));
    } catch {
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(
        JSON.stringify({
          error: "Não foi possível ler este link diretamente (o site da vaga exige login). Cole o texto da vaga abaixo.",
        })
      );
    }
  }

  const cleanUrl = parsedUrl.pathname;
  const relPath = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const filePath = path.join(ROOT, path.normalize(relPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Arquivo não encontrado");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
});

// Inicialização imediata das configurações e base de usuários
getServerConfig();
getUsers();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✅ Adapta Currículo rodando em: http://localhost:${PORT}\n`);
});
