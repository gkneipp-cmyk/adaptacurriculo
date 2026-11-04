// Script gerador de exemplo completo de Currículo Lattes (CNPq) em PDF e Word (.docx)
// Usa pacotes vía CDN em memória ou gera diretamente um PDF válido e um DOCX/RTF compatível com Word sem dependências externas.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT_DIR = __dirname;

// Dados fictícios completos no padrão oficial da Plataforma Lattes (CNPq)
const LATTES = {
  nome: "Dr. Rafael Henrique Albuquerque Mendes",
  citacoes: "MENDES, R. H. A.; MENDES, Rafael Henrique Albuquerque; ALBUQUERQUE MENDES, R. H.",
  idLattes: "8492017492038471",
  urlLattes: "http://lattes.cnpq.br/8492017492038471",
  orcid: "https://orcid.org/0000-0002-8492-1940",
  atualizacao: "02/11/2026",
  cidade: "São Paulo, SP",
  email: "rafael.mendes.pesquisa@usp.br",
  telefone: "(11) 98412-7730",
  linkedin: "linkedin.com/in/rafaelmendes-phd",
  enderecoProf:
    "Universidade de São Paulo (USP), Instituto de Ciências Biomédicas e Biotecnologia. Av. Prof. Lineu Prestes, 1524 - Butantã, CEP 05508-000 - São Paulo, SP - Brasil.",
  resumo:
    "Possui graduação em Biotecnologia pela Universidade Federal de Minas Gerais (2018), mestrado em Ciências Biológicas (Biologia Molecular) pela Universidade Estadual de Campinas (2021) e doutorado em Biotecnologia e Bioinformática pela Universidade de São Paulo (2025), com período sanduíche no Broad Institute of MIT and Harvard (Bolsista CAPES/PDSE). Atualmente é pesquisador de Pós-Doutorado (Bolsista FAPESP) na Universidade de São Paulo e docente colaborador na pós-graduação. Tem experiência na área de Genética, Bioinformática e Inteligência Artificial Aplicada à Saúde, atuando principalmente nos seguintes temas: sequenciamento de nova geração (NGS), transcriptômica espacial, biomarcadores oncológicos e aprendizado de máquina.",
  formacao: [
    {
      periodo: "2021 - 2025",
      titulo: "Doutorado em Biotecnologia e Bioinformática",
      instituicao: "Universidade de São Paulo (USP), São Paulo, Brasil",
      detalhes: [
        "Período sanduíche no Broad Institute of MIT and Harvard (Orientador no exterior: Dr. Eric Lander).",
        "Título da Tese: Integração de Transcriptômica Espacial e Aprendizado Profundo para Predição de Resposta Imunoterápica em Carcinomas.",
        "Orientador(a): Profa. Dra. Helena Maria de Vasconcelos.",
        "Bolsista do(a): Fundação de Amparo à Pesquisa do Estado de São Paulo (FAPESP), Processo nº 2021/09842-3.",
        "Palavras-chave: Bioinformática; Transcriptômica; Aprendizado de Máquina; Oncologia Molecular.",
      ],
    },
    {
      periodo: "2019 - 2021",
      titulo: "Mestrado em Ciências Biológicas (Biologia Molecular) — Conceito CAPES 7",
      instituicao: "Universidade Estadual de Campinas (UNICAMP), Campinas, Brasil",
      detalhes: [
        "Título da Dissertação: Análise de Redes Gênicas Reguladoras em Linhagens Celulares Resistentes a Quimioterápicos.",
        "Orientador(a): Prof. Dr. Carlos Eduardo Nogueira.",
        "Bolsista do(a): Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq).",
      ],
    },
    {
      periodo: "2014 - 2018",
      titulo: "Graduação em Biotecnologia",
      instituicao: "Universidade Federal de Minas Gerais (UFMG), Belo Horizonte, Brasil",
      detalhes: [
        "Título do Trabalho de Conclusão de Curso: Pipeline Automatizado em Python e R para Controle de Qualidade de Dados de RNA-Seq.",
        "Orientador(a): Profa. Dra. Luciana Ribeiro Campos.",
        "Bolsista de Iniciação Científica (PIBIC/CNPq - 2015 a 2018).",
      ],
    },
  ],
  atuacao: [
    {
      instituicao: "Universidade de São Paulo (USP), Brasil",
      periodo: "2025 - Atual",
      vinculo: "Bolsista de Pós-Doutorado (FAPESP), Dedicação Exclusiva (40h)",
      atividades: [
        "Pesquisa e desenvolvimento no Laboratório de Genômica Computacional e Medicina de Precisão.",
        "Coorientação de 3 alunos de Mestrado e 2 alunos de Iniciação Científica (PIBIC).",
        "Docência na disciplina de pós-graduação BMM-5820: Métodos Computacionais em Biologia Sistêmica.",
      ],
    },
    {
      instituicao: "Hospital Israelita Albert Einstein — Instituto de Pesquisa, Brasil",
      periodo: "2020 - 2021",
      vinculo: "Pesquisador Bioinformata Júnior (CLT, 40h)",
      atividades: [
        "Processamento e análise estatística de coortes clínicas de sequenciamento exômico e RNA-Seq.",
        "Desenvolvimento de relatórios automatizados de variantes genômicas para suporte à decisão clínica.",
        "Validação de pipelines em ambientes de computação em nuvem (AWS / Linux HPC).",
      ],
    },
    {
      instituicao: "Universidade Federal de Minas Gerais (UFMG), Brasil",
      periodo: "2016 - 2018",
      vinculo: "Monitor de Graduação e Bolsista de Iniciação Científica (PIBIC/CNPq, 20h)",
      atividades: [
        "Monitoria acadêmica nas disciplinas de Bioestatística e Genética Molecular.",
        "Execução de experimentos de extração de ácidos nucleicos, PCR em tempo real (qPCR) e análise de dados.",
      ],
    },
  ],
  projetos: [
    "2024 - Atual: Atlas Multi-Ômico de Tumores Sólidos na População Brasileira (Financiador: FAPESP / Ministério da Saúde). Função: Pesquisador Principal Adjunto.",
    "2021 - 2024: Modelos Preditivos Baseados em IA para Diagnóstico Precoce em Oncologia (Financiador: CNPq Universal). Função: Doutorando Integrante.",
  ],
  areas: [
    "1. Grande área: Ciências Biológicas / Área: Genética / Subárea: Genética Humana e Médica / Especialidade: Bioinformática.",
    "2. Grande área: Ciências Exatas e da Terra / Área: Ciência da Computação / Subárea: Aprendizado de Máquina Aplicado à Saúde.",
  ],
  idiomas: [
    "Inglês: Compreende Bem, Fala Bem, Lê Bem, Escreve Bem (Certificação TOEFL iBT: 108/120).",
    "Espanhol: Compreende Bem, Fala Razoavelmente, Lê Bem, Escreve Razoavelmente.",
    "Francês: Compreende Pouco, Fala Pouco, Lê Razoavelmente, Escreve Pouco.",
    "Português: Compreende Bem, Fala Bem, Lê Bem, Escreve Bem (Língua Materna).",
  ],
  premios: [
    "2025: Prêmio Tese Destaque USP na área de Ciências Biológicas e Saúde, Universidade de São Paulo.",
    "2023: Best Poster Award — ISMB / ECCB International Conference on Intelligent Systems for Molecular Biology.",
    "2018: Destaque Acadêmico de Iniciação Científica (Semana do Conhecimento), UFMG.",
  ],
  artigos: [
    "1. MENDES, R. H. A.; VASCONCELOS, H. M.; LANDER, E. S. Spatial transcriptomics and deep graph networks reveal immunotherapy response signatures in solid tumors. NATURE BIOTECHNOLOGY, v. 43, p. 412-425, 2025. (Qualis A1 · DOI: 10.1038/s41587-025-0001-x).",
    "2. MENDES, R. H. A.; NOGUEIRA, C. E.; SILVA, P. R. Transcriptomic landscape of chemoresistance in triple-negative breast cancer cell lines. BIOINFORMATICS, v. 38, p. 1890-1898, 2022. (Qualis A1).",
    "3. CAMPOS, L. R.; MENDES, R. H. A.; OLIVEIRA, T. M. Automated quality control and normalization workflows for clinical RNA-Seq datasets in Brazilian cohorts. GENETICS AND MOLECULAR BIOLOGY, v. 44, p. e20200312, 2021. (Qualis A2).",
    "4. MENDES, R. H. A.; VASCONCELOS, H. M. Machine learning biomarkers in precision oncology: a systematic review and meta-analysis. FRONTIERS IN GENETICS, v. 14, p. 112049, 2023. (Qualis A1).",
  ],
  eventos: [
    "1. MENDES, R. H. A.; VASCONCELOS, H. M. Deep learning integration of single-cell and spatial RNA-seq. In: 69º Congresso Brasileiro de Genética (SBG), 2024, Águas de Lindóia. Anais do 69º CBG, 2024.",
    "2. MENDES, R. H. A.; NOGUEIRA, C. E. Gene regulatory networks in drug resistance. In: X-Meeting — International Conference of the Brazilian Association for Bioinformatics and Computational Biology (AB3C), 2021, São Paulo.",
  ],
  bancasEOrientacoes: [
    "1. Orientação concluída (Iniciação Científica): Mariana Costa Silva. Predição de neoantígenos tumorais via redes neurais. 2024. Iniciação Científica (Biotecnologia) - Universidade de São Paulo, Bolsista CNPq.",
    "2. Participação em banca de Mestrado: Lucas Gabriel Ferreira. Análise de variantes somáticas em leucemias agudas. 2025. Dissertação (Mestrado em Oncologia) - Faculdade de Medicina da USP.",
  ],
};

// ============================================================================
// 1. GERA ARQUIVO WORD (.DOC) RICA EM ESTILOS OFICIAIS DO LATTES (HTML-DOC / RTF)
// ============================================================================
const docHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Currículo Lattes — ${LATTES.nome}</title>
<style>
  @page { size: 21cm 29.7cm; margin: 1.8cm 1.8cm 1.8cm 1.8cm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; color: #111111; line-height: 1.42; }
  .topbar { background-color: #1c3d6e; color: #ffffff; padding: 6pt 10pt; font-weight: bold; font-size: 11pt; }
  .meta { font-size: 8.5pt; color: #333333; border-bottom: 1pt solid #cbd5e1; padding: 5pt 0; margin-bottom: 8pt; }
  h1 { font-size: 15pt; color: #1c3d6e; margin: 4pt 0 2pt 0; }
  .contact { font-size: 8.8pt; color: #333333; margin-bottom: 8pt; }
  h2 { font-size: 10pt; font-weight: bold; background-color: #dfe8f3; color: #1c3d6e; border-top: 1.5pt solid #1c3d6e; border-bottom: 1pt solid #94a3b8; padding: 3pt 6pt; margin: 12pt 0 6pt 0; }
  .note { font-size: 8pt; color: #555555; font-style: italic; margin-top: 2pt; }
  table.grid { width: 100%; border-collapse: collapse; margin-bottom: 4pt; }
  table.grid td { vertical-align: top; padding: 2.5pt 4pt; font-size: 9.2pt; }
  table.grid td.lbl { width: 28%; font-weight: bold; color: #1c3d6e; }
  .inst-bar { background-color: #f1f5f9; border-left: 3pt solid #1c3d6e; padding: 3pt 6pt; font-weight: bold; color: #1c3d6e; margin: 6pt 0 3pt 0; font-size: 9.5pt; }
  ul, ol { margin: 2pt 0 6pt 16pt; padding: 0; }
  li { margin-bottom: 3.5pt; font-size: 9.2pt; }
</style>
</head>
<body>
  <div class="topbar">Sistema de Currículos Lattes (CNPq) — Currículo Acadêmico Completo</div>
  <div class="meta">
    Endereço para acessar este CV: <b>${LATTES.urlLattes}</b> &nbsp;|&nbsp;
    ID Lattes: <b>${LATTES.idLattes}</b> &nbsp;|&nbsp;
    Última atualização do currículo em <b>${LATTES.atualizacao}</b>
  </div>

  <h1>${LATTES.nome}</h1>
  <div class="contact">${LATTES.cidade} · Tel: ${LATTES.telefone} · E-mail: ${LATTES.email} · ORCID: ${LATTES.orcid}</div>

  <h2>Resumo</h2>
  <p>${LATTES.resumo}</p>
  <p class="note">(Texto informado pelo autor)</p>

  <h2>Identificação</h2>
  <table class="grid">
    <tr><td class="lbl">Nome</td><td>${LATTES.nome}</td></tr>
    <tr><td class="lbl">Nome em citações bibliográficas</td><td>${LATTES.citacoes}</td></tr>
    <tr><td class="lbl">Lattes iD</td><td>${LATTES.urlLattes}</td></tr>
    <tr><td class="lbl">ORCID iD</td><td>${LATTES.orcid}</td></tr>
  </table>

  <h2>Endereço</h2>
  <table class="grid">
    <tr><td class="lbl">Endereço Profissional</td><td>${LATTES.enderecoProf}</td></tr>
  </table>

  <h2>Formação acadêmica/titulação</h2>
  <table class="grid">
    ${LATTES.formacao
      .map(
        (f) => `
      <tr>
        <td class="lbl">${f.periodo}</td>
        <td>
          <b>${f.titulo}</b><br/>
          ${f.instituicao}<br/>
          ${f.detalhes.map((d) => `• ${d}`).join("<br/>")}
        </td>
      </tr>`
      )
      .join("")}
  </table>

  <h2>Atuação Profissional</h2>
  ${LATTES.atuacao
    .map(
      (a) => `
    <div class="inst-bar">${a.instituicao}</div>
    <table class="grid">
      <tr>
        <td class="lbl">${a.periodo}</td>
        <td>
          <b>Vínculo institucional:</b> ${a.vinculo}<br/>
          <b>Atividades exercidas:</b><br/>
          ${a.atividades.map((at) => `• ${at}`).join("<br/>")}
        </td>
      </tr>
    </table>`
    )
    .join("")}

  <h2>Projetos de pesquisa</h2>
  <ul>${LATTES.projetos.map((p) => `<li>${p}</li>`).join("")}</ul>

  <h2>Áreas de atuação</h2>
  <ul>${LATTES.areas.map((ar) => `<li>${ar}</li>`).join("")}</ul>

  <h2>Idiomas</h2>
  <table class="grid">
    ${LATTES.idiomas
      .map((id) => {
        const [lang, rest] = id.split(": ");
        return `<tr><td class="lbl">${lang}</td><td>${rest}</td></tr>`;
      })
      .join("")}
  </table>

  <h2>Prêmios e títulos</h2>
  <ul>${LATTES.premios.map((pr) => `<li>${pr}</li>`).join("")}</ul>

  <h2>Produções — Produção bibliográfica (Artigos completos publicados em periódicos)</h2>
  <ul>${LATTES.artigos.map((art) => `<li>${art}</li>`).join("")}</ul>

  <h2>Trabalhos completos publicados em anais de congressos</h2>
  <ul>${LATTES.eventos.map((ev) => `<li>${ev}</li>`).join("")}</ul>

  <h2>Orientações e Participação em Bancas</h2>
  <ul>${LATTES.bancasEOrientacoes.map((b) => `<li>${b}</li>`).join("")}</ul>
</body>
</html>`;

const docPath = path.join(OUT_DIR, "Exemplo_Curriculo_Lattes_Completo.doc");
fs.writeFileSync(docPath, "\ufeff" + docHtml, "utf8");

// ============================================================================
// 2. GERA PDF NATIVO MULTI-PÁGINA COM TEXTO REAL SELECIONÁVEL (Padrão PDF 1.4)
// ============================================================================
function win1252Escape(str) {
  // Converte UTF-8 para bytes WinAnsi (CP1252) e escapa parênteses/barras do PDF
  let out = "";
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    // Substitui travessões e bullets Unicode por equivalentes WinAnsi
    if (code === 0x2013 || code === 0x2014) code = 0x96; // –
    else if (code === 0x2022) code = 0x95; // •
    else if (code === 0x201c || code === 0x201d) code = 0x22;
    else if (code === 0x2018 || code === 0x2019) code = 0x27;
    if (code > 255) code = 0x2d;
    const ch = String.fromCharCode(code);
    if (ch === "(" || ch === ")" || ch === "\\") out += "\\" + ch;
    else if (code < 32 || code > 126) out += "\\" + code.toString(8).padStart(3, "0");
    else out += ch;
  }
  return out;
}

function wrapText(text, maxChars) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= maxChars) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function buildLattesPDF(filePath) {
  const pages = [[]];
  const W = 595.28,
    H = 841.89,
    M = 42;
  let y = H - M;

  const curPage = () => pages[pages.length - 1];
  const ensure = (need) => {
    if (y - need < M + 20) {
      pages.push([]);
      y = H - M;
    }
  };

  const addBanner = () => {
    ensure(28);
    curPage().push(`0.11 0.24 0.43 rg ${M} ${y - 20} ${W - M * 2} 22 re f`);
    curPage().push(`BT /F2 10.5 Tf 1 1 1 rg ${M + 8} ${y - 13} Td (${win1252Escape("Sistema de Currículos Lattes (CNPq) - Modelo Acadêmico Oficial")}) Tj ET`);
    y -= 28;
  };

  const addSection = (title) => {
    ensure(26);
    y -= 6;
    curPage().push(`0.87 0.91 0.95 rg ${M} ${y - 14} ${W - M * 2} 16 re f`);
    curPage().push(`0.11 0.24 0.43 RG 1.2 w ${M} ${y + 2} m ${W - M} ${y + 2} l S`);
    curPage().push(`BT /F2 9.5 Tf 0.11 0.24 0.43 rg ${M + 6} ${y - 10} Td (${win1252Escape(title)}) Tj ET`);
    y -= 20;
  };

  const addLines = (text, { bold = false, size = 9, color = "0.08 0.08 0.08", indent = 0, gap = 3 } = {}) => {
    const maxChars = Math.floor(((W - M * 2 - indent) / (size * 0.51)));
    const lines = wrapText(text, maxChars);
    const lh = size * 1.32;
    for (const ln of lines) {
      ensure(lh);
      curPage().push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg ${M + indent} ${y - size} Td (${win1252Escape(ln)}) Tj ET`);
      y -= lh;
    }
    y -= gap;
  };

  addBanner();
  addLines(`Endereço para acessar este CV: ${LATTES.urlLattes}  |  ID Lattes: ${LATTES.idLattes}  |  Atualizado em: ${LATTES.atualizacao}`, {
    size: 8,
    color: "0.25 0.25 0.25",
  });
  addLines(LATTES.nome, { bold: true, size: 14, color: "0.11 0.24 0.43", gap: 1 });
  addLines(`${LATTES.cidade}  |  Tel: ${LATTES.telefone}  |  E-mail: ${LATTES.email}  |  ORCID: ${LATTES.orcid}`, { size: 8.5, color: "0.2 0.2 0.2" });

  addSection("Resumo");
  addLines(LATTES.resumo, { size: 9 });
  addLines("(Texto informado pelo autor)", { size: 7.8, color: "0.35 0.35 0.35" });

  addSection("Identificação");
  addLines(`Nome completo: ${LATTES.nome}`, { bold: true, size: 8.8 });
  addLines(`Nome em citações bibliográficas: ${LATTES.citacoes}`, { size: 8.8 });
  addLines(`Lattes iD: ${LATTES.urlLattes}   |   ORCID iD: ${LATTES.orcid}`, { size: 8.8 });
  addLines(`Endereço Profissional: ${LATTES.enderecoProf}`, { size: 8.5 });

  addSection("Formação acadêmica/titulação");
  for (const f of LATTES.formacao) {
    addLines(`${f.periodo} — ${f.titulo}`, { bold: true, size: 9.2, color: "0.11 0.24 0.43", gap: 1 });
    addLines(f.instituicao, { bold: true, size: 8.8, indent: 10, gap: 1 });
    for (const d of f.detalhes) addLines(`• ${d}`, { size: 8.6, indent: 16, gap: 1 });
    y -= 3;
  }

  addSection("Atuação Profissional");
  for (const a of LATTES.atuacao) {
    addLines(`${a.instituicao} (${a.periodo})`, { bold: true, size: 9.2, color: "0.11 0.24 0.43", gap: 1 });
    addLines(`Vínculo institucional: ${a.vinculo}`, { bold: true, size: 8.7, indent: 10, gap: 1 });
    for (const at of a.atividades) addLines(`• ${at}`, { size: 8.6, indent: 16, gap: 1 });
    y -= 3;
  }

  addSection("Projetos de Pesquisa Financiados");
  for (const p of LATTES.projetos) addLines(`• ${p}`, { size: 8.7, indent: 8, gap: 2 });

  addSection("Áreas de Atuação");
  for (const ar of LATTES.areas) addLines(ar, { size: 8.7, indent: 8, gap: 2 });

  addSection("Idiomas");
  for (const id of LATTES.idiomas) addLines(`• ${id}`, { size: 8.7, indent: 8, gap: 1.5 });

  addSection("Prêmios e Títulos");
  for (const pr of LATTES.premios) addLines(`• ${pr}`, { size: 8.7, indent: 8, gap: 1.5 });

  addSection("Produções — Artigos Completos Publicados em Periódicos");
  for (const art of LATTES.artigos) addLines(art, { size: 8.6, indent: 6, gap: 2.5 });

  addSection("Trabalhos Publicados em Anais de Congressos");
  for (const ev of LATTES.eventos) addLines(ev, { size: 8.6, indent: 6, gap: 2 });

  addSection("Orientações e Participação em Bancas Examinadoras");
  for (const b of LATTES.bancasEOrientacoes) addLines(b, { size: 8.6, indent: 6, gap: 2 });

  // Monta objetos PDF
  const objects = [];
  const addObj = (str) => {
    objects.push(str);
    return objects.length;
  };

  const font1Id = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
  const font2Id = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);

  const pageIds = [];
  for (const cmds of pages) {
    const stream = cmds.join("\n");
    const contentId = addObj(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`);
    const pageId = addObj(
      `<< /Type /Page /Parent PAGES_REF /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  }

  const pagesId = addObj(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
  const catalogId = addObj(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    const body = obj.replace("PAGES_REF", `${pagesId} 0 R`);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  fs.writeFileSync(filePath, Buffer.from(pdf, "binary"));
}

const pdfPath = path.join(OUT_DIR, "Exemplo_Curriculo_Lattes_Completo.pdf");
buildLattesPDF(pdfPath);
console.log("Arquivos gerados com sucesso:", { docPath, pdfPath });

