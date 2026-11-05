// Aprovado.ai — Plataforma Completa (Fases 2, 3 e 4)
// Leitura real de PDF/DOCX/TXT/Imagem + Gemini 3.8 Flash opcional + 8 modelos + Ajuste por vaga + LinkedIn + E-mail/Carta + Meus Currículos

const TEMPLATES = [
  { id: "ats", name: "ATS", desc: "Passa nos filtros", photo: "blocked" },
  { id: "moderno", name: "Moderno", desc: "Duas colunas", photo: "optional" },
  { id: "executivo", name: "Executivo", desc: "Gestão e diretoria", photo: "optional" },
  { id: "criativo", name: "Criativo", desc: "Design e marketing", photo: "optional" },
  { id: "primeiro", name: "1º Emprego", desc: "Foco em formação", photo: "recommended" },
  { id: "academico", name: "Currículo Lattes", desc: "Padrão CNPq Oficial", photo: "warn_acad" },
];

// Modelos antigos removidos são convertidos para ATS (links compartilhados e currículos salvos)
const normTpl = (id) => (TEMPLATES.some((t) => t.id === id) ? id : "ats");

const COLORS = ["#047857", "#0F2A44", "#1E40AF", "#7C2D12", "#374151"];

const SAMPLE_CV = {
  nome: "Mariana Souza",
  cargo: "Analista Administrativo-Financeiro",
  email: "mariana.souza@email.com",
  telefone: "(11) 98765-4321",
  cidade: "São Paulo, SP",
  linkedin: "linkedin.com/in/marianasouza",
  resumo: "Analista com 6 anos de experiência em rotinas administrativas e financeiras, contas a pagar e receber, conciliação bancária e elaboração de relatórios gerenciais. Reconhecida pela organização e pela melhoria de processos.",
  experiencias: [
    {
      cargo: "Analista Administrativo-Financeiro",
      empresa: "Grupo Horizonte",
      periodo: "2021 – atual",
      itens: [
        "Reduzi em 18% os custos operacionais com a renegociação de 12 contratos de fornecedores",
        "Implantei a conciliação bancária automatizada, eliminando 10 horas mensais de trabalho manual",
        "Elaboro relatórios gerenciais mensais para a diretoria (Excel e Power BI)",
      ],
    },
    {
      cargo: "Assistente Administrativo",
      empresa: "Comercial Lima Ltda.",
      periodo: "2018 – 2021",
      itens: [
        "Gerenciei contas a pagar e receber de mais de 300 clientes",
        "Organizei o arquivo digital da empresa, reduzindo o tempo de busca de documentos",
      ],
    },
  ],
  formacao: "Bacharel em Administração — Universidade Paulista (2019)",
  habilidades: [
    "Contas a pagar e receber",
    "Conciliação bancária",
    "Excel avançado",
    "Power BI",
    "SAP",
    "Gestão de fornecedores",
    "Relatórios gerenciais",
  ],
  idiomas: "Inglês intermediário · Espanhol básico",
  lattes: "lattes.cnpq.br/0000000000000000",
  publicacoes: "Adicione aqui seus artigos publicados, resumos em congressos, capítulos de livros, projetos de Iniciação Científica (PIBIC) ou título do TCC/Dissertação e orientador(a).",
};

const SAMPLE_LATTES_CV = {
  nome: "Dr. Rafael Henrique Albuquerque Mendes",
  cargo: "Pesquisador de Pós-Doutorado em Biotecnologia e Bioinformática",
  email: "rafael.mendes.pesquisa@usp.br",
  telefone: "(11) 98412-7730",
  cidade: "São Paulo, SP",
  linkedin: "linkedin.com/in/rafaelmendes-phd",
  lattes: "http://lattes.cnpq.br/8492017492038471 | ORCID: https://orcid.org/0000-0002-8492-1940",
  enderecoProfissional:
    "Universidade de São Paulo (USP), Instituto de Ciências Biomédicas, Departamento de Microbiologia e Imunologia. Av. Prof. Lineu Prestes, 1374 — Butantã, CEP 05508-000, São Paulo - SP, Brasil.",
  resumo:
    "Possui graduação em Biotecnologia pela Universidade Federal de Minas Gerais (2018), mestrado em Ciências Biológicas (Biologia Molecular) pela Universidade Estadual de Campinas (2021) e doutorado em Biotecnologia e Bioinformática pela Universidade de São Paulo (2025), com período sanduíche no Broad Institute of MIT and Harvard (Bolsista CAPES/PDSE). Atualmente é pesquisador de Pós-Doutorado (Bolsista FAPESP) na Universidade de São Paulo. Tem experiência na área de Genética, Bioinformática e IA Aplicada à Saúde, atuando em sequenciamento NGS, transcriptômica espacial e biomarcadores oncológicos.",
  experiencias: [
    {
      cargo: "Bolsista de Pós-Doutorado (FAPESP) · Dedicação Exclusiva (40h)",
      empresa: "Universidade de São Paulo (USP)",
      periodo: "2025 – atual",
      itens: [
        "Pesquisa e desenvolvimento no Laboratório de Genômica Computacional e Medicina de Precisão",
        "Coorientação de 3 alunos de Mestrado e 2 alunos de Iniciação Científica (PIBIC/CNPq)",
        "Docência colaboradora na disciplina de pós-graduação BMM-5820: Métodos Computacionais em Biologia Sistêmica",
      ],
    },
    {
      cargo: "Pesquisador Bioinformata Júnior (CLT, 40h)",
      empresa: "Hospital Israelita Albert Einstein — Instituto de Pesquisa",
      periodo: "2020 – 2021",
      itens: [
        "Processamento e análise estatística de coortes clínicas de sequenciamento exômico e RNA-Seq",
        "Desenvolvimento de relatórios automatizados de variantes genômicas para suporte à decisão clínica",
      ],
    },
    {
      cargo: "Monitor de Graduação e Bolsista de Iniciação Científica (PIBIC/CNPq)",
      empresa: "Universidade Federal de Minas Gerais (UFMG)",
      periodo: "2016 – 2018",
      itens: [
        "Monitoria acadêmica nas disciplinas de Bioestatística e Genética Molecular",
        "Execução de experimentos de extração de ácidos nucleicos, qPCR e análise bioinformática",
      ],
    },
  ],
  formacao:
    "Doutorado em Biotecnologia e Bioinformática — USP (2021–2025, Bolsista FAPESP, Tese: Integração de Transcriptômica Espacial e Aprendizado Profundo em Carcinomas, Orientadora: Profa. Dra. Helena M. Vasconcelos) · Mestrado em Biologia Molecular — UNICAMP (2019–2021, Bolsista CNPq) · Graduação em Biotecnologia — UFMG (2014–2018)",
  formacaoComplementar: [
    "2023 – 2023: Advanced Single-Cell and Spatial Transcriptomics Workshop (Carga horária: 60h) — Cold Spring Harbor Laboratory (CSHL), EUA.",
    "2020 – 2020: Escola São Paulo de Ciência Avançada em Aprendizado de Máquina Biológico (Carga horária: 80h) — USP / FAPESP.",
  ].join("\n"),
  projetosPesquisa: [
    "2025 – Atual: Arquiteturas de Redes Neurais em Grafos para Predição de Resposta Imunoterápica (Situação: Em andamento | Natureza: Pesquisa | Financiador: FAPESP).",
    "2021 – 2025: Atlas Multi-Ômico de Resistência Quimioterápica em Tumores Epiteliais (Situação: Concluído | Natureza: Pesquisa | Financiador: CNPq / CAPES).",
  ].join("\n"),
  habilidades: [
    "Bioinformática e Genômica (NGS / RNA-Seq)",
    "Transcriptômica Espacial",
    "Python e R para Ciência de Dados",
    "Aprendizado de Máquina em Saúde",
    "Bioestatística",
    "Redação Científica (Qualis A1)",
    "Docência no Ensino Superior",
  ],
  idiomas: "Inglês avançado (TOEFL iBT 108/120) · Espanhol intermediário · Francês básico · Português nativo",
  publicacoes: [
    "Spatial transcriptomics and deep graph networks reveal immunotherapy response signatures in solid tumors. NATURE BIOTECHNOLOGY, v. 43, p. 412-425, 2025. (Qualis A1 · DOI: 10.1038/s41587-025-0001-x).",
    "Transcriptomic landscape of chemoresistance in triple-negative breast cancer cell lines. BIOINFORMATICS, v. 38, p. 1890-1898, 2022. (Qualis A1).",
    "Automated quality control workflows for clinical RNA-Seq datasets in Brazilian cohorts. GENETICS AND MOLECULAR BIOLOGY, v. 44, 2021. (Qualis A2).",
  ].join("\n"),
  eventosPremios: [
    "Prêmio Tese Destaque USP na área de Ciências Biológicas e Saúde (2025).",
    "Best Poster Award — Intelligent Systems for Molecular Biology (ISMB/ECCB, Lyon, 2023).",
    "Apresentação Oral no 68º Congresso Brasileiro de Genética (SBG, 2023).",
  ].join("\n"),
};

// Dicionário de cidades e termos brasileiros em cirílico (russo) para conversão imediata ao português
const CYRILLIC_BRAZIL_TERMS = [
  [/Белу[- ]Оризонти/gi, "Belo Horizonte"],
  [/Сан[- ]Паулу/gi, "São Paulo"],
  [/Рио[- ]де[- ]Жанейро/gi, "Rio de Janeiro"],
  [/Куритиба/gi, "Curitiba"],
  [/Бразилиа|Бразилия/gi, "Brasília"],
  [/Салвадор/gi, "Salvador"],
  [/Форталеза/gi, "Fortaleza"],
  [/Порту[- ]Алегри/gi, "Porto Alegre"],
  [/Ресифи/gi, "Recife"],
  [/Манаус/gi, "Manaus"],
  [/Минас[- ]Жерайс/gi, "Minas Gerais"],
  [/Гояния/gi, "Goiânia"],
  [/Кампинас/gi, "Campinas"],
  [/Витория/gi, "Vitória"],
  [/Флорианополис/gi, "Florianópolis"],
  [/Натал/gi, "Natal"],
  [/Жоао[- ]Пессоа/gi, "João Pessoa"],
  [/Масейо/gi, "Maceió"],
  [/Терезина/gi, "Teresina"],
  [/Аракажу/gi, "Aracaju"],
  [/Куяба/gi, "Cuiabá"],
  [/Кампу[- ]Гранди/gi, "Campo Grande"],
  [/Бразил/gi, "Brasil"],
];

const CYRILLIC_TO_LATIN = {
  "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "E", "Ж": "J",
  "З": "Z", "И": "I", "Й": "I", "К": "K", "Л": "L", "М": "M", "Н": "N", "О": "O",
  "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U", "Ф": "F", "Х": "Kh", "Ц": "Ts",
  "Ч": "Ch", "Ш": "Sh", "Щ": "Sch", "Ъ": "", "Ы": "Y", "Ь": "", "Э": "E", "Ю": "Yu", "Я": "Ya",
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "j",
  "з": "z", "и": "i", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
  "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts",
  "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya"
};

function removeCyrillicAndForeignChars(str) {
  if (!str || typeof str !== "string") return "";
  let s = str;
  for (const [rgx, rep] of CYRILLIC_BRAZIL_TERMS) {
    s = s.replace(rgx, rep);
  }
  if (/[\u0400-\u04FF]/.test(s)) {
    s = s.replace(/[\u0400-\u04FF]/g, (ch) => CYRILLIC_TO_LATIN[ch] || "");
  }
  return s;
}

function fixPortugueseText(str) {
  if (!str || typeof str !== "string") return "";
  return removeCyrillicAndForeignChars(str).trim();
}

// Constantes globais para extração e validação de cidades brasileiras e filtros anti-falso-positivo
const BRAZIL_UFS = new Set([
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
]);

const BRAZIL_STATE_NAME_TO_UF = {
  "acre": "AC", "alagoas": "AL", "amapa": "AP", "amapá": "AP", "amazonas": "AM",
  "bahia": "BA", "ceara": "CE", "ceará": "CE", "distrito federal": "DF", "espirito santo": "ES",
  "espírito santo": "ES", "goias": "GO", "goiás": "GO", "maranhao": "MA", "maranhão": "MA",
  "mato grosso": "MT", "mato grosso do sul": "MS", "minas gerais": "MG", "para": "PA", "pará": "PA",
  "paraiba": "PB", "paraíba": "PB", "parana": "PR", "paraná": "PR", "pernambuco": "PE",
  "piaui": "PI", "piauí": "PI", "rio de janeiro": "RJ", "rio grande do norte": "RN",
  "rio grande do sul": "RS", "rondonia": "RO", "rondônia": "RO", "roraima": "RR",
  "santa catarina": "SC", "sao paulo": "SP", "são paulo": "SP", "sergipe": "SE", "tocantins": "TO"
};

const BRAZIL_DDD_MAP = {
  "11": ["São Paulo", "SP"], "12": ["São José dos Campos", "SP"], "13": ["Santos", "SP"],
  "14": ["Bauru", "SP"], "15": ["Sorocaba", "SP"], "16": ["Ribeirão Preto", "SP"],
  "17": ["São José do Rio Preto", "SP"], "18": ["Presidente Prudente", "SP"], "19": ["Campinas", "SP"],
  "21": ["Rio de Janeiro", "RJ"], "22": ["Campos dos Goytacazes", "RJ"], "24": ["Petrópolis", "RJ"],
  "27": ["Vitória", "ES"], "28": ["Cachoeiro de Itapemirim", "ES"],
  "31": ["Belo Horizonte", "MG"], "32": ["Juiz de Fora", "MG"], "33": ["Governador Valadares", "MG"],
  "34": ["Uberlândia", "MG"], "35": ["Poços de Caldas", "MG"], "37": ["Divinópolis", "MG"],
  "38": ["Montes Claros", "MG"],
  "41": ["Curitiba", "PR"], "42": ["Ponta Grossa", "PR"], "43": ["Londrina", "PR"], "44": ["Maringá", "PR"],
  "47": ["Joinville", "SC"], "48": ["Florianópolis", "SC"], "49": ["Chapecó", "SC"],
  "51": ["Porto Alegre", "RS"], "53": ["Pelotas", "RS"], "54": ["Caxias do Sul", "RS"], "55": ["Santa Maria", "RS"],
  "61": ["Brasília", "DF"], "62": ["Goiânia", "GO"], "63": ["Palmas", "TO"],
  "65": ["Cuiabá", "MT"], "67": ["Campo Grande", "MS"], "68": ["Rio Branco", "AC"], "69": ["Porto Velho", "RO"],
  "71": ["Salvador", "BA"], "73": ["Ilhéus", "BA"], "75": ["Feira de Santana", "BA"], "79": ["Aracaju", "SE"],
  "81": ["Recife", "PE"], "82": ["Maceió", "AL"], "83": ["João Pessoa", "PB"], "84": ["Natal", "RN"],
  "85": ["Fortaleza", "CE"], "86": ["Teresina", "PI"], "91": ["Belém", "PA"], "92": ["Manaus", "AM"],
  "95": ["Boa Vista", "RR"], "96": ["Macapá", "AP"], "98": ["São Luís", "MA"]
};

const NON_CITY_TERMS_RE = /\b(windows|mobile|android|ios|linux|unix|server|office|excel|word|powerpoint|power\s*bi|sql|mysql|oracle|postgres|mongodb|azure|aws|gcp|cloud|cisco|itil|cobit|scrum|kanban|agile|devops|docker|kubernetes|infraestrutura|redes|seguran[çc]a|suporte|analista|engenheiro|coordenador|gerente|supervisor|especialista|t[ée]cnico|desenvolvedor|programador|estagi[áa]rio|assistente|consultor|diretor|empresa|instituto|faculdade|universidade|escola|colegio|hospital|laborat[óo]rio|projetos?|sistemas?|hardware|software|firewall|vpn|tcp|lan|wan|vlan|active\s*directory|dns|dhcp|vmware|hyper-v|backup|storage|telefonia|voip|asterisk|pabx|certifica[çc][ãa]o|certifica[çc][õo]es|experi[êe]ncia|forma[çc][ãa]o|gradua[çc][ãa]o|bacharel|tecn[óo]logo|licenciatura|p[óo]s|mestrado|doutorado|idiomas?|ingl[êe]s|espanhol|franc[êe]s|alem[ãa]o|italiano|portugu[êe]s|conhecimentos?|habilidades?|compet[êe]ncias?|contratos?|indicadores?|operacionais|fornecedores|auditorias?|conformidade|disponibilidade|automa[çc][ãa]o)\b/i;

const CITY_UF_REGEX = /\b([A-Za-zÀ-ÖØ-öø-ÿ]{3,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+){0,3})\s*(?:[-—–,/]+\s*|\s*\()([A-Za-z]{2})(?![A-Za-zÀ-ÖØ-öø-ÿ])\)?/i;

const normTxt = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const KNOWN_CITIES = new Set(Object.values(BRAZIL_DDD_MAP).map((v) => normTxt(v[0])));
["belo horizonte", "contagem", "betim", "niteroi", "guarulhos", "osasco", "santo andre", "sao bernardo do campo", "duque de caxias", "nova iguacu", "sao goncalo"].forEach((c) => KNOWN_CITIES.add(c));
const MORE_CITIES = ["belo horizonte","contagem","betim","nova lima","sabara","santa luzia","ribeirao das neves","ibirite","sete lagoas","vespasiano","lagoa santa","niteroi","guarulhos","osasco","santo andre","sao bernardo do campo","sao caetano do sul","diadema","maua","barueri","duque de caxias","nova iguacu","sao goncalo","sao joao de meriti","belford roxo","campinas","jundiai","piracicaba","blumenau","itajai","balneario camboriu","canoas","novo hamburgo","sao leopoldo","serra","vila velha","cariacica","anapolis","aparecida de goiania","camacari","lauro de freitas","jaboatao dos guararapes","olinda","paulista","caucaia","maracanau","bh","sp","rj"];
MORE_CITIES.forEach((c) => KNOWN_CITIES.add(c));
const STATE_NAMES = Object.keys(BRAZIL_STATE_NAME_TO_UF).map(normTxt);

const isRealCityUfLine = (ln) => {
  if (!ln || ln.length > 45 || NON_CITY_TERMS_RE.test(ln)) return false;
  const m = ln.trim().match(/^([A-Za-zÀ-ÖØ-öø-ÿ]{3,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+){0,3})\s*(?:[-—–,/]+\s*|\s*\()([A-Za-z]{2})\)?$/);
  if (!m) return false;
  return BRAZIL_UFS.has(m[2].toUpperCase());
};

const LOCATION_WORDS = new Set([
  "belo", "horizonte", "minas", "gerais", "mg", "bh",
  "sao", "paulo", "sp", "rio", "janeiro", "rj",
  "brasil", "brazil", "curitiba", "pr", "porto", "alegre", "rs",
  "salvador", "ba", "recife", "pe", "fortaleza", "ce", "brasilia", "df",
  "goiania", "go", "florianopolis", "sc", "vitoria", "es", "manaus", "am",
  "belem", "pa", "campinas", "centro", "bairro", "remoto", "hibrido", "presencial"
]);

const isLocationText = (s) => {
  let n = normTxt(s).replace(/[()\[\]]/g, " ").replace(/\s+/g, " ").trim();
  if (!n || n.length > 60) return false;
  if (LOCATION_WORDS.has(n)) return true;
  n = n.replace(/\s*[-–—,\/|]\s*(brasil|brazil)$/, "").trim();
  for (const st of STATE_NAMES) {
    const re = new RegExp("(?:\\s*[-–—,\\/|]\\s*|\\s+)" + st + "$");
    if (n !== st && re.test(n)) { n = n.replace(re, "").trim(); break; }
  }
  n = n.replace(/\s*[-–—,\/|]\s*[a-z]{2}$/, "").replace(/\s+[a-z]{2}$/, (m) => (BRAZIL_UFS.has(m.trim().toUpperCase()) ? "" : m)).trim();
  if (!n) return true;
  if (KNOWN_CITIES.has(n) || STATE_NAMES.includes(n) || LOCATION_WORDS.has(n)) return true;
  return isRealCityUfLine(s);
};

const stripTrailingLocation = (t) => {
  let cur = (t || "").trim();
  for (let i = 0; i < 3; i++) {
    const seps = [...cur.matchAll(/\s+[-–—|]\s+|\s*,\s+|\s*\/(?=\s*[A-Za-z]{2}(?:\b|\s|$))|\s*\(/g)];
    if (!seps.length) break;
    const last = seps[seps.length - 1];
    const tail = cur.slice(last.index + last[0].length).replace(/\)$/, "").trim();
    const head = cur.slice(0, last.index).trim();
    if (head && (isLocationText(tail) || (/^[A-Za-z]{2}$/.test(tail) && BRAZIL_UFS.has(tail.toUpperCase())) || LOCATION_WORDS.has(normTxt(tail)))) {
      cur = head;
    } else {
      break;
    }
  }
  return cur;
};

function extractPhoneFromText(text) {
  if (!text) return "";
  // 1. Procura telefone com DDD e 8 ou 9 dígitos: (31) 99476-2561, (31) 99476 - 2561, 31 99476-2561, etc.
  const fullPhoneRe = /(?:(?:\+|00)?55\s*)?(?:\(?0?([1-9]{2})\)?\s*)(?:(9\s*\d{4}|\d{4,5})\s*[-.\s]?\s*(\d{4}))\b/;
  const fullMatch = text.match(fullPhoneRe);
  if (fullMatch) {
    const ddd = fullMatch[1];
    const p1 = fullMatch[2].replace(/\s+/g, "");
    const p2 = fullMatch[3].replace(/\s+/g, "");
    return `(${ddd}) ${p1}-${p2}`;
  }

  // 2. Procura telefones com rótulos explícitos (Telefone, Celular, Tel, Cel, Whats, WhatsApp, Contato, Fone)
  const labeledPhoneRe = /(?:telefone|celular|whats(?:app)?|contato|fone|tel|cel)\s*[:\-]?\s*(?:(?:\+|00)?55\s*)?(?:\(?0?([1-9]{2})\)?\s*)?(?:(9\s*\d{4}|\d{4,5})\s*[-.\s]?\s*(\d{4}))\b/i;
  const labeledMatch = text.match(labeledPhoneRe);
  if (labeledMatch) {
    const ddd = labeledMatch[1] || "";
    const p1 = labeledMatch[2].replace(/\s+/g, "");
    const p2 = labeledMatch[3].replace(/\s+/g, "");
    const num = `${p1}-${p2}`;
    return ddd ? `(${ddd}) ${num}` : num;
  }

  // 3. Telefone padrão sem DDD (8 ou 9 dígitos com hífen ou espaço)
  const genericRe = /\b(9?\d{4})\s*[-.\s]?\s*(\d{4})\b/;
  const genMatch = text.match(genericRe);
  if (genMatch) return `${genMatch[1]}-${genMatch[2]}`;

  return "";
}

function extractCityStateFromText(text, headerLines, phone) {
  const cleanHeader = (headerLines || []).map((l) => removeCyrillicAndForeignChars(l).trim()).filter(Boolean);

  // 1. Rótulo explícito no cabeçalho: Cidade: ..., Endereço: ..., Localização: ..., etc.
  const explicitRe = /(?:cidade|localiza[çc][ãa]o|endere[çc]o|residente\s+em|mora\s+em|munic[íi]pio|localidade)\s*[:\-]\s*([^,\n|/]+?)(?:\s*[\s—–\-,/]\s*([A-Za-zÀ-ÖØ-öø-ÿ]{2,})|\s*\(([A-Za-z]{2})\))/i;
  for (const hl of cleanHeader) {
    const em = hl.match(explicitRe);
    if (em) {
      let candidateCity = em[1].replace(/^.*(?:rua|av|avenida|alameda|bairro|pra[çc]a|centro|cep|residente\s+em|mora\s+em|\d+)\s*[-,\/]?\s*/i, "").trim();
      let ufCandidate = (em[2] || em[3] || "").trim().toUpperCase();
      if (BRAZIL_UFS.has(ufCandidate) && !NON_CITY_TERMS_RE.test(candidateCity) && candidateCity.length <= 40) {
        const cleanCity = candidateCity.toLowerCase().replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
        return `${cleanCity}, ${ufCandidate}`;
      }
      const ufFromState = BRAZIL_STATE_NAME_TO_UF[ufCandidate.toLowerCase()];
      if (ufFromState && !NON_CITY_TERMS_RE.test(candidateCity) && candidateCity.length <= 40) {
        const cleanCity = candidateCity.toLowerCase().replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
        return `${cleanCity}, ${ufFromState}`;
      }
    }
  }

  // 2. Padrão Cidade - UF em maiúsculas, minúsculas ou misto (ex.: Belo Horizonte – MG, Curitiba/PR, São Paulo (SP))
  // Lookahead (?![A-Za-zÀ-ÖØ-öø-ÿ]) impede que 'além', 'de', 'se' virem UF
  const cityUfRe = /\b([A-Za-zÀ-ÖØ-öø-ÿ]{3,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+){0,3})\s*(?:[-—–,/]+\s*|\s*\()([A-Za-z]{2})(?![A-Za-zÀ-ÖØ-öø-ÿ])\)?/g;
  for (const hl of cleanHeader) {
    if (/linkedin\.com|github\.com|@|http/i.test(hl)) continue;
    let m;
    while ((m = cityUfRe.exec(hl)) !== null) {
      const candidateCity = m[1].trim();
      const candidateUf = m[2].trim().toUpperCase();
      if (BRAZIL_UFS.has(candidateUf) && !NON_CITY_TERMS_RE.test(candidateCity) && candidateCity.length <= 40) {
        let cleanCity = candidateCity.replace(/^.*(?:rua|av|avenida|alameda|bairro|pra[çc]a|centro|cep|residente\s+em|mora\s+em|\d+)\s*[-,\/]?\s*/i, "").trim();
        if (!cleanCity) cleanCity = candidateCity;
        cleanCity = cleanCity.toLowerCase().replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
        return `${cleanCity}, ${candidateUf}`;
      }
    }
  }

  // 3. Cidade com nome completo do estado (ex.: "Belo Horizonte - Minas Gerais")
  for (const [stateName, uf] of Object.entries(BRAZIL_STATE_NAME_TO_UF)) {
    const stateRe = new RegExp(`\\b([A-Za-zÀ-ÖØ-öø-ÿ]{3,}(?:\\s+[A-Za-zÀ-ÖØ-öø-ÿ]+){0,2})\\s*[-—–,/\\(]\\s*${stateName}\\b`, "i");
    for (const hl of cleanHeader) {
      const sm = hl.match(stateRe);
      if (sm && !NON_CITY_TERMS_RE.test(sm[1])) {
        const cleanCity = sm[1].trim().toLowerCase().replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
        return `${cleanCity}, ${uf}`;
      }
    }
  }

  // 4. Fallback pelo DDD do telefone detectado
  if (phone) {
    const dddMatch = phone.match(/\(?0?([1-9]{2})\)?/);
    if (dddMatch && BRAZIL_DDD_MAP[dddMatch[1]]) {
      return `${BRAZIL_DDD_MAP[dddMatch[1]][0]}, ${BRAZIL_DDD_MAP[dddMatch[1]][1]}`;
    }
  }

  return "";
}

function polishFullCV(targetCv) {
  return 0;
}

// Carrega estado salvo ou inicia com o exemplo
let cv = JSON.parse(localStorage.getItem("aprovado_current_cv") || "null") || structuredClone(SAMPLE_CV);
polishFullCV(cv);
let userPlan = "free"; // Inicia bloqueado até validar a assinatura criptográfica no servidor ("free" | "avulso" | "pro")

// Identificador único de pedido por navegador (evita colisão entre clientes pagando ao mesmo tempo)
function getOrCreateOrderId() {
  let id = localStorage.getItem("aprovado_order_id");
  if (!id) {
    id = "ord_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem("aprovado_order_id", id);
  }
  return id;
}

function activateVerifiedPlan(plan, paymentId, licenseToken) {
  userPlan = plan === "pro" ? "pro" : "avulso";
  localStorage.setItem("aprovado_user_plan", userPlan);
  if (paymentId) localStorage.setItem("aprovado_verified_payment_id", String(paymentId));
  if (licenseToken) localStorage.setItem("aprovado_license_token", String(licenseToken));
  if ($("#checkoutModal")) $("#checkoutModal").hidden = true;
  if ($("#template") && $("#template").classList.contains("active")) renderEditor();
  toast(
    userPlan === "pro"
      ? `Pagamento confirmado no Mercado Pago! Plano Pro Completo Vitalício liberado sem marca d'água 🎉`
      : `Pagamento confirmado no Mercado Pago! Plano Intermediário liberado sem marca d'água 🎉`
  );
}

// 1) Validação Criptográfica Antifraude (impede que alguém altere localStorage pelo F12 sem ter pago)
// 2) Verificação automática quando o Mercado Pago redireciona o cliente de volta com ?payment_id=... ou ?order_id=...
(async () => {
  const savedToken = localStorage.getItem("aprovado_license_token") || "";
  if (savedToken) {
    try {
      const vResp = await fetch(`/api/validate-license?token=${encodeURIComponent(savedToken)}`);
      const vData = await vResp.json();
      if (vData && vData.valid) {
        userPlan = vData.plan;
        if ($("#template") && $("#template").classList.contains("active")) renderEditor();
      } else {
        localStorage.removeItem("aprovado_license_token");
        localStorage.setItem("aprovado_user_plan", "free");
        userPlan = "free";
      }
    } catch {
      // Fallback caso o arquivo seja aberto offline
      userPlan = localStorage.getItem("aprovado_user_plan") || "free";
    }
  }

  const params = new URLSearchParams(location.search);
  const mpPaymentId = params.get("payment_id") || params.get("collection_id") || "";
  const urlOrderId = params.get("order_id") || "";
  if (mpPaymentId || urlOrderId) {
    try {
      const q = mpPaymentId
        ? `payment_id=${encodeURIComponent(mpPaymentId)}`
        : `order_id=${encodeURIComponent(urlOrderId)}`;
      const resp = await fetch(`/api/verify-payment?${q}`);
      const data = await resp.json();
      if (data && data.verified) {
        activateVerifiedPlan(data.plan, data.paymentId, data.licenseToken);
        window.history.replaceState({}, document.title, location.pathname);
      } else if (mpPaymentId) {
        toast("Aguardando confirmação oficial do pagamento pelo Mercado Pago…");
      }
    } catch {}
  }
})();

const state = {
  tpl: "ats",
  photo: true,
  photoDataUrl: localStorage.getItem("aprovado_photo") || "",
  photoShape: "round", // "round" | "square"
  color: COLORS[0],
  get watermark() {
    return userPlan === "free";
  },
  matchedKeywords: [],
  missingKeywords: [],
};

const $ = (s) => document.querySelector(s);
function saveCurrentState() {
  try {
    localStorage.setItem("aprovado_current_cv", JSON.stringify(cv));
  } catch (e) {}
}

// Configura worker do PDF.js de forma resiliente
if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
  try {
    const workerScript = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const blob = new Blob([`importScripts('${workerScript}');`], { type: "application/javascript" });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
  } catch (e) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
}

// ---------- Navegação entre telas com Suporte Completo a Voltar (←) e Avançar (→) ----------
function go(id, { push = true } = {}) {
  if (!id) id = "home";
  const targetScreen = document.getElementById(id);
  if (!targetScreen || !targetScreen.classList.contains("screen")) {
    id = "home";
  }

  // Ao ir para a tela de envio, garante que o modelo padrão seja o Corporativo/ATS (nunca Lattes travado)
  if (id === "upload") {
    if (state.tpl === "academico") {
      state.tpl = "ats";
    }
  }

  if (id === "template" || id === "lattes") {
    if (state.tpl === "academico" || id === "lattes") {
      applyOfficialLattesNorms(cv);
    } else {
      polishFullCV(cv);
      saveCurrentState();
    }
  }

  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo(0, 0);

  // Sincroniza com o histórico do navegador para as setas Voltar (←) e Avançar (→) funcionarem perfeitamente
  if (push && window.history && window.history.pushState) {
    if (!location.hash.startsWith("#cv=") && location.hash !== "#" + id) {
      history.pushState({ screen: id }, "", "#" + id);
    }
  }
  try {
    localStorage.setItem("aprovado_last_screen", id);
  } catch {}

  if (id === "review") renderForm();
  if (id === "template") renderEditor();
  if (id === "linkedin") renderLinkedIn();
  if (id === "lattes") renderLattesPage();
  if (id === "carta") renderCarta();
  if (id === "saved") renderSavedList();
}

// Responde imediatamente ao clique nas setas do navegador (← Voltar e → Avançar)
window.addEventListener("popstate", (e) => {
  if (location.hash.startsWith("#cv=")) return;
  const targetId = (e.state && e.state.screen) || location.hash.replace(/^#/, "") || "home";
  if (document.getElementById(targetId) && document.getElementById(targetId).classList.contains("screen")) {
    go(targetId, { push: false });
  } else {
    go("home", { push: false });
  }
});

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-go]");
  if (t) {
    const href = t.getAttribute("href");
    if (href && href.startsWith("#") && href !== "#") {
      if ($("#home").classList.contains("active")) {
        const section = document.querySelector(href);
        if (section) {
          e.preventDefault();
          section.scrollIntoView({ behavior: "smooth" });
          return;
        }
      } else {
        // Se estiver em outra tela e clicar em Como funciona, Modelos ou Planos
        e.preventDefault();
        go("home");
        setTimeout(() => {
          const section = document.querySelector(href);
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return;
      }
    }
    e.preventDefault();
    go(t.dataset.go);
  }
});

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}

// Cópia universal para a área de transferência (funciona mesmo abrindo o arquivo direto via file://)
async function copyText(text, successMsg = "Copiado ✓") {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast(successMsg);
      return true;
    }
  } catch (e) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    if (ok) {
      toast(successMsg);
      return true;
    }
  } catch (e) {}
  window.prompt("Para copiar, aperte Ctrl+C e clique em OK:", text);
  return false;
}

// Gera link compartilhável do currículo online (codificando os dados na URL)
function buildShareableLink() {
  try {
    const payload = {
      tpl: state.tpl,
      color: state.color,
      photo: false, // não inclui foto base64 na URL para manter o link curto
      cv,
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const baseUrl = location.href.split("#")[0].split("?")[0];
    return `${baseUrl}#cv=${encoded}`;
  } catch (e) {
    return location.href.split("#")[0];
  }
}

// Se abrir um link compartilhado (#cv=...), carrega o currículo automaticamente em modo visualização
(() => {
  if (location.hash.startsWith("#cv=")) {
    try {
      const raw = decodeURIComponent(escape(atob(location.hash.slice(4))));
      const data = JSON.parse(raw);
      if (data && data.cv) {
        cv = data.cv;
        state.tpl = normTpl(data.tpl);
        state.color = data.color || COLORS[0];
        setTimeout(() => {
          go("template");
          toast(`Currículo de ${cv.nome} aberto via link ✓`);
        }, 100);
      }
    } catch (e) {}
  } else {
    // Ao abrir ou atualizar (F5) a página, sempre começa na tela principal, no topo, mostrando o título
    if (window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (location.hash !== "#admin") {
      if (window.history && window.history.replaceState) {
        history.replaceState({ screen: "home" }, "", location.pathname + location.search + "#home");
      } else {
        location.hash = "#home";
      }
    }
    go("home", { push: false });
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    window.addEventListener("load", () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });
  }
})();

// ---------- Início: chips clicáveis + Pastinha para preencher Lattes do zero ----------
$("#homeTemplates").innerHTML =
  TEMPLATES.map(
    (t) =>
      `<button type="button" class="chip" data-pick-tpl="${t.id}">${t.id === "academico" ? "🎓 " : ""}${t.name} <small>· ${t.desc}</small></button>`
  ).join("") +
  `<button type="button" class="chip" id="homeJobChip" style="border-color:#86EFAC;background:#F0FDF4;color:#166534;font-weight:700;">🎯 Adaptar currículo para uma vaga</button>` +
  `<button type="button" class="chip" id="homeStartBlankLattesChip" style="border-color:#93C5FD;background:#EFF6FF;color:#1E3A8A;font-weight:700;">📂 Preencher Currículo Lattes do Zero</button>`;

$("#homeTemplates").addEventListener("click", (e) => {
  if (e.target.closest("#homeJobChip")) {
    state.tpl = "ats";
    go("upload");
    toast("Envie seu currículo e depois clique em “Ajustar p/ Vaga” para colar a descrição da vaga 🎯", 6000);
    return;
  }
  if (e.target.closest("#homeStartBlankLattesChip")) {
    startBlankLattes();
    return;
  }
  const b = e.target.closest("[data-pick-tpl]");
  if (!b) return;
  state.tpl = b.dataset.pickTpl;
  if (state.tpl === "academico") state.photo = false;
  go("template");
});

// ---------- Extração Real de Arquivos (PDF, DOCX, DOC, TXT) + IA Gemini ----------
function extractTextFromPDFBufferFallback(buf) {
  try {
    const uint8 = new Uint8Array(buf);
    const latin1Str = new TextDecoder("latin1").decode(uint8);
    const matches = [];
    const parenRegex = /\(([^()]{2,})\)/g;
    let m;
    while ((m = parenRegex.exec(latin1Str)) !== null) {
      const s = m[1].replace(/\\([()\\])/g, "$1").trim();
      if (s.length > 2 && /[\p{L}\p{N}]/u.test(s)) {
        matches.push(s);
      }
    }
    if (matches.length > 5) {
      return matches.join(" ");
    }
  } catch (e) {
    console.warn("Fallback de buffer PDF falhou:", e);
  }
  return "";
}

async function extractTextFromPDF(file) {
  if (!window.pdfjsLib) throw new Error("Biblioteca PDF.js não carregada.");
  const buf = await file.arrayBuffer();
  let pdf = null;
  try {
    pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
  } catch (err) {
    console.warn("Tentativa padrão de PDF.js falhou, tentando modo direto sem worker:", err);
    try {
      pdf = await window.pdfjsLib.getDocument({ data: buf, disableWorker: true }).promise;
    } catch (err2) {
      console.warn("Modo sem worker falhou, tentando fallback em buffer:", err2);
      const bufText = extractTextFromPDFBufferFallback(buf);
      if (bufText && bufText.length > 40) return bufText;
      throw new Error("Não foi possível abrir o arquivo PDF: " + (err2.message || err.message));
    }
  }

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const lines = [];
      let lastY = null;
      let lastStr = "";
      for (const item of content.items) {
        const str = item.str || "";
        if (!str && !item.hasEOL) continue;
        const y = Math.round(item.transform[5]);
        if (lastY !== null && Math.abs(y - lastY) > 4) {
          lines.push("\n");
        } else if (lines.length && lastStr) {
          const prevEndsSpace = /\s$/.test(lastStr);
          const currStartsSpace = /^\s/.test(str);
          if (!prevEndsSpace && !currStartsSpace) {
            // Não insere espaço se uma das partes for letra isolada ou separador de barra/data (evita "N ov/2024")
            const isWordSplice = (str.length === 1 && /[A-Za-z0-9]/.test(str)) || (lastStr.length === 1 && /[A-Za-z0-9]/.test(lastStr)) || str === "/" || lastStr === "/";
            if (!isWordSplice) {
              lines.push(" ");
            }
          }
        }
        lines.push(str);
        lastY = y;
        lastStr = str;
      }
      fullText += lines.join("") + "\n\n";
    } catch (pageErr) {
      console.warn(`Erro na página ${i} do PDF:`, pageErr);
    }
  }

  // Normaliza quebras acidentais de meses e datas do PDF (ex.: "N ov/2024" -> "Nov/2024")
  fullText = fullText.replace(/\b(J\s*an|F\s*ev|M\s*ar|A\s*br|M\s*ai|J\s*un|J\s*ul|A\s*go|S\s*et|O\s*ut|N\s*ov|D\s*ez)\s*(\/|\s+de\s+|\s+)\s*(\d{4})\b/gi, (m, mes, sep, ano) => {
    const cleanMes = mes.replace(/\s+/g, "");
    return cleanMes.charAt(0).toUpperCase() + cleanMes.slice(1).toLowerCase() + "/" + ano;
  });

  // Corrige espaços indevidos inseridos pela extração do PDF (ex.: "on - premises", "e - mail", "KVM )", "( Windows")
  fullText = fullText
    .replace(/\b([a-zà-ú]{1,5}) - ([a-zà-ú]{2,})\b/g, "$1-$2")
    .replace(/[ \t]+([)\],;:])/g, "$1")
    .replace(/([(\[])[ \t]+/g, "$1");

  const clean = fullText.trim();
  if (!clean || clean.length < 15) {
    const bufText = extractTextFromPDFBufferFallback(buf);
    if (bufText && bufText.length > 40) return bufText;
    throw new Error("PDF_NO_TEXT");
  }
  return clean;
}

async function extractTextFromDOC(file) {
  // 1. Tenta ler como texto / HTML / RTF (muitos arquivos .doc exportados por sistemas acadêmicos e corporativos são HTML ou RTF)
  try {
    const textContent = await file.text();
    if (textContent.includes("<html") || textContent.includes("<body") || textContent.includes("<table") || textContent.includes("<div") || textContent.includes("<p")) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(textContent, "text/html");
      doc.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
      const clean = (doc.body ? doc.body.innerText || doc.body.textContent : "") || "";
      if (clean.trim().length > 30) {
        return clean.trim();
      }
    }
    if (textContent.startsWith("{\\rtf")) {
      const cleanRtf = textContent
        .replace(/\\par[d]?/gi, "\n")
        .replace(/\\tab/gi, " ")
        .replace(/\\[a-z]+(-?\d+)? ?/gi, "")
        .replace(/[{}]/g, "")
        .trim();
      if (cleanRtf.length > 30) return cleanRtf;
    }
  } catch (e) {
    console.warn("Tentativa de leitura de .doc como texto falhou:", e);
  }

  // 2. Tenta mammoth (caso seja um .docx renomeado para .doc)
  const buf = await file.arrayBuffer();
  if (window.mammoth && typeof window.mammoth.extractRawText === "function") {
    try {
      const res = await window.mammoth.extractRawText({ arrayBuffer: buf });
      if (res && res.value && res.value.trim().length > 30) {
        return res.value.trim();
      }
    } catch {}
  }

  // 3. Fallback inteligente: decodificação de strings binárias de Word 97-2003 (OLE2 Binary)
  try {
    const uint8 = new Uint8Array(buf);
    const utf16Str = new TextDecoder("utf-16le", { fatal: false }).decode(uint8);
    const utf16Matches = utf16Str.match(/[\p{L}\p{N}\p{P}\s]{4,}/gu);
    if (utf16Matches) {
      const candidate = utf16Matches.join(" ").replace(/\s{2,}/g, " ").trim();
      if (candidate.length > 50) return candidate;
    }

    const latin1Str = new TextDecoder("iso-8859-1", { fatal: false }).decode(uint8);
    const latin1Matches = latin1Str.match(/[\p{L}\p{N}\p{P}\s]{4,}/gu);
    if (latin1Matches) {
      const candidate = latin1Matches.join(" ").replace(/\s{2,}/g, " ").trim();
      if (candidate.length > 50) return candidate;
    }
  } catch (err) {
    console.warn("Extração binária de .doc falhou:", err);
  }

  throw new Error("DOC_LEGACY_FORMAT");
}

async function extractTextFromDOCX(file) {
  const buf = await file.arrayBuffer();
  if (window.mammoth && typeof window.mammoth.extractRawText === "function") {
    try {
      const res = await window.mammoth.extractRawText({ arrayBuffer: buf });
      if (res && res.value && res.value.trim()) {
        return res.value.trim();
      }
    } catch (e) {
      console.warn("Mammoth falhou no .docx, tentando fallback:", e);
    }
  }
  return await extractTextFromDOC(file);
}

// Analisador local inteligente que preserva 100% dos dados reais do texto extraído
function parseResumeTextLocally(rawText) {
  const text = rawText.replace(/\r/g, "").trim();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return structuredClone(SAMPLE_CV);

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phone = extractPhoneFromText(text);
  const liMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const lattesMatch = text.match(/(?:https?:\/\/)?lattes\.cnpq\.br\/\d+/i);
  const orcidMatch = text.match(/(?:https?:\/\/)?orcid\.org\/[\d\-X]+/i);

  const nome = lines[0].length <= 60 ? lines[0] : "Seu Nome Completo";
  // Divide por cabeçalhos comuns de currículo (incluindo seções acadêmicas, operacionais e objetivos)
  const secRegex = /^(resumo|objetivo|sobre|perfil|cargos?\s+pretendidos?|fun[çc][õo]es?\s+pretendidas?|cargo\s+desejado|[áa]rea\s+de\s+interesse|linhas?\s+de\s+pesquisa|interesses?\s+de\s+pesquisa|experi[êe]ncia|hist[óo]rico\s+profissional|fun[çc][õo]es?\s+exercidas?|cargos?\s+exercidos?|experi[êe]ncias?\s+anteriores|atua[çc][ãa]o|doc[êe]ncia|atividades?\s+de\s+ensino|forma[çc][ãa]o|educa[çc][ãa]o|acad[êe]mic|titula[çc][ãa]o|habilidades|compet[êe]ncias|skills|idiomas|l[íi]nguas|profici[êe]ncia|cursos|certifica[çc][õo]es|publica[çc][õo]es|produ[çc][ãa]o\s+cient[íi]fica|artigos|congressos|inicia[çc][ãa]o\s+cient[íi]fica|projetos\s+de\s+pesquisa)/i;

  let cargo = "";
  for (let i = 1; i < Math.min(lines.length, 6); i++) {
    const candidate = lines[i].trim();
    if (secRegex.test(candidate)) break;
    if (candidate.includes("@") || candidate.includes("linkedin.com") || candidate.includes("lattes.cnpq.br")) continue;
    if (extractPhoneFromText(candidate)) continue;
    if (isLocationText(candidate) || isRealCityUfLine(candidate)) continue;
    if (candidate.length <= 80 && !/^(telefone|celular|contato|endere[çc]o|e-?mail|cidade|resumo|experi)/i.test(candidate)) {
      cargo = candidate;
      break;
    }
  }

  const headerLines = [];
  for (let i = 0; i < Math.min(lines.length, 12); i++) {
    const ln = lines[i];
    if (i > 1 && secRegex.test(ln)) break;
    headerLines.push(ln);
  }
  const cidade = extractCityStateFromText(text, headerLines, phone);
  const sections = { header: [], resumo: [], exp: [], form: [], hab: [], idi: [], pub: [] };
  let current = "header";

  for (let i = 1; i < lines.length; i++) {
    const ln = lines[i];
    const isEducationItem = /^ensino\s+(m[ée]dio|superior|fundamental|t[ée]cnico|b[áa]sico|de\s+2[ºo]\s*grau)/i.test(ln);
    if (ln.length < 60 && secRegex.test(ln) && !isEducationItem) {
      if (/^(resumo|objetivo|sobre|perfil|cargos?\s+pretendidos?|fun[çc][õo]es?\s+pretendidas?|cargo\s+desejado|[áa]rea\s+de\s+interesse|linhas?\s+de\s+pesquisa|interesses?)/i.test(ln)) {
        current = "resumo";
        const cpMatch = ln.match(/^(?:cargos?\s+pretendidos?|fun[çc][õo]es?\s+pretendidas?|cargo\s+desejado|objetivo(?:\s+profissional)?)\s*[:\-]?\s*(.+)$/i);
        if (cpMatch && cpMatch[1].trim() && (!cargo || cargo === "Profissional")) {
          cargo = cpMatch[1].trim();
        }
      }
      else if (/^(experi|hist[óo]rico|fun[çc][õo]es?\s+exercidas?|cargos?\s+exercidos?|atua[çc]|doc[êe]ncia|atividades?\s+de\s+ensino)/i.test(ln)) current = "exp";
      else if (/^(forma[çc]|educa[çc]|acad[êe]m|titula[çc])/i.test(ln)) current = "form";
      else if (/^(publica[çc]|produ[çc][ãa]o|artigos|congressos|inicia[çc][ãa]o|projetos de pesquisa)/i.test(ln)) current = "pub";
      else if (/^(habilidades|compet[êe]ncias|skills|cursos|certifica)/i.test(ln)) current = "hab";
      else if (/^(idiomas|l[íi]nguas|profici[êe]ncia)/i.test(ln)) current = "idi";
      continue;
    }
    // Se linha dentro do resumo tem "Assistente Administrativo / Recepcionista" logo após "Cargos pretendidos"
    if (current === "resumo" && (!cargo || cargo === "Profissional") && ln.length <= 60 && !ln.includes("@") && !ln.includes("http")) {
      const isWordy = ln.split(" ").length > 8 || /[.!?]$/.test(ln);
      if (!isWordy) cargo = ln;
    }
    sections[current].push(ln);
  }

  // Monta experiências identificando Empresa, Cargo, Período e Atividades (Padrão Brasil e Internacional)
  const experiencias = [];
  if (sections.exp.length) {
    const monthsList = "janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez";
    const englishMonths = "january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec";
    const allMonths = `${monthsList}|${englishMonths}`;

    const singleDatePat = `(?:\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}|\\d{1,2}\\/\\d{2,4}|(?:${allMonths})\\s*(?:\\/|\\s*de\\s*|\\s+)?\\s*\\d{2,4}|(?:19|20)\\d{2})`;
    const rangeSep = `(?:\\s*(?:[—–\\-]|a|at[ée]|to)\\s*)`;
    const endPat = `(?:${singleDatePat}|atual|presente|o\\s+momento|present|current|now)`;
    const dateRangeRe = new RegExp(`(${singleDatePat}${rangeSep}${endPat}|(?:desde|since)\\s+${singleDatePat})`, "i");
    const singleDateRe = new RegExp(`^\\s*${singleDatePat}\\s*$`, "i");

    // Rótulos explícitos inequívocos
    const empresaLabelRe = /^(?:empresa|institui[çc][ãa]o|companhia|empregador|organiza[çc][ãa]o)\s*[:\-]\s*(.+)$/i;
    const cargoLabelRe = /^(?:cargo|fun[çc][ãa]o(?:\s+exercida)?|cargo(?:\s+ocupado|\s+pretendido)?|atua[çc][ãa]o(?:\s+como)?|posi[çc][ãa]o)\s*[:\-]\s*(.+)$/i;
    
    // Divisores de seção/bloco que NUNCA devem virar cargo nem empresa
    const dividerOnlyRe = /^(?:fun[çc][õo]es?\s+exercidas?|cargos?\s+exercidos?|cargos?\s+pretendidos?|principais\s+atividades?|atividades?\s+desempenhadas?|atribui[çc][õo]es|responsabilidades?|principais\s+compet[êe]ncias|compet[êe]ncias(?:\s+t[ée]cnicas)?|habilidades|resumo\s+das\s+atividades|experi[êe]ncias?\s+anteriores?|outras\s+experi[êe]ncias?|hist[óo]rico(?:\s+profissional)?|demais\s+experi[êe]ncias?)\s*[:\-]?$/i;
    const activityPrefixRe = /^(?:principais\s+compet[êe]ncias|compet[êe]ncias(?:\s+t[ée]cnicas)?|principais\s+atividades?|atividades?\s+desempenhadas?|atribui[çc][õo]es|responsabilidades?|resumo\s+das\s+atividades)\s*[:\-]\s*(.*)$/i;

    const isCargoLike = (s) => {
      if (!s) return false;
      const str = s.trim();
      if (/[.!?;]$/.test(str) && !companySuffixRe.test(str)) return false;
      if (str.split(/\s+/).length > 9) return false;
      if (dividerOnlyRe.test(str)) return false;
      return /\b(analista|engenheir[oa]|desenvolvedor[a]?|developer|engineer|especialista|specialist|gerente|manager|coordenador[a]?|coordinator|supervisor[a]?|t[ée]cnic[oa]|technician|assistente|assistant|consultor[a]?|consultant|diretor[a]?|director|administrador[a]?|administrator|estagi[áa]ri[oa]|intern|operador[a]?|operator|arquiteto|arquiteta|architect|l[íi]der|lead|auxiliar|programador[a]?|vendedor[a]?|sales|atendente|motorista|designer|product|head|recepcionista|caixa|conferente|estoquista|repositor[a]?|ajudante|balconista|suporte|digitador[a]?|atendimento|telefonista|telemarketing|secret[áa]ri[oa]|vigilante|porteiro|zelador[a]?|advogad[oa]|psic[óo]log[oa]|contador[a]?|auditor[a]?|agent|agente|cx\s+agent|customer\s+experience|customer\s+service|customer\s+success|relacionamento|preposto|backoffice|helpdesk|service\s+desk|onboarding|opera[çc][õo]es)\b/i.test(str);
    };

    const isActionOrBullet = (s) => {
      if (/^[•\-*▪▸]/.test(s)) return true;
      if (s.length > 55 || (/[.!?]$/.test(s) && !/\.{2,}$/.test(s) && !companySuffixRe.test(s))) return true;
      if (actionVerbStart.test(s)) return true;
      return false;
    };

    let currentCompany = "";
    let currentExp = null;
    let pendingHeaders = [];
    let pendingExplicitEmpresa = "";
    let pendingExplicitCargo = "";

    const resolvePending = () => {
      let resolvedCargo = isCargoLike(pendingExplicitCargo) ? pendingExplicitCargo : "";
      let resolvedEmpresa = isCompanyLike(pendingExplicitEmpresa) ? pendingExplicitEmpresa : "";

      pendingHeaders = pendingHeaders.filter((h) => !isLocationText(h) && !isRealCityUfLine(h) && !dividerOnlyRe.test(h));

      if (!resolvedEmpresa && pendingHeaders.length > 0) {
        if (pendingHeaders.length === 1) {
          const h = pendingHeaders[0];
          const spl = splitInlineHeader(h);
          if (spl.cargo && spl.empresa) {
            if (!resolvedCargo) resolvedCargo = spl.cargo;
            resolvedEmpresa = spl.empresa;
          } else if (isCargoLike(h)) {
            if (!resolvedCargo) resolvedCargo = h;
          } else if (isCompanyLike(h)) {
            resolvedEmpresa = h;
          }
        } else if (pendingHeaders.length >= 2) {
          const first = pendingHeaders[0];
          const second = pendingHeaders[1];
          if (isCargoLike(first) && isCompanyLike(second)) {
            if (!resolvedCargo) resolvedCargo = first;
            resolvedEmpresa = second;
          } else if (isCompanyLike(first) && isCargoLike(second)) {
            resolvedEmpresa = first;
            if (!resolvedCargo) resolvedCargo = second;
          } else if (isCargoLike(first)) {
            if (!resolvedCargo) resolvedCargo = first;
            if (isCompanyLike(second)) resolvedEmpresa = second;
          } else if (isCompanyLike(first)) {
            resolvedEmpresa = first;
            if (isCargoLike(second)) resolvedCargo = second;
          }
        }
      }

      if (resolvedEmpresa && !isCompanyLike(resolvedEmpresa)) {
        resolvedEmpresa = "";
      }
      if (resolvedCargo && !isCargoLike(resolvedCargo) && resolvedCargo !== cargo) {
        if (actionVerbStart.test(resolvedCargo) || resolvedCargo.length > 70 || dividerOnlyRe.test(resolvedCargo)) resolvedCargo = "";
      }

      if (resolvedEmpresa && isCompanyLike(resolvedEmpresa)) currentCompany = resolvedEmpresa;
      pendingHeaders = [];
      pendingExplicitCargo = "";
      pendingExplicitEmpresa = "";

      return {
        cargo: resolvedCargo || cargo || "Profissional",
        empresa: resolvedEmpresa || (isCompanyLike(currentCompany) ? currentCompany : "")
      };
    };

    const BULLET_CHARS = "•●○◦▪▫■□◆◇►▸▶➢➤✓✔·*";
    const bulletRe = new RegExp(`^[${BULLET_CHARS}]\\s*|^-\\s+`);
    const stripBullet = (s) => s.replace(bulletRe, "").trim();

    const actionVerbStart = /^(atua[çc][ãa]o|organiza[çc][ãa]o|cumprimento|trabalho|apoio|controle|atendimento|lideran[çc]a|acompanhamento|resolu[çc][ãa]o|comunica[çc][ãa]o|orienta[çc][ãa]o|tomada|suporte|execu[çc][ãa]o|desenvolvimento|gest[ãa]o|elabora[çc][ãa]o|manuten[çc][ãa]o|administra[çc][ãa]o|implementa[çc][ãa]o|respons[áa]vel|cria[çc][ãa]o|configura[çc][ãa]o|monitoramento|participa[çc][ãa]o|realiza[çc][ãa]o|condu[çc][ãa]o|treinamento|an[áa]lise|planejamento|garantia|recep[çc][ãa]o|agendamento|emiss[ãa]o|armazenamento|carga|descarga|separa[çc][ãa]o|confer[êe]ncia|uso|conhecimento|experi[êe]ncia|elabor|realiz|atend|control|organiz|auxili|apoi|respons|prepara|emiti|lan[çc]a|process|cadastr|execut|acompanh|manej|operac|opera[çc]|led|managed|developed|created|implemented|responsible|assisted|monitored|conducted|designed|maintained)/i;
    
    const isCompanyLike = (s) => {
      if (!s || typeof s !== "string") return false;
      const t = s.trim().replace(/^[\s—–\-|:,;()]+|[\s—–\-|:,;()]+$/g, "");
      if (!t || t.length < 2 || t.length > 70) return false;
      if (/[.!?;:]$/.test(t) && !companySuffixRe.test(t) && !/\.{2,}$/.test(t)) return false;
      const n = normTxt(t);
      if (LOCATION_WORDS.has(n) || isLocationText(t) || isRealCityUfLine(t)) return false;
      if (dividerOnlyRe.test(t)) return false;
      if (/^(principais|competencias|habilidades|atividades|responsabilidades|atribuicoes|experiencias|historico|funcoes|cargos|resumo|objetivo|outras)\b/i.test(t)) return false;
      if (actionVerbStart.test(t)) return false;
      if (/^(uso|conhecimento|experi[êe]ncia|dom[íi]nio|viv[êe]ncia|atua[çc][ãa]o|gest[ãa]o|controle|administra[çc][ãa]o|automa[çc][ãa]o|monitoramento|disponibilidade|seguran[çc]a|rotinas?|processos?|atividades?|responsabilidades?)\b/i.test(t)) return false;
      if (/\b(pacote\s+office|office|excel|word|powerpoint|powershell|linux|windows|zabbix|vmware|aws|cloud|python|sql|mysql|oracle|postgre|banco\s+de\s+dados|audi[êe]ncias|relat[óo]rios|notas\s+fiscais)\b/i.test(t)) return false;
      const words = t.split(/\s+/);
      if (words.length > 7 && !/\b(ltda|s\.?\s?a|inc|corp|eireli|grupo|brasil|telecom|com[ée]rcio|ind[úu]stria)\b/i.test(t)) return false;
      if (isCargoLike(t)) return false;
      if (/^(e|ou|de|da|do|em|para|com|por|a|o)$/i.test(t)) return false;
      return true;
    };

    const companySuffixRe = /\b(ltda|s\.?\s?a|inc|llc|eireli|epp|corp|co|cia)\.?$/i;
    // Linha curta com cara de título (empresa/cargo), sem pontuação final de frase
    const looksLikeHeader = (s) => {
      if (!s || s.length > 70) return false;
      if (dividerOnlyRe.test(s)) return false;
      if (/[.!?;]$/.test(s) && !companySuffixRe.test(s) && !/\.{2,}$/.test(s)) return false;
      if (/^(uso|conhecimento|experi[êe]ncia)\b/i.test(s) && !isCargoLike(s)) return false;
      return true;
    };

    // Divide "Empresa: Cargo", "Cargo – Empresa", "Cargo na Empresa" em { cargo, empresa }
    const splitInlineHeader = (rawText) => {
      let t = stripBullet(rawText || "").replace(/^[\s—–\-|:,;()]+|[\s—–\-|:,;()]+$/g, "").trim();
      if (!t) return { cargo: "", empresa: "" };
      const hasInlineSep = /[:]\s*|\s+[—–\-|]\s+|\s+(?:na|no|em|@|at)\s+/i.test(t);
      if (!hasInlineSep && actionVerbStart.test(t) && !isCargoLike(t)) return { cargo: "", empresa: "" };

      // 1. Empresa: Cargo ou Cargo: Empresa
      const colon = t.match(/^([^:]{2,60}?)\s*:\s*(.{2,90})$/);
      if (colon && !/^(per[íi]odo|data|datas|cargo|fun[çc][ãa]o|empresa|respons[áa]vel|atividades?|principais)\b/i.test(colon[1].trim())) {
        const left = colon[1].trim();
        const right = colon[2].trim();
        if (isCargoLike(left) && isCompanyLike(right)) return { cargo: left, empresa: right };
        if (isCargoLike(right) && isCompanyLike(left)) return { cargo: right, empresa: left };
        if (isCargoLike(left) && (isLocationText(right) || isRealCityUfLine(right))) return { cargo: left, empresa: "" };
        if (isCompanyLike(left) && (isLocationText(right) || isRealCityUfLine(right))) return { cargo: "", empresa: left };
        if (isCargoLike(left) && !actionVerbStart.test(right) && !/[.!?;]$/.test(right)) return { cargo: left, empresa: isCompanyLike(right) ? right : "" };
      }

      // 2. Separadores " – ", " - ", " | "
      if (/\s+[—–\-|]\s+/.test(t)) {
        const parts = t.split(/\s+[—–\-|]\s+/).map((p) => p.trim()).filter(Boolean);
        const nonLocationParts = parts.filter((p) => !isLocationText(p) && !isRealCityUfLine(p) && !(/^[A-Za-z]{2}$/.test(p) && BRAZIL_UFS.has(p.toUpperCase())));
        if (nonLocationParts.length >= 2) {
          const p0 = nonLocationParts[0];
          const p1 = nonLocationParts.slice(1).join(" - ");
          if (isCargoLike(p0) && isCompanyLike(p1)) return { cargo: p0, empresa: p1 };
          if (isCargoLike(p1) && isCompanyLike(p0)) return { cargo: p1, empresa: p0 };
          if (isCargoLike(p0) && !actionVerbStart.test(p1) && !/[.!?;]$/.test(p1)) {
            return { cargo: p0, empresa: isCompanyLike(p1) ? p1 : "" };
          }
          if (isCompanyLike(p0) && isCargoLike(p1)) return { cargo: p1, empresa: p0 };
        } else if (nonLocationParts.length === 1) {
          const single = nonLocationParts[0];
          if (isCargoLike(single)) return { cargo: single, empresa: "" };
          if (isCompanyLike(single)) return { cargo: "", empresa: single };
        }
      }

      // 3. "Cargo na/no/em/@ Empresa"
      const prep = t.match(/^(.+?)\s+(?:na|no|em|@|at)\s+([A-ZÀ-Ý0-9].{1,60})$/);
      if (prep && isCargoLike(prep[1]) && isCompanyLike(prep[2])) {
        return { cargo: prep[1].trim(), empresa: prep[2].trim() };
      }

      if (isCargoLike(t)) return { cargo: t, empresa: "" };
      if (isCompanyLike(t)) return { cargo: "", empresa: t };
      return { cargo: "", empresa: "" };
    };

    for (let idx = 0; idx < sections.exp.length; idx++) {
      const rawLn = sections.exp[idx].trim();
      if (!rawLn) continue;

      // 1. Rótulos explícitos primeiro
      const empMatch = rawLn.match(empresaLabelRe);
      if (empMatch) {
        pendingExplicitEmpresa = empMatch[1].trim();
        currentCompany = pendingExplicitEmpresa;
        continue;
      }

      const cgMatch = rawLn.match(cargoLabelRe);
      if (cgMatch) {
        pendingExplicitCargo = cgMatch[1].trim();
        continue;
      }

      // 2. Se for prefixo de atividades ("Principais Competências: Atendimento..."), joga o texto para itens e não cria card novo
      const actPrefixMatch = rawLn.match(activityPrefixRe);
      if (actPrefixMatch) {
        const remaining = actPrefixMatch[1].trim();
        if (remaining) {
          if (!currentExp) {
            currentExp = { cargo: cargo || "Profissional", empresa: currentCompany || "", periodo: "", itens: [] };
            experiencias.push(currentExp);
          }
          currentExp.itens.push(stripBullet(remaining));
        }
        continue;
      }

      // 3. Se a linha for apenas divisor ("PRINCIPAIS COMPETÊNCIAS", "Atividades:", etc.) ou cidade, ignora
      if (dividerOnlyRe.test(rawLn) || isRealCityUfLine(rawLn) || isLocationText(stripBullet(rawLn))) {
        continue;
      }

      const hasBullet = bulletRe.test(rawLn);
      const unbulleted = stripBullet(rawLn);
      const dateMatch = unbulleted.match(dateRangeRe);

      // Linha com marcador só é considerada atividade se tiver texto longo antes da data (> 85 chars, ex.: parágrafo descritivo)
      const bulletIsActivity = dateMatch && hasBullet && (unbulleted.slice(0, dateMatch.index).trim().length > 85);

      if (dateMatch && !bulletIsActivity) {
        const periodo = dateMatch[1].trim();
        let beforeDate = unbulleted.slice(0, dateMatch.index).replace(/[\s—–\-|(:,]+$/, "").trim();
        let afterDate = unbulleted.slice(dateMatch.index + dateMatch[0].length).replace(/^[\s—–\-|):,]+/, "").trim();

        beforeDate = beforeDate.replace(/^(?:per[íi]odo|data|datas)\s*[:\-]\s*/i, "").trim();
        beforeDate = stripTrailingLocation(beforeDate);
        afterDate = stripTrailingLocation(afterDate);
        if (isLocationText(afterDate) || isRealCityUfLine(afterDate)) afterDate = "";
        if (isLocationText(beforeDate) || isRealCityUfLine(beforeDate)) beforeDate = "";

        // Se beforeDate terminou com separador e a próxima linha é continuação
        const next1 = sections.exp[idx + 1] ? sections.exp[idx + 1].trim() : "";
        const next1Unb = stripBullet(next1);
        if (beforeDate && /[\/\\|\-–—]$/.test(beforeDate) && isCargoLike(next1Unb) && !bulletRe.test(next1)) {
          beforeDate = beforeDate + " " + next1Unb;
          idx++;
        } else if (beforeDate && isCompanyLike(beforeDate + " " + next1Unb) && !bulletRe.test(next1) && !isCargoLike(next1Unb) && !dateRangeRe.test(next1Unb)) {
          beforeDate = beforeDate + " " + next1Unb;
          idx++;
        }

        const resolved = resolvePending();

        let inlineCargo = "";
        let inlineEmpresa = "";
        const inlineText = beforeDate && afterDate ? `${beforeDate} - ${afterDate}` : (beforeDate || afterDate);
        if (inlineText) {
          const sp = splitInlineHeader(inlineText);
          inlineCargo = sp.cargo;
          inlineEmpresa = sp.empresa;
        }

        let finalEmpresa = (isCompanyLike(inlineEmpresa) ? inlineEmpresa : "") || resolved.empresa || (isCompanyLike(currentCompany) ? currentCompany : "");
        if (finalEmpresa && isCompanyLike(finalEmpresa)) currentCompany = finalEmpresa;

        const finalCargo = inlineCargo || resolved.cargo || cargo || "Profissional";

        currentExp = {
          cargo: finalCargo,
          empresa: finalEmpresa,
          periodo: periodo,
          itens: []
        };
        experiencias.push(currentExp);
      } else if (hasBullet) {
        const next1 = sections.exp[idx + 1] ? sections.exp[idx + 1].trim() : "";
        const next1Unbulleted = stripBullet(next1);
        const next1IsDate = next1 && (dateRangeRe.test(next1Unbulleted) || singleDateRe.test(next1Unbulleted));
        const spInline = splitInlineHeader(unbulleted);
        const hasBothCargoEmpresa = Boolean(spInline.cargo && spInline.empresa);
        const isBulletHeader = (hasBothCargoEmpresa || (next1IsDate && (isCargoLike(unbulleted) || looksLikeHeader(unbulleted))));

        if (isBulletHeader) {
          if (hasBothCargoEmpresa) {
            if (next1IsDate) {
              pendingExplicitCargo = spInline.cargo;
              pendingExplicitEmpresa = spInline.empresa;
              currentCompany = spInline.empresa;
              continue;
            } else {
              if (pendingHeaders.length > 0 || pendingExplicitEmpresa || pendingExplicitCargo) {
                resolvePending();
              }
              currentExp = {
                cargo: spInline.cargo,
                empresa: spInline.empresa,
                periodo: "",
                itens: []
              };
              currentCompany = spInline.empresa;
              experiencias.push(currentExp);
              continue;
            }
          } else {
            pendingHeaders.push(stripTrailingLocation(unbulleted));
            continue;
          }
        }

        if (pendingHeaders.length > 0 || pendingExplicitEmpresa || pendingExplicitCargo) {
          const resolved = resolvePending();
          currentExp = {
            cargo: resolved.cargo,
            empresa: resolved.empresa,
            periodo: "",
            itens: []
          };
          experiencias.push(currentExp);
        } else if (!currentExp) {
          currentExp = {
            cargo: cargo || "Profissional",
            empresa: currentCompany || "",
            periodo: "",
            itens: []
          };
          experiencias.push(currentExp);
        }
        currentExp.itens.push(unbulleted);
      } else {
        // Lookahead: a próxima linha (não-marcador) é cargo ou data? Então a atual é cabeçalho
        const next1 = sections.exp[idx + 1] ? sections.exp[idx + 1].trim() : "";
        const next2 = sections.exp[idx + 2] ? sections.exp[idx + 2].trim() : "";
        const next1Bullet = bulletRe.test(next1);
        const next2Bullet = bulletRe.test(next2);
        const followedByHeaderCue =
          (!next1Bullet && (isCargoLike(next1) || dateRangeRe.test(next1))) ||
          (!next1Bullet && !next2Bullet && dateRangeRe.test(next2));

        const startsLower = /^[a-zà-öø-ÿ]/.test(unbulleted);
        const lastItem = currentExp && currentExp.itens.length ? currentExp.itens[currentExp.itens.length - 1] : "";
        const prevIncomplete =
          lastItem &&
          (/[,;:\(\-–—]\s*$/i.test(lastItem) ||
           /\b(e|ou|de|com|para|em|garantindo|atuando|incluindo)\s*$/i.test(lastItem));

        const headerShaped = looksLikeHeader(unbulleted);

        const spBoth = splitInlineHeader(unbulleted);

        const next1IsDateCheck = next1 && (dateRangeRe.test(stripBullet(next1)) || singleDateRe.test(stripBullet(next1)));
        if (spBoth.cargo && spBoth.empresa) {
          if (next1IsDateCheck) {
            pendingExplicitCargo = spBoth.cargo;
            pendingExplicitEmpresa = spBoth.empresa;
            currentCompany = spBoth.empresa;
            continue;
          } else {
            if (pendingHeaders.length > 0 || pendingExplicitEmpresa || pendingExplicitCargo) {
              resolvePending();
            }
            currentExp = {
              cargo: spBoth.cargo,
              empresa: spBoth.empresa,
              periodo: "",
              itens: []
            };
            currentCompany = spBoth.empresa;
            experiencias.push(currentExp);
            continue;
          }
        } else if (followedByHeaderCue || (headerShaped && !currentExp)) {
          // Cabeçalho de Empresa ou Cargo (ex.: "Loja Elétrica Ltda.", "iT.eam")
          pendingHeaders.push(stripTrailingLocation(unbulleted));
        } else if (currentExp && (startsLower || prevIncomplete) && !isCargoLike(unbulleted)) {
          // Linha quebrada da frase anterior (ex.: "garantindo \n disponibilidade e segurança")
          if (lastItem) currentExp.itens[currentExp.itens.length - 1] += " " + unbulleted;
          else currentExp.itens.push(unbulleted);
        } else if (currentExp && !followedByHeaderCue && (isActionOrBullet(unbulleted) || /\s+[—–\-|]\s+/.test(unbulleted))) {
          // Atividade ou subtítulo de função dentro da experiência atual (ex.: "Assistente Administrativo — Controle de entrada...")
          currentExp.itens.push(unbulleted);
        } else if (isActionOrBullet(unbulleted) && !isCargoLike(unbulleted)) {
          if (pendingHeaders.length > 0 || pendingExplicitEmpresa || pendingExplicitCargo) {
            const resolved = resolvePending();
            currentExp = {
              cargo: resolved.cargo,
              empresa: resolved.empresa,
              periodo: "",
              itens: []
            };
            experiencias.push(currentExp);
          } else if (!currentExp) {
            currentExp = {
              cargo: cargo || "Profissional",
              empresa: currentCompany || "",
              periodo: "",
              itens: []
            };
            experiencias.push(currentExp);
          }
          currentExp.itens.push(unbulleted);
        } else {
          pendingHeaders.push(stripTrailingLocation(unbulleted));
        }
      }
    }

    if (pendingHeaders.length > 0 || pendingExplicitEmpresa || pendingExplicitCargo) {
      const resolved = resolvePending();
      if (resolved.cargo || resolved.empresa) {
        experiencias.push({
          cargo: resolved.cargo,
          empresa: resolved.empresa,
          periodo: "",
          itens: ["Atuação e principais responsabilidades na função."]
        });
      }
    }

    // Limpeza de segurança: garante que rótulos divisores ou datas nunca fiquem no nome da empresa ou cargo
    experiencias.forEach((exp) => {
      if (exp.empresa && isLocationText(exp.empresa)) exp.empresa = "";
      if (exp.cargo && isLocationText(exp.cargo)) exp.cargo = cargo || "Profissional";
      if (!exp.itens || !exp.itens.length) {
        exp.itens = ["Atuação e principais responsabilidades na função."];
      }
      if (singleDateRe.test(exp.cargo) || dateRangeRe.test(exp.cargo) || dividerOnlyRe.test(exp.cargo)) {
        exp.cargo = cargo || "Profissional";
      }
      if (dividerOnlyRe.test(exp.empresa) || singleDateRe.test(exp.empresa) || dateRangeRe.test(exp.empresa)) {
        exp.empresa = "";
      }
    });
  }

  if (!experiencias.length) {
    const bodyLines = lines.slice(2).filter((l) => !l.includes("@"));
    experiencias.push({
      cargo: cargo || "Profissional",
      empresa: "Experiências extraídas do currículo",
      periodo: "Período informado",
      itens: bodyLines.length ? bodyLines : ["Descreva suas principais atividades e resultados alcançados."],
    });
  }

  // Se cargo principal estava vazio ou genérico, extrai o cargo mais recente das experiências
  if ((!cargo || cargo === "Profissional") && experiencias.length) {
    cargo = experiencias[experiencias.length - 1].cargo || experiencias[0].cargo;
  }

  const habRaw = sections.hab.join(", ").split(/[,•·;|]|\n/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 45);

  const parsedResult = {
    nome,
    cargo: cargo || "Profissional",
    email: emailMatch ? emailMatch[0] : "",
    telefone: phone || "",
    cidade: cidade || "",
    linkedin: liMatch ? liMatch[0].replace(/^https?:\/\/(www\.)?/, "") : "linkedin.com/in/seuperfil",
    resumo: sections.resumo.join(" ") || sections.header.filter((l) => l.length > 50).join(" ") || `Profissional atuando como ${cargo || "especialista"}, com foco em resultados, organização e melhoria contínua.`,
    experiencias,
    formacao: sections.form.join(" · ") || "Informe sua formação acadêmica e ano de conclusão",
    habilidades: habRaw.length ? [...new Set(habRaw)].slice(0, 15) : ["Comunicação", "Organização", "Trabalho em equipe", "Resolução de problemas"],
    idiomas: sections.idi.join(" · ") || "Português nativo",
    lattes: [lattesMatch ? lattesMatch[0] : "", orcidMatch ? orcidMatch[0] : ""].filter(Boolean).join(" | "),
    publicacoes: sections.pub.join("\n") || "",
  };
  polishFullCV(parsedResult);
  return parsedResult;
}

// Integração opcional com Gemini 3.8 Flash via Interactions API
async function parseWithGeminiAI(fileOrText, apiKey) {
  const schema = {
    type: "object",
    properties: {
      nome: { type: "string" },
      cargo: { type: "string" },
      email: { type: "string" },
      telefone: { type: "string" },
      cidade: { type: "string" },
      linkedin: { type: "string" },
      resumo: { type: "string" },
      experiencias: {
        type: "array",
        items: {
          type: "object",
          properties: {
            cargo: { type: "string" },
            empresa: { type: "string" },
            periodo: { type: "string" },
            itens: { type: "array", items: { type: "string" } },
          },
          required: ["cargo", "empresa", "periodo", "itens"],
        },
      },
      formacao: { type: "string" },
      habilidades: { type: "array", items: { type: "string" } },
      idiomas: { type: "string" },
    },
    required: ["nome", "cargo", "email", "telefone", "cidade", "linkedin", "resumo", "experiencias", "formacao", "habilidades", "idiomas"],
  };

  const prompt =
    "Extraia 100% das informações deste currículo em português para o formato JSON solicitado. REGRA ABSOLUTA: NÃO invente experiências, empresas, cursos ou números que não estejam no original. Corrija todos os erros de português, acentuação, gramática e digitação, e reescreva as descrições começando com verbos de ação fortes para alto desempenho em sistemas ATS. OBRIGATÓRIO: TODOS os campos, nomes de cidades (ex.: Belo Horizonte, MG), cargos e textos devem estar estritamente em PORTUGUÊS DO BRASIL. NUNCA use cirílico, russo ou qualquer outro idioma estrangeiro para cidades brasileiras.";

  const input = [];
  if (typeof fileOrText === "string") {
    input.push({ type: "text", text: prompt + "\n\nCURRÍCULO:\n" + fileOrText });
  } else {
    const base64 = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(fileOrText);
    });
    const isPdf = fileOrText.type === "application/pdf" || fileOrText.name.toLowerCase().endsWith(".pdf");
    input.push({
      type: isPdf ? "document" : "image",
      mime_type: isPdf ? "application/pdf" : fileOrText.type || "image/png",
      data: base64,
    });
    input.push({ type: "text", text: prompt });
  }

  const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      model: "gemini-3.8-flash",
      input,
      response_format: { type: "text", mime_type: "application/json", schema },
    }),
  });
  if (!resp.ok) throw new Error("Falha na chamada Gemini API");
  const data = await resp.json();
  const outText =
    data.output_text ||
    (data.steps || [])
      .filter((s) => s.type === "model_output")
      .flatMap((s) => s.content || [])
      .map((c) => c.text || "")
      .join("");
  return JSON.parse(outText);
}

async function processUploadedFile(file, { stayInEditor = false } = {}) {
  if (!file) return;
  const isEditorScreen = stayInEditor || ($("#template") && $("#template").classList.contains("active"));

  // Feedback visual imediato na tela correspondente
  if (isEditorScreen) {
    const box = $("#sideAttachBox");
    const ico = $("#sideAttachIco");
    const title = $("#sideAttachTitle");
    const sub = $("#sideAttachSub");
    const badge = $("#sideAttachBadge");
    if (box) box.classList.add("is-loading");
    if (ico) ico.textContent = "⏳";
    if (title) title.textContent = `Lendo "${file.name}"...`;
    if (sub) sub.textContent = "Extraindo experiências, formação e dados...";
    if (badge) badge.textContent = "Lendo...";
  } else {
    if ($("#loading")) $("#loading").hidden = false;
    if ($("#loadingText")) $("#loadingText").textContent = `Lendo "${file.name}"…`;
  }
  toast(`Lendo "${file.name}"... Aguarde um instante.`, 2500);

  try {
    const apiKey = localStorage.getItem("aprovado_gemini_key");
    const name = file.name.toLowerCase();
    let raw = "";

    if (apiKey && (name.endsWith(".pdf") || file.type.startsWith("image/"))) {
      if (isEditorScreen && $("#sideAttachSub")) $("#sideAttachSub").textContent = "Analisando com IA Gemini...";
      if ($("#loadingText")) $("#loadingText").textContent = "Analisando com IA Gemini 3.8 Flash (100% fiel)…";
      cv = await parseWithGeminiAI(file, apiKey);
    } else if (name.endsWith(".pdf")) {
      raw = await extractTextFromPDF(file);
      if (isEditorScreen && $("#sideAttachSub")) $("#sideAttachSub").textContent = "Organizando dados ATS...";
      if ($("#loadingText")) $("#loadingText").textContent = "Estruturando 100% das informações para ATS…";
      cv = apiKey ? await parseWithGeminiAI(raw, apiKey) : parseResumeTextLocally(raw);
    } else if (name.endsWith(".docx")) {
      raw = await extractTextFromDOCX(file);
      if (isEditorScreen && $("#sideAttachSub")) $("#sideAttachSub").textContent = "Organizando dados ATS...";
      if ($("#loadingText")) $("#loadingText").textContent = "Organizando experiências e competências…";
      cv = apiKey ? await parseWithGeminiAI(raw, apiKey) : parseResumeTextLocally(raw);
    } else if (name.endsWith(".doc") || name.endsWith(".rtf")) {
      raw = await extractTextFromDOC(file);
      if (isEditorScreen && $("#sideAttachSub")) $("#sideAttachSub").textContent = "Organizando dados do Word...";
      if ($("#loadingText")) $("#loadingText").textContent = "Importando currículo em Word (.doc)...";
      cv = apiKey ? await parseWithGeminiAI(raw, apiKey) : parseResumeTextLocally(raw);
    } else if (name.endsWith(".txt")) {
      raw = await file.text();
      cv = apiKey ? await parseWithGeminiAI(raw, apiKey) : parseResumeTextLocally(raw);
    } else if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(name)) {
      if (apiKey) {
        cv = await parseWithGeminiAI(file, apiKey);
      } else {
        throw new Error("IMAGE_NO_KEY");
      }
    } else {
      throw new Error("UNSUPPORTED_FORMAT");
    }

    // Se o texto extraído tem forte padrão Lattes (CNPq, Doutorado, Mestrado, Linhas de Pesquisa)
    if (raw && /lattes\.cnpq\.br|curr[ií]culo lattes|cnpq|produ[çc][ãa]o cient[íi]fica|linhas? de pesquisa/i.test(raw)) {
      if (state.tpl === "academico") {
        applyOfficialLattesNorms(cv);
      }
    } else {
      polishFullCV(cv);
    }

    saveCurrentState();
    toast(`"${file.name}" analisado e importado com sucesso ✓`, 3500);

    // Atualiza estado do botão lateral no editor
    const box = $("#sideAttachBox");
    const ico = $("#sideAttachIco");
    const title = $("#sideAttachTitle");
    const sub = $("#sideAttachSub");
    const badge = $("#sideAttachBadge");
    if (box) {
      box.classList.remove("is-loading");
      box.classList.add("attached");
    }
    if (ico) ico.textContent = "✓";
    if (title) title.textContent = "Currículo Anexado ✓";
    if (sub) sub.textContent = file.name;
    if (badge) badge.textContent = "Trocar";

    if (isEditorScreen) {
      renderEditor();
      renderCV();
      renderForm();
      go("template");
    } else {
      renderForm();
      go("review");
    }
  } catch (err) {
    console.error("Erro no processamento do arquivo:", err);
    let msg = "Não foi possível ler o arquivo automaticamente.";
    if (err.message === "DOC_LEGACY_FORMAT") {
      msg = "Arquivo no formato Word antigo binário (.doc). Por favor, salve no Word como .docx ou PDF e envie novamente.";
    } else if (err.message === "PDF_NO_TEXT") {
      msg = "O PDF enviado parece ser uma imagem digitalizada sem texto selecionável. Envie em Word (.docx) ou PDF com texto.";
    } else if (err.message === "IMAGE_NO_KEY") {
      msg = "Para ler foto de currículo impresso, configure sua chave Gemini gratuita na página inicial ou envie em PDF/Word.";
    } else if (err.message === "UNSUPPORTED_FORMAT") {
      msg = "Formato de arquivo não suportado. Por favor, envie em PDF, Word (.docx ou .doc) ou TXT.";
    } else if (err.message) {
      msg += ` (${err.message})`;
    }
    toast(msg, 6000);

    const box = $("#sideAttachBox");
    const ico = $("#sideAttachIco");
    const title = $("#sideAttachTitle");
    const sub = $("#sideAttachSub");
    const badge = $("#sideAttachBadge");
    if (box) box.classList.remove("is-loading");
    if (ico) ico.textContent = "📎";
    if (title) title.textContent = "Anexar / Trocar Currículo";
    if (sub) sub.textContent = "Tente enviar em PDF ou Word (.docx)";
    if (badge) badge.textContent = "Upload";

    if (isEditorScreen) {
      renderEditor();
      go("template");
    } else {
      go("upload");
    }
  } finally {
    if ($("#loading")) $("#loading").hidden = true;
    if ($("#file")) $("#file").value = "";
    if ($("#sideFileInput")) $("#sideFileInput").value = "";
  }
}

// Funções para preencher do zero dentro da plataforma (Currículo Lattes CNPq ou Currículo Corporativo)
function startBlankLattes() {
  state.tpl = "academico";
  state.photo = false;
  cv = {
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    cidade: "",
    linkedin: "",
    lattes: "",
    enderecoProfissional: "",
    resumo: "",
    formacao: "",
    formacaoComplementar: "",
    projetosPesquisa: "",
    publicacoes: "",
    eventosPremios: "",
    habilidades: [],
    idiomas: "",
    experiencias: [
      {
        cargo: "",
        empresa: "",
        periodo: "",
        itens: [""],
      },
    ],
  };
  saveCurrentState();
  go("review");
  toast("📂 Todas as 10 Pastas Oficiais do Currículo Lattes abertas para você preencher do zero ✓");
}

// Limpa qualquer tipo de caractere de marcação, símbolos soltos, traços ou espaços que o usuário tenha digitado
function cleanFreeUserLine(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/^[\s•*▪▸►‣⁃\-–—>+»#]+|\s+$/g, "")
    .replace(/^\d+[\.\)\-]\s*/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanMultilineBlock(rawBlock) {
  if (!rawBlock || typeof rawBlock !== "string") return "";
  return rawBlock
    .split(/\r?\n/)
    .map((line) => cleanFreeUserLine(line))
    .filter(Boolean)
    .map((line) => (/[.!?]$/.test(line) ? line : line + "."))
    .join("\n");
}

// Formata automaticamente qualquer linha de Livro, Capítulo, Artigo ou Congresso para a norma ABNT / Lattes CNPq
// O usuário pode escrever livremente numa linha (ex.: "Livro Educação Digital - Editora Vozes, página 10 a 45, 2024")
function formatLattesPublicationLine(rawLine, authorFullName) {
  if (!rawLine || typeof rawLine !== "string") return "";
  let s = cleanFreeUserLine(rawLine);
  if (!s) return "";

  // Remove rótulos iniciais informais como "Artigo:", "Livro:", "Publicação:" mantendo o conteúdo
  s = s.replace(/^(?:artigo|livro|obra|publica[çc][ãa]o|refer[êe]ncia)\s*[:\-–—]\s*/i, "");

  // Se escreveu "Capítulo X no livro Y" -> converte para "X. In: Y" (padrão ABNT de capítulo de livro)
  s = s.replace(
    /^(?:cap[íi]tulo\s*[:\-–—]?\s*)?(.+?)\s+(?:no\s+livro|em\s+livro|in\s*:)\s+(.+)$/i,
    "$1. In: $2"
  );

  // Normaliza Volume: "volume 29", "vol. 29", "vol 29" -> "v. 29"
  s = s.replace(/\b(?:volumes?|vols?\.?)\s*(\d+[A-Za-z0-9\-]*)/gi, "v. $1");

  // Normaliza Número / Fascículo: "número 3", "numero 3", "núm. 3", "num 3", "fascículo 2" -> "n. 3"
  s = s.replace(/\b(?:n[úu]meros?|n[úu]ms?\.?|fasc[íi]culos?)\s*(\d+[A-Za-z0-9\-]*)/gi, "n. $1");

  // Normaliza Edição: "2ª edição", "2a edicao", "edição 2" -> "2. ed."
  s = s.replace(/\b(\d+)[ªºa]?\s*edi[çc][ãa]o\b/gi, "$1. ed.");
  s = s.replace(/\bedi[çc][ãa]o\s+(\d+)\b/gi, "$1. ed.");

  // Normaliza Páginas: "página 10 a 25", "páginas 10-25", "pag 10 a 25", "pág. 10-25", "pg 10-25", "p. 10 a 25" -> "p. 10-25"
  s = s.replace(
    /\b(?:p[áa]ginas?|p[áa]gs?\.?|pgs?\.?|pp?\.?)\s*(\d+)\s*(?:a|até|ate|\-|–|—|\/)\s*(\d+)\b/gi,
    "p. $1-$2"
  );
  // Página única: "página 42", "pág 42", "pg. 42" -> "p. 42"
  s = s.replace(/\b(?:p[áa]ginas?|p[áa]gs?\.?|pgs?\.?)\s*(\d+)\b/gi, "p. $1");

  // Normaliza Ano no final: "ano 2024", "em 2024", "(2024)" -> ", 2024"
  s = s.replace(/[\s,;\-–—]*(?:no\s+ano\s+de|ano\s+de|ano|em)\s+((?:19|20)\d{2})\.?\s*$/i, ", $1.");
  s = s.replace(/\s*\(((?:19|20)\d{2})\)\.?\s*$/i, ", $1.");

  // Substitui separadores informais " - " ou " – " entre título/revista/editora por pontuação limpa
  s = s.replace(/\s+[\-–—]\s+(?=(?:v\.|n\.|p\.|(?:19|20)\d{2})\b)/gi, ", ");
  s = s.replace(/\s+[\-–—]\s+/g, ". ");

  // Garante vírgula antes de v., n., p. quando vierem colados apenas com espaço
  s = s.replace(/([^\.,;:])\s+\b(v\.\s*\d+|n\.\s*\d+|p\.\s*\d+)/gi, "$1, $2");

  // Limpa pontuações duplicadas (ex.: "..", ",.", ",,")
  s = s
    .replace(/\.\s*\./g, ".")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*\./g, ".")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();

  if (!/[.!?]$/.test(s)) s += ".";

  // Adiciona automaticamente o Nome em Citações Bibliográficas ABNT (SOBRENOME, N. M.) no início, se ainda não tiver
  const citFull = buildCitationName(authorFullName || cv.nome || "Candidato");
  const abntAuthor = citFull.split(";")[0].trim(); // Ex.: OLIVEIRA, M. C.
  const lastName = abntAuthor.split(",")[0].trim().toUpperCase();
  const alreadyHasAuthor =
    s.toUpperCase().startsWith(lastName + ",") ||
    /^[A-ZÀ-Ú]{2,},\s*(?:[A-ZÀ-Ú]\.\s*)+/.test(s);

  if (!alreadyHasAuthor && lastName && lastName !== "CANDIDATO" && lastName !== "AUTOR") {
    s = `${abntAuthor}. ${s}`;
  }
  return s;
}

function formatLattesPublicationsBlock(rawBlock, authorFullName) {
  if (!rawBlock || typeof rawBlock !== "string") return "";
  return rawBlock
    .split(/\r?\n/)
    .map((line) => formatLattesPublicationLine(line, authorFullName))
    .filter(Boolean)
    .join("\n");
}

function normalizeProperName(nameStr) {
  if (!nameStr || typeof nameStr !== "string") return "";
  const lowerParticles = new Set(["de", "da", "do", "das", "dos", "e"]);
  return nameStr
    .replace(/[^\p{L}\s'-]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, idx) => {
      const lw = w.toLowerCase();
      if (idx > 0 && lowerParticles.has(lw)) return lw;
      return lw.charAt(0).toUpperCase() + lw.slice(1);
    })
    .join(" ");
}

// Conversor Automático para as Normas Oficiais da Plataforma Lattes (CNPq - https://lattes.cnpq.br/)
// Permite que o usuário escreva normalmente (com qualquer caractere/formatação e inclusive em 1ª pessoa) e já saia nas normas do CNPq e ABNT
function formatToLattes3rdPerson(rawResumo, formacaoOrCv, cargoStr, habilidadesArr) {
  let formacaoStr = formacaoOrCv;
  if (formacaoOrCv && typeof formacaoOrCv === "object") {
    formacaoStr = formacaoOrCv.formacao;
    cargoStr = formacaoOrCv.cargo;
    habilidadesArr = formacaoOrCv.habilidades;
  }
  let txt = cleanFreeUserLine(rawResumo || "");
  if (!txt && !formacaoStr) return "";
  if (txt) {
    // Converte expressões comuns de 1ª pessoa para a 3ª pessoa exigida pelo CNPq
    const rules = [
      [/\b(eu\s+)?(sou\s+formad[oa]|me\s+formei|formei-me|conclu[íi]\s+(a\s+)?gradua[çc][ãa]o)\s+em\b/gi, "Possui graduação em"],
      [/\b(eu\s+)?fiz\s+(minha\s+|a\s+)?gradua[çc][ãa]o\s+em\b/gi, "Possui graduação em"],
      [/\b(eu\s+)?fiz\s+(meu\s+|o\s+)?mestrado\s+em\b/gi, "Possui mestrado em"],
      [/\b(eu\s+)?fiz\s+(meu\s+|o\s+)?doutorado\s+em\b/gi, "Possui doutorado em"],
      [/\b(eu\s+)?(fa[çc]o|curso|estou\s+cursando|estou\s+fazendo)\s+(o\s+)?mestrado\s+em\b/gi, "É mestrando(a) em"],
      [/\b(eu\s+)?(fa[çc]o|curso|estou\s+cursando|estou\s+fazendo)\s+(o\s+)?doutorado\s+em\b/gi, "É doutorando(a) em"],
      [/\b(eu\s+)?(fa[çc]o|curso|estou\s+cursando)\s+(a\s+)?gradua[çc][ãa]o\s+em\b/gi, "É graduando(a) em"],
      [/\b(eu\s+)?sou\s+(professor|professora|docente|pesquisador|pesquisadora|bolsista|mestrando|mestranda|doutorando|doutoranda)\b/gi, "Atualmente é $2"],
      [/\b(eu\s+)?tenho\s+experi[êe]ncia\s+(na\s+[áa]rea\s+de|em|com)\b/gi, "Tem experiência $2"],
      [/\b(eu\s+)?trabalho\s+com\b/gi, "Atua com"],
      [/\b(eu\s+)?atuo\s+(na\s+[áa]rea\s+de|em|com)\b/gi, "Atua $2"],
      [/\b(eu\s+)?pesquiso\b/gi, "Desenvolve pesquisas sobre"],
      [/\bmeus\s+interesses\s+de\s+pesquisa\b/gi, "Seus interesses de pesquisa"],
      [/\bminha\s+pesquisa\b/gi, "Sua pesquisa"],
      [/\bminha\s+disserta[çc][ãa]o\b/gi, "Sua dissertação"],
      [/\bminha\s+tese\b/gi, "Sua tese"],
      [/\bparticipei\s+de\b/gi, "Participou de"],
      [/\brealizei\b/gi, "Realizou"],
      [/\bdesenvolvi\b/gi, "Desenvolveu"],
    ];
    for (const [rgx, rep] of rules) {
      txt = txt.replace(rgx, rep);
    }
    txt = txt.charAt(0).toUpperCase() + txt.slice(1);
    if (!/[.!?]$/.test(txt)) txt += ".";
  }
  // Se o texto ainda não começa com "Possui" e o usuário preencheu a Formação, monta a abertura oficial do Lattes
  if (formacaoStr && !/^possui\s+/i.test(txt)) {
    const cleanForm = cleanFreeUserLine(formacaoStr.split(/[·\n]/)[0]).replace(/\.$/, "");
    if (cleanForm) txt = `Possui formação acadêmica em ${cleanForm}. ${txt}`.trim();
  }
  if (habilidadesArr && habilidadesArr.length && !/atuando\s+principalmente|tem\s+experi[êe]ncia/i.test(txt)) {
    txt += ` Tem experiência e interesse de pesquisa principalmente nos seguintes temas: ${habilidadesArr.slice(0, 6).join(", ")}.`;
  }
  return txt.trim();
}

function applyOfficialLattesNorms(targetCv) {
  polishFullCV(targetCv);
  if (targetCv.nome) targetCv.nome = normalizeProperName(targetCv.nome);
  if (targetCv.formacao) targetCv.formacao = cleanFreeUserLine(targetCv.formacao);
  if (targetCv.enderecoProfissional) targetCv.enderecoProfissional = cleanFreeUserLine(targetCv.enderecoProfissional);
  if (targetCv.formacaoComplementar) targetCv.formacaoComplementar = cleanMultilineBlock(targetCv.formacaoComplementar);
  if (targetCv.projetosPesquisa) targetCv.projetosPesquisa = cleanMultilineBlock(targetCv.projetosPesquisa);
  if (targetCv.publicacoes) targetCv.publicacoes = formatLattesPublicationsBlock(targetCv.publicacoes, targetCv.nome);
  if (targetCv.eventosPremios) targetCv.eventosPremios = cleanMultilineBlock(targetCv.eventosPremios);
  if (Array.isArray(targetCv.habilidades)) {
    targetCv.habilidades = targetCv.habilidades
      .flatMap((h) => String(h || "").split(/[,;|•\n]+/))
      .map((s) => cleanFreeUserLine(s).replace(/\.$/, ""))
      .filter(Boolean);
  }
  (targetCv.experiencias || []).forEach((exp) => {
    exp.cargo = cleanFreeUserLine(exp.cargo);
    exp.empresa = cleanFreeUserLine(exp.empresa);
    exp.itens = (exp.itens || [])
      .map((it) => cleanFreeUserLine(it).replace(/\.$/, ""))
      .filter(Boolean);
  });
  targetCv.resumo = formatToLattes3rdPerson(targetCv.resumo, targetCv.formacao, targetCv.cargo, targetCv.habilidades);
  saveCurrentState();
}

function startBlankCorp() {
  if (state.tpl === "academico") state.tpl = "ats";
  cv = {
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    cidade: "",
    linkedin: "",
    lattes: "",
    resumo: "",
    formacao: "",
    publicacoes: "",
    habilidades: [],
    idiomas: "",
    experiencias: [
      {
        cargo: "",
        empresa: "",
        periodo: "",
        itens: [""],
      },
    ],
  };
  saveCurrentState();
  go("review");
  toast("📝 Formulário de Currículo aberto em branco para você preencher do zero ✓");
}


if ($("#heroStartLattesBtn")) $("#heroStartLattesBtn").addEventListener("click", startBlankLattes);
if ($("#startBlankLattesBtn")) $("#startBlankLattesBtn").addEventListener("click", startBlankLattes);
if ($("#startBlankCorpBtn")) $("#startBlankCorpBtn").addEventListener("click", startBlankCorp);
if ($("#clearForBlankLattesBtn")) $("#clearForBlankLattesBtn").addEventListener("click", startBlankLattes);
if ($("#clearForBlankCorpBtn")) $("#clearForBlankCorpBtn").addEventListener("click", startBlankCorp);
if ($("#fillBlankLattesFromEditorBtn")) $("#fillBlankLattesFromEditorBtn").addEventListener("click", startBlankLattes);
if ($("#fillBlankCorpFromEditorBtn")) $("#fillBlankCorpFromEditorBtn").addEventListener("click", startBlankCorp);
if ($("#homeStartBlankLattesChip")) $("#homeStartBlankLattesChip").addEventListener("click", startBlankLattes);
if ($("#editCurrentLattesBtn")) {
  $("#editCurrentLattesBtn").addEventListener("click", () => {
    state.tpl = "academico";
    state.photo = false;
    go("review");
    toast("📂 Editando as pastas do seu Currículo Lattes ✓");
  });
}
if ($("#editCurrentCorpBtn")) {
  $("#editCurrentCorpBtn").addEventListener("click", () => {
    if (state.tpl === "academico") state.tpl = "ats";
    go("review");
    toast("✏️ Editando os dados do seu Currículo Profissional ✓");
  });
}
if ($("#modeBtnCorp")) {
  $("#modeBtnCorp").addEventListener("click", () => {
    if (state.tpl === "academico") {
      state.tpl = "ats";
      saveCurrentState();
      renderForm();
      toast("💼 Modo alternado para Currículo Profissional (Empresas / ATS) ✓");
    }
  });
}
if ($("#modeBtnLattes")) {
  $("#modeBtnLattes").addEventListener("click", () => {
    if (state.tpl !== "academico") {
      state.tpl = "academico";
      state.photo = false;
      saveCurrentState();
      renderForm();
      toast("🎓 Modo alternado para Currículo Lattes (Pastas Oficiais CNPq) ✓");
    }
  });
}
if ($("#editLattesFromGuideBtn")) {
  $("#editLattesFromGuideBtn").addEventListener("click", () => {
    state.tpl = "academico";
    go("review");
  });
}
if ($("#blankLattesFromGuideBtn")) {
  $("#blankLattesFromGuideBtn").addEventListener("click", startBlankLattes);
}

$("#useSample").addEventListener("click", () => {
  cv = structuredClone(SAMPLE_CV);
  saveCurrentState();
  toast("Currículo corporativo de exemplo carregado ✓");
  go("review");
});
if ($("#useLattesSample")) {
  $("#useLattesSample").addEventListener("click", () => {
    cv = structuredClone(SAMPLE_LATTES_CV);
    state.tpl = "academico";
    state.photo = false;
    saveCurrentState();
    toast("Currículo Lattes completo carregado no modelo CNPq ✓");
    go("template");
  });
}
$("#parseTextBtn").addEventListener("click", async () => {
  const raw = $("#pasteCvText").value.trim();
  if (!raw) {
    toast("Cole o texto do seu currículo primeiro.");
    return;
  }
  if (state.tpl === "academico") state.tpl = "ats";
  $("#loading").hidden = false;
  $("#loadingText").textContent = "Organizando texto do currículo…";
  const apiKey = localStorage.getItem("aprovado_gemini_key");
  try {
    cv = apiKey ? await parseWithGeminiAI(raw, apiKey) : parseResumeTextLocally(raw);
  } catch {
    cv = parseResumeTextLocally(raw);
  }
  saveCurrentState();
  $("#loading").hidden = true;
  toast("Texto transformado em currículo estruturado ✓");
  go("review");
});

// Listener da Área de Envio Principal (#upload)
const drop = $("#drop");
const fileInput = $("#file");
if (drop && fileInput) {
  drop.addEventListener("click", (e) => {
    if (e.target !== fileInput) {
      fileInput.click();
    }
  });
  drop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  });
  ["dragover", "dragenter"].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.add("over");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.remove("over");
    })
  );
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  });
}

// Listener da Janela Lateral de Upload no Editor (Anexar / Trocar Currículo sem sair da tela)
const sideFileInput = $("#sideFileInput");
const sideDrop = $("#sideDrop");
if (sideFileInput && sideDrop) {
  sideDrop.addEventListener("click", (e) => {
    if (e.target !== sideFileInput) {
      sideFileInput.click();
    }
  });
  sideDrop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      sideFileInput.click();
    }
  });
  sideFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0], { stayInEditor: true });
    }
  });
  ["dragover", "dragenter"].forEach((ev) =>
    sideDrop.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      sideDrop.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    sideDrop.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      sideDrop.classList.remove("dragover");
    })
  );
  sideDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0], { stayInEditor: true });
    }
  });
}

// Previne comportamento padrão de abrir arquivo solto na aba do navegador
window.addEventListener("dragover", (e) => {
  if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
    e.preventDefault();
  }
});
window.addEventListener("drop", (e) => {
  if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
    e.preventDefault();
  }
});

// ---------- Conferência (Edição completa + Experiências + Perguntas da IA) ----------
const FIELDS_CORP = [
  ["nome", "Nome completo", false, "Ex.: Mariana Costa Silva"],
  ["cargo", "Cargo alvo pretendido", false, "Ex.: Analista Administrativo / Engenheiro Civil"],
  ["email", "E-mail profissional", false, "Ex.: seu.nome@email.com"],
  ["telefone", "Telefone / WhatsApp", false, "Ex.: (11) 98765-4321"],
  ["cidade", "Cidade e Estado", false, "Ex.: São Paulo, SP"],
  ["linkedin", "URL do LinkedIn", false, "Ex.: linkedin.com/in/seunome"],
  ["lattes", "Link do Currículo Lattes ou Portfólio (opcional)", true, "Ex.: http://lattes.cnpq.br/..."],
  ["resumo", "Resumo profissional (suas principais competências e tempo de experiência)", true, "Ex.: Profissional com 5 anos de experiência na área..."],
  ["formacao", "Formação Acadêmica e Cursos Relevantes", true, "Ex.: Bacharelado em Administração — USP (2019–2023)"],
  ["publicacoes", "Certificações, Projetos ou Publicações (opcional)", true, "Ex.: Certificação PMP, Artigos ou Projetos relevantes..."],
  ["idiomas", "Idiomas e Nível", true, "Ex.: Inglês intermediário · Espanhol básico"],
];

const FIELDS_LATTES = [
  [
    "nome",
    "📂 1. Identificação — Seu Nome Completo (escreva normalmente; o sistema cria seu Nome em Citações ABNT sozinho)",
    false,
    "Ex.: Maria Clara Oliveira Santos",
  ],
  [
    "cargo",
    "📂 1. Identificação — Titulação Atual ou Vaga de Mestrado / Doutorado pretendida",
    false,
    "Ex.: Candidata ao Mestrado em Educação / Doutoranda em Biotecnologia",
  ],
  ["email", "📂 1. Contato — E-mail institucional ou principal", false, "Ex.: nome.sobrenome@universidade.edu.br"],
  ["telefone", "📂 1. Contato — Telefone / WhatsApp", false, "Ex.: (11) 98765-4321"],
  ["cidade", "📂 1. Localização — Cidade, Estado e País", false, "Ex.: São Paulo, SP — Brasil"],
  ["linkedin", "📂 1. Rede Acadêmica — LinkedIn ou ResearchGate (opcional)", false, "Ex.: linkedin.com/in/seunome"],
  [
    "lattes",
    "📂 1. Identificadores CNPq — Link do Currículo Lattes e ORCID (se já tiver; se não tiver, pode deixar em branco)",
    true,
    "Ex.: http://lattes.cnpq.br/0000000000000000 | ORCID: https://orcid.org/0000-0000-0000-0000",
  ],
  [
    "enderecoProfissional",
    "📂 2. Endereço Profissional / Institucional (Universidade, Faculdade, Escola ou Empresa onde estuda ou trabalha)",
    true,
    "Ex.: Universidade Federal de Minas Gerais, Faculdade de Educação, Av. Antônio Carlos, Belo Horizonte - MG",
  ],
  [
    "resumo",
    "📂 3. Texto Inicial do Lattes (Resumo): Escreva normalmente como num texto (pode escrever 'Me formei em...', 'Pesquiso...'; o sistema converte para a 3ª pessoa oficial do CNPq)",
    true,
    "Ex.: Me formei em Pedagogia pela UFPR em 2021, faço especialização em Educação Inclusiva e pesquiso alfabetização e tecnologias educacionais...",
  ],
  [
    "formacao",
    "📂 4. Formação Acadêmica / Titulação (Graduação, Especialização, Mestrado, Doutorado — escreva o curso, instituição, ano, título do TCC/Dissertação/Tese, Orientador e se teve bolsa)",
    true,
    "Ex.: Mestrado em Educação — USP (2023–2025, Dissertação: Tecnologias na Alfabetização, Orientadora: Profa. Dra. Ana Silva, Bolsista CAPES) · Graduação em Pedagogia — UFPR (2018–2021, TCC: Inclusão Escolar)",
  ],
  [
    "formacaoComplementar",
    "📂 5. Formação Complementar e Cursos de Curta Duração (Cursos de extensão, aperfeiçoamento ou minicursos com carga horária — um por linha)",
    true,
    "Ex.: 2023: Curso de Extensão em Metodologia da Pesquisa Científica (Carga horária: 40h) — UNICAMP.\n2022: Inglês Instrumental para Leitura Acadêmica (Carga horária: 60h) — UTFPR.",
  ],
  [
    "projetosPesquisa",
    "📂 6. Projetos de Pesquisa, Extensão ou Iniciação Científica (PIBIC / PIBITI / Grupos de Pesquisa — escreva normalmente um por linha)",
    true,
    "Ex.: 2022–2023: Iniciação Científica PIBIC/CNPq sobre Práticas Pedagógicas Digitais na UFPR (Orientadora: Profa. Dra. Ana Silva).\n2024–Atual: Grupo de Pesquisa em Educação e Tecnologia.",
  ],
  [
    "publicacoes",
    "📂 7. Produção Bibliográfica e Técnica (Artigos, Livros, Capítulos e Congressos — digite direto numa linha o nome do livro/artigo, revista/editora, página e ano do seu jeito; o filtro ajusta tudo para a norma ABNT/Lattes sozinho)",
    true,
    "Ex.: Práticas de alfabetização digital no ensino público - Revista Brasileira de Educação, volume 29, página 1 a 18, 2024\nLivro Educação Inclusiva na Prática, Editora Vozes, pág 15-120, 2023\nResumo expandido no Congresso Nacional de Educação (CONEDU), 2023",
  ],
  [
    "eventosPremios",
    "📂 8. Participação em Eventos, Congressos, Simpósios, Bancas e Prêmios / Títulos (um por linha)",
    true,
    "Ex.: Apresentação de pôster na Semana de Iniciação Científica da UFPR (2023).\nMenção Honrosa de Melhor Trabalho Acadêmico da Graduação (2021).",
  ],
  [
    "idiomas",
    "📂 9. Idiomas (escreva apenas o idioma e nível, ex.: 'Inglês intermediário, Espanhol básico'; o sistema gera sozinho a tabela Compreende / Fala / Lê / Escreve do CNPq)",
    true,
    "Ex.: Inglês intermediário · Espanhol básico · Português nativo",
  ],
];

function generateAIQuestions() {
  const qs = [];
  const allBullets = cv.experiencias.flatMap((x) => x.itens).join(" ");
  if (state.tpl === "academico") {
    qs.push("No Currículo Lattes, informe na pasta Formação o título do seu TCC/Dissertação/Tese, o nome do(a) Orientador(a) e se teve bolsa (CNPq, CAPES, FAPESP).");
    qs.push("Na pasta Produções, coloque um artigo, resumo de congresso ou projeto de Iniciação Científica por linha.");
  } else {
    if (!/\d+%|\d+\s*(clientes|contratos|pessoas|horas|reais|r\$|projetos)/i.test(allBullets)) {
      qs.push("Adicione números aos seus resultados (ex.: \"reduzi custos em 15%\" ou \"atendi 80 clientes/mês\"). Currículos com métricas recebem até 40% mais retorno.");
    }
    if ((cv.resumo || "").length < 90) {
      qs.push("Seu resumo está curto. Inclua seus anos de experiência e 2 principais especialidades.");
    }
    if ((cv.habilidades || []).length < 5) {
      qs.push("Adicione pelo menos 6 habilidades técnicas (sistemas, ferramentas ou métodos da sua área) para pontuar melhor nos robôs ATS.");
    }
  }
  if (!qs.length) {
    qs.push("Excelente! Seu currículo já contém métricas quantificadas, bom resumo e palavras-chave fortes para o ATS.");
  }
  $("#aiQuestionsList").innerHTML = qs.map((q) => `<li>${q}</li>`).join("");
}

function renderForm() {
  const isLattes = state.tpl === "academico";
  if ($("#lattesFolderBar")) $("#lattesFolderBar").hidden = !isLattes;
  if ($("#reviewMainTitle")) {
    $("#reviewMainTitle").textContent = isLattes
      ? "📂 Preencher / Editar Currículo Lattes (Pastas Oficiais CNPq)"
      : "📝 Preencher e Conferir Dados do Currículo";
  }

  // Atualiza o seletor rápido no topo da página de conferência
  const btnCorp = $("#modeBtnCorp");
  const btnLattes = $("#modeBtnLattes");
  const subCorp = $("#modeSubCorp");
  const subLattes = $("#modeSubLattes");
  if (btnCorp && btnLattes) {
    if (isLattes) {
      btnLattes.classList.add("lattes-on");
      btnLattes.classList.remove("on");
      btnCorp.classList.remove("on", "lattes-on");
      if (subLattes) subLattes.textContent = "✓ Modo Atual Ativo";
      if (subCorp) subCorp.textContent = "Clique para alternar";
    } else {
      btnCorp.classList.add("on");
      btnCorp.classList.remove("lattes-on");
      btnLattes.classList.remove("on", "lattes-on");
      if (subCorp) subCorp.textContent = "✓ Modo Atual Ativo";
      if (subLattes) subLattes.textContent = "Clique para alternar";
    }
  }
  const activeFields = isLattes ? FIELDS_LATTES : FIELDS_CORP;
  generateAIQuestions();
  $("#reviewForm").innerHTML =
    activeFields
      .map(
        ([k, label, full, ph]) =>
          `<label class="${full ? "full" : ""}">${label}${
            full
              ? `<textarea data-k="${k}" placeholder="${(ph || "").replace(/"/g, "&quot;")}">${cv[k] || ""}</textarea>`
              : `<input data-k="${k}" placeholder="${(ph || "").replace(/"/g, "&quot;")}" value="${(cv[k] || "").replace(/"/g, "&quot;")}" />`
          }</label>`
      )
      .join("") +
    `<label class="full">${
      isLattes
        ? "📂 Pasta 6 (Áreas de Atuação, Linhas de Pesquisa e Metodologias — separadas por vírgula)"
        : "Habilidades e Palavras-chave (separadas por vírgula)"
    }<input data-k="habilidades" placeholder="${
      isLattes ? "Ex.: Biologia Molecular, Ensino Superior, Pesquisa Qualitativa, Bioestatística" : "Ex.: Excel Avançado, Gestão de Equipes, Atendimento, SAP"
    }" value="${(cv.habilidades || []).join(", ").replace(/"/g, "&quot;")}" /></label>`;

  $("#reviewForm").oninput = (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    cv[k] = k === "habilidades" ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean) : e.target.value;
    saveCurrentState();
    generateAIQuestions();
  };
  renderExpEditor();
}

function renderExpEditor() {
  const isLattes = state.tpl === "academico";
  $("#expList").innerHTML = cv.experiencias
    .map(
      (x, idx) => `
    <div class="exp-card" data-exp-idx="${idx}">
      <div class="exp-card-grid">
        <label>${isLattes ? "Vínculo / Função (ex.: Bolsista, Docente, Pesquisador)" : "Cargo"}<input data-exp-field="cargo" placeholder="${
        isLattes ? "Ex.: Bolsista de Mestrado CAPES / Professor Substituto" : "Ex.: Analista Administrativo"
      }" value="${(x.cargo || "").replace(/"/g, "&quot;")}" /></label>
        <label>${isLattes ? "Instituição / Universidade / Laboratório" : "Empresa"}<input data-exp-field="empresa" placeholder="${
        isLattes ? "Ex.: Universidade de São Paulo (USP)" : "Ex.: Nome da Empresa"
      }" value="${(x.empresa || "").replace(/"/g, "&quot;")}" /></label>
        <label>Período<input data-exp-field="periodo" placeholder="Ex.: 2023 – atual" value="${(x.periodo || "").replace(/"/g, "&quot;")}" /></label>
        <button type="button" class="btn btn-ghost btn-sm" data-remove-exp="${idx}" title="Remover experiência">🗑️</button>
      </div>
      <label>${
        isLattes
          ? "Atividades de Pesquisa, Docência, Monitoria ou Extensão realizadas neste vínculo (uma por linha)"
          : "Conquistas e responsabilidades (uma por linha, começando com verbo de ação)"
      }
        <textarea data-exp-field="itens" placeholder="Descreva uma atividade ou conquista por linha...">${(x.itens || []).join("\n")}</textarea>
      </label>
    </div>`
    )
    .join("");
}

$("#expList").addEventListener("input", (e) => {
  const card = e.target.closest("[data-exp-idx]");
  if (!card) return;
  const idx = Number(card.dataset.expIdx);
  const field = e.target.dataset.expField;
  if (!field) return;
  if (field === "itens") {
    cv.experiencias[idx].itens = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
  } else {
    cv.experiencias[idx][field] = e.target.value;
  }
  saveCurrentState();
  generateAIQuestions();
});

$("#expList").addEventListener("click", (e) => {
  const rm = e.target.closest("[data-remove-exp]");
  if (!rm) return;
  const idx = Number(rm.dataset.removeExp);
  if (cv.experiencias.length <= 1) {
    toast("Mantenha pelo menos uma experiência.");
    return;
  }
  cv.experiencias.splice(idx, 1);
  saveCurrentState();
  renderExpEditor();
});

$("#addExpBtn").addEventListener("click", () => {
  cv.experiencias.push({
    cargo: "",
    empresa: "",
    periodo: "",
    itens: [""],
  });
  saveCurrentState();
  renderExpEditor();
});

if ($("#applyLattesNormsBtn")) {
  $("#applyLattesNormsBtn").addEventListener("click", () => {
    applyOfficialLattesNorms(cv);
    renderForm();
    toast("🎓 Texto formatado nas Normas Oficiais do Lattes (3ª pessoa + ABNT + CNPq) ✓");
  });
}

if ($("#copyDevEmailBtn")) {
  $("#copyDevEmailBtn").addEventListener("click", () => {
    copyText("gfktech1977@gmail.com", "E-mail gfktech1977@gmail.com copiado ✓ Obrigado pelo seu contato!");
  });
}

// ---------- Cálculo de Pontuação ATS Real ----------
function computeATSScore() {
  let score = 55;
  if (cv.email && cv.telefone) score += 8;
  if ((cv.resumo || "").length >= 80) score += 10;
  if ((cv.habilidades || []).length >= 5) score += 10;
  const bullets = cv.experiencias.flatMap((x) => x.itens);
  if (bullets.length >= 3) score += 7;
  if (bullets.some((b) => /\d+/.test(b))) score += 10;
  if (state.tpl !== "ats" && state.photo) score -= 4; // Fotos reduzem nota apenas em robôs ATS puros
  return Math.min(100, Math.max(40, score));
}

// ---------- Editor de Modelos e Foto ----------
function renderEditor() {
  $("#tplGrid").innerHTML = TEMPLATES.map(
    (t) =>
      `<button type="button" class="tpl ${t.id === state.tpl ? "on" : ""}" data-tpl="${t.id}">${t.name}${
        t.id === "academico" ? `<span class="tpl-folder-badge" title="Possui pasta para preencher do zero">📂</span>` : ""
      }<small>${t.desc}</small></button>`
  ).join("");
  $("#colors").innerHTML = COLORS.map(
    (c) => `<button type="button" style="background:${c}" class="${c === state.color ? "on" : ""}" data-color="${c}" aria-label="Cor ${c}"></button>`
  ).join("");

  const t = TEMPLATES.find((x) => x.id === state.tpl);
  const blocked = t.photo === "blocked";
  document.querySelectorAll("#photoToggle button").forEach((b) => {
    b.disabled = blocked && b.dataset.photo === "1";
    b.classList.toggle("on", (blocked ? "0" : state.photo ? "1" : "0") === b.dataset.photo);
  });
  $("#photoControls").hidden = blocked || !state.photo;
  $("#photoRemoveBtn").hidden = !state.photoDataUrl;
  $("#photoShapeBtn").textContent = `Formato: ${state.photoShape === "round" ? "Redonda" : "Quadrada"}`;

  $("#colors").style.opacity = state.tpl === "ats" || state.tpl === "internacional" ? 0.35 : 1;
  $("#photoNote").textContent = {
    blocked: "🔒 No modelo ATS a foto fica desativada, porque atrapalha a leitura pelos sistemas.",
    warn: "⚠️ Nos EUA e no Reino Unido, o padrão é currículo sem foto.",
    warn_acad: "🎓 Em seleções de Mestrado e Doutorado (CAPES/CNPq/Universidades), o padrão recomendado pelas bancas é sem foto.",
    recommended: "✓ Foto recomendada neste modelo: transmite proximidade.",
    optional: "",
  }[t.photo];

  const sc = computeATSScore();
  $("#atsScoreVal").textContent = `${sc}/100`;
  $("#atsBarFill").style.width = `${sc}%`;
  $("#atsScoreHint").textContent =
    state.tpl === "ats"
      ? "Modo ATS puro ativo: estrutura 100% compatível com Gupy, Kenoby e LinkedIn."
      : "Modelo visual ativo: ótimo para enviar direto por e-mail, WhatsApp ou indicação.";

  // Atualiza status do plano e marca d'água no painel
  const box = $("#planStatusBox");
  const badge = $("#currentPlanBadge");
  const rmBtn = $("#removeWatermarkBtn");
  if (box && badge && rmBtn) {
    const isPaid = userPlan === "avulso" || userPlan === "pro";
    box.classList.toggle("paid", isPaid);
    badge.textContent =
      userPlan === "pro"
        ? "✓ Pro Completo Vitalício (Sem marca d'água)"
        : userPlan === "avulso"
        ? "✓ Intermediário / Avulso (Sem marca d'água)"
        : "Grátis (Com marca d'água)";
    rmBtn.hidden = isPaid;
  }

  // Atualiza as caixas rápidas de edição de Currículo Profissional e Lattes no painel lateral
  const corpBox = $("#corpQuickFolderBox");
  const lattesBox = $("#lattesQuickFolderBox");
  if (corpBox && lattesBox) {
    const isLattesTpl = state.tpl === "academico";
    if (isLattesTpl) {
      lattesBox.style.borderColor = "#3B82F6";
      lattesBox.style.background = "#EFF6FF";
      lattesBox.style.boxShadow = "0 4px 14px rgba(59,130,246,.18)";
      corpBox.style.borderColor = "var(--border)";
      corpBox.style.background = "#F8FAFC";
      corpBox.style.boxShadow = "none";
    } else {
      corpBox.style.borderColor = "var(--green)";
      corpBox.style.background = "#ECFDF5";
      corpBox.style.boxShadow = "0 4px 14px rgba(16,185,129,.18)";
      lattesBox.style.borderColor = "var(--border)";
      lattesBox.style.background = "#F8FAFC";
      lattesBox.style.boxShadow = "none";
    }
  }

  renderCV();
  $("#downloadBtn").textContent = state.tpl === "ats" ? "⬇ Baixar (Word · PDF · Foto) ▾" : "⬇ Baixar currículo ▾";
}

$("#tplGrid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tpl]");
  if (b) {
    state.tpl = b.dataset.tpl;
    if (state.tpl === "academico") {
      state.photo = false; // Padrão acadêmico desativa foto por padrão (mas permite ligar se o edital pedir)
      applyOfficialLattesNorms(cv);
    }
    renderEditor();
  }
});
$("#colors").addEventListener("click", (e) => {
  const b = e.target.closest("[data-color]");
  if (b && state.tpl !== "ats") {
    state.color = b.dataset.color;
    renderEditor();
  }
});
$("#photoToggle").addEventListener("click", (e) => {
  const b = e.target.closest("[data-photo]");
  if (b && !b.disabled) {
    state.photo = b.dataset.photo === "1";
    renderEditor();
  }
});
$("#photoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    state.photoDataUrl = r.result;
    state.photo = true;
    try {
      localStorage.setItem("aprovado_photo", state.photoDataUrl);
    } catch {}
    renderEditor();
    toast("Foto adicionada ao currículo ✓");
  };
  r.readAsDataURL(file);
});
$("#photoShapeBtn").addEventListener("click", () => {
  state.photoShape = state.photoShape === "round" ? "square" : "round";
  renderEditor();
});
$("#photoRemoveBtn").addEventListener("click", () => {
  state.photoDataUrl = "";
  localStorage.removeItem("aprovado_photo");
  renderEditor();
});
if ($("#removeWatermarkBtn")) {
  $("#removeWatermarkBtn").addEventListener("click", () => openCheckout("pro"));
}

// Gera automaticamente o "Nome em citações bibliográficas" no padrão oficial do CNPq (ex.: SOUZA, M.; SOUZA, Mariana)
function buildCitationName(fullName) {
  const ignore = new Set(["de", "da", "do", "das", "dos", "e"]);
  const parts = (fullName || "Candidato")
    .trim()
    .split(/\s+/)
    .filter((w) => !ignore.has(w.toLowerCase()));
  if (parts.length <= 1) return parts[0] ? parts[0].toUpperCase() : "AUTOR";
  const last = parts[parts.length - 1].toUpperCase();
  const initials = parts
    .slice(0, -1)
    .map((p) => p[0].toUpperCase() + ".")
    .join(" ");
  const firstFull = parts[0];
  return `${last}, ${initials}; ${last}, ${firstFull}`;
}

// Formata os idiomas para o padrão exato do Lattes CNPq (Compreende, Fala, Lê, Escreve)
function buildLattesIdiomas(idiomasStr) {
  const raw = (idiomasStr || "Português").split(/[·,;|\n]/).map((s) => s.trim()).filter(Boolean);
  if (!raw.length) raw.push("Português (Nativo)");
  return raw.map((item) => {
    const lower = item.toLowerCase();
    const lang = item.split(/\s+/)[0].replace(/[^A-Za-zÀ-ú]/g, "") || item;
    let lvl = "Razoavelmente";
    if (/avan[çc]ado|fluente|nativo/i.test(lower)) lvl = "Bem";
    else if (/b[áa]sico|iniciante/i.test(lower)) lvl = "Pouco";
    return {
      idioma: lang.charAt(0).toUpperCase() + lang.slice(1),
      detalhe: `Compreende ${lvl}, Fala ${lvl}, Lê ${lvl === "Pouco" ? "Razoavelmente" : "Bem"}, Escreve ${lvl}.`,
    };
  });
}

function renderCV() {
  // Higieniza experiências caso o usuário tenha um estado anterior com cargo corrompido com data
  (cv.experiencias || []).forEach((x) => {
    const dateRe = /^(?:(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s*(?:\/|\s*de\s*|\s+)?\s*\d{2,4}|\d{1,2}\/\d{2,4}|(?:19|20)\d{2})/i;
    if (x.cargo && dateRe.test(x.cargo.trim()) && x.cargo.length <= 30) {
      if (!x.periodo) x.periodo = x.cargo;
      x.cargo = cv.cargo || "Profissional";
    }
  });
  const t = TEMPLATES.find((x) => x.id === state.tpl);
  const showPhoto = state.photo && t.photo !== "blocked";
  const en = state.tpl === "internacional";
  const L = en
    ? { resumo: "Professional Summary", exp: "Work Experience", form: "Education", hab: "Skills", idi: "Languages", contato: "Contact", pub: "Publications & Research" }
    : state.tpl === "academico"
    ? {
        resumo: "Resumo Acadêmico e Interesses de Pesquisa",
        form: "Formação Acadêmica e Titulação",
        pub: "Produção Científica, Publicações e Pesquisa",
        exp: "Experiência Acadêmica, Docência e Profissional",
        hab: "Metodologias, Ferramentas e Competências",
        idi: "Proficiência em Idiomas",
        contato: "Contato",
      }
    : { resumo: "Resumo Profissional", exp: "Experiência Profissional", form: "Formação Acadêmica", hab: "Habilidades", idi: "Idiomas", contato: "Contato", pub: "Publicações" };

  const initials = (cv.nome || "CV")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const shapeCls = state.photoShape === "square" ? "photo square" : "photo";
  const photo = showPhoto
    ? state.photoDataUrl
      ? `<div class="${shapeCls}"><img src="${state.photoDataUrl}" alt="Foto" /></div>`
      : `<div class="${shapeCls}">${initials}</div>`
    : "";

  const formatContactLink = (val, type) => {
    if (!val) return "";
    if (type === "email") {
      return `<a href="mailto:${val}" style="color:inherit;text-decoration:underline;">${val}</a>`;
    }
    if (type === "linkedin") {
      const url = val.startsWith("http") ? val : `https://${val}`;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;">${val}</a>`;
    }
    return val;
  };

  const contact = [
    cv.cidade,
    cv.telefone,
    formatContactLink(cv.email, "email"),
    formatContactLink(cv.linkedin, "linkedin"),
  ].filter(Boolean).join(" · ");
  const exp = cv.experiencias
    .map(
      (x) =>
        `<div class="job"><div class="job-h"><strong>${x.cargo}${x.empresa ? ` — ${x.empresa}` : ""}</strong><span>${x.periodo || ""}</span></div><ul>${(x.itens || [])
          .map((i) => `<li>${i}</li>`)
          .join("")}</ul></div>`
    )
    .join("");

  const hitSet = new Set(state.matchedKeywords.map((k) => k.toLowerCase()));
  const skills = `<div class="skills">${(cv.habilidades || [])
    .map((h) => `<span class="${hitSet.has(h.toLowerCase()) ? "kw-hit" : ""}">${h}</span>`)
    .join("")}</div>`;

  const lattesLine =
    state.tpl === "academico" && cv.lattes
      ? `<p class="acad-meta">Currículo Lattes / ORCID: <a href="${cv.lattes.startsWith("http") ? cv.lattes : `http://${cv.lattes}`}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;">${cv.lattes}</a></p>`
      : "";
  const pubLines = (cv.publicacoes || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const pubHTML =
    state.tpl === "academico" && pubLines.length
      ? `<h2>${L.pub}</h2><ul class="pub-list">${pubLines.map((p) => `<li>${p}</li>`).join("")}</ul>`
      : "";

  const color = state.tpl === "ats" || state.tpl === "internacional" ? "#111" : state.color;
  const formHTML = `<h2>${L.form}</h2><p>${cv.formacao}</p>`;
  const expHTML = `<h2>${L.exp}</h2>${exp}`;
  const habHTML = `<h2>${L.hab}</h2>${skills}`;

  let middleOrder = expHTML + formHTML + habHTML;
  if (state.tpl === "primeiro") middleOrder = formHTML + habHTML + expHTML;
  if (state.tpl === "tecnico") middleOrder = habHTML + expHTML + formHTML;
  if (state.tpl === "academico") middleOrder = formHTML + pubHTML + expHTML + habHTML;

  let html;
  if (state.tpl === "academico") {
    const citName = buildCitationName(cv.nome);
    const todayStr = new Date().toLocaleDateString("pt-BR");
    const lattesUrl = cv.lattes && cv.lattes.includes("lattes.cnpq.br") ? cv.lattes : "http://lattes.cnpq.br/0000000000000000";
    const resumoLattes = formatToLattes3rdPerson(cv.resumo, cv.formacao, cv.cargo, cv.habilidades);
    const idiomasLattes = buildLattesIdiomas(cv.idiomas);
    const expLattes = cv.experiencias
      .map(
        (x) => `
      <div class="lattes-inst">${x.empresa || "Instituição / Organização"}</div>
      <div class="lattes-grid">
        <b>${x.periodo || "Período"}</b>
        <div><strong>Vínculo:</strong> ${x.cargo || "Pesquisador / Profissional"} · <strong>Atividades:</strong> ${(x.itens || []).join("; ")}.</div>
      </div>`
      )
      .join("");
    const compLines = (cv.formacaoComplementar || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const projLines = (cv.projetosPesquisa || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const evLines = (cv.eventosPremios || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const pubItems = pubLines.length
      ? pubLines
          .map((p, i) => `<li><strong>${i + 1}.</strong> ${formatLattesPublicationLine(p, cv.nome)}</li>`)
          .join("")
      : `<li><strong>1.</strong> ${citName.split(";")[0]}. <em>(Adicione seus artigos, capítulos ou resumos em congressos na aba Editar Dados)</em>.</li>`;

    html = `<div class="cv academico" style="--accent:${color}">
      <div class="lattes-topbar">
        <strong>Currículo Lattes — Padrão Plataforma CNPq</strong>
        <span>Mestrado · Doutorado · Pesquisa</span>
      </div>
      <div class="lattes-meta">
        Endereço para acessar este CV: <strong>${lattesUrl}</strong> · Última atualização do currículo em ${todayStr}
      </div>
      <div class="head" style="display:flex;gap:14px;align-items:center;margin-bottom:8px;">
        ${photo}
        <div>
          <h1>${cv.nome || "Nome do Pesquisador(a)"}</h1>
          <p style="font-size:9pt;color:#333;">${contact}</p>
        </div>
      </div>
      <h2>Resumo</h2>
      <p>${resumoLattes}</p>
      <p class="lattes-summary-note">(Texto informado pelo autor — formatado nas normas da Plataforma Lattes / CNPq)</p>

      <h2>Identificação</h2>
      <div class="lattes-grid">
        <b>Nome</b><div>${cv.nome}</div>
        <b>Nome em citações bibliográficas</b><div>${citName}</div>
        <b>Lattes iD / ORCID</b><div>${lattesUrl}</div>
        <b>País de Nacionalidade</b><div>Brasil</div>
      </div>

      ${
        cv.enderecoProfissional
          ? `<h2>Endereço</h2>
      <div class="lattes-grid">
        <b>Endereço Profissional</b><div>${cv.enderecoProfissional}</div>
      </div>`
          : ""
      }

      <h2>Formação acadêmica/titulação</h2>
      <div class="lattes-grid">
        <b>Titulação / Curso</b><div>${cv.formacao}</div>
      </div>

      ${
        compLines.length
          ? `<h2>Formação Complementar</h2>
      <ul class="pub-list">${compLines.map((c) => `<li>${c}</li>`).join("")}</ul>`
          : ""
      }

      <h2>Atuação Profissional</h2>
      ${expLattes}

      ${
        projLines.length
          ? `<h2>Projetos de pesquisa e Iniciação Científica</h2>
      <ul class="pub-list">${projLines.map((pr) => `<li>${pr}</li>`).join("")}</ul>`
          : ""
      }

      <h2>Áreas de atuação e Linhas de Pesquisa</h2>
      <div class="lattes-grid">
        <b>Área / Programa</b><div>${cv.cargo}</div>
        <b>Temas e Metodologias</b><div>${(cv.habilidades || []).join(", ")}.</div>
      </div>

      <h2>Idiomas</h2>
      <div class="lattes-grid">
        ${idiomasLattes.map((id) => `<b>${id.idioma}</b><div>${id.detalhe}</div>`).join("")}
      </div>

      <h2>Produções (Bibliográfica, Científica e Técnica)</h2>
      <ol class="pub-list" style="list-style:none;padding-left:0;">${pubItems}</ol>

      ${
        evLines.length
          ? `<h2>Eventos, Congressos, Bancas e Prêmios / Títulos</h2>
      <ul class="pub-list">${evLines.map((ev) => `<li>${ev}</li>`).join("")}</ul>`
          : ""
      }
    </div>`;
  } else if (state.tpl === "moderno") {
    html = `<div class="cv moderno" style="--accent:${color}">
      <div class="side">${photo}<h2>${L.contato}</h2><p class="contact">${contact.split(" · ").join("<br>")}</p>${habHTML}<h2>${L.idi}</h2><p>${cv.idiomas}</p></div>
      <div class="main"><h1>${cv.nome}</h1><p class="role">${cv.cargo}</p><h2>${L.resumo}</h2><p>${cv.resumo}</p>${expHTML}${formHTML}</div></div>`;
  } else {
    html = `<div class="cv ${state.tpl}" style="--accent:${color}">
      <div class="head">${photo}<div><h1>${cv.nome}</h1><p class="role">${cv.cargo}</p><p class="contact">${contact}</p>${lattesLine}</div></div>
      <h2>${L.resumo}</h2><p>${cv.resumo}</p>
      ${middleOrder}
      <h2>${L.idi}</h2><p>${cv.idiomas}</p></div>`;
  }
  const wm = state.watermark ? `<p class="watermark">Criado gratuitamente com Adapta Currículo</p>` : "";
  $("#paper").innerHTML = html + wm;
}

// ---------- Download Direto (Word DOCX, PDF Texto Real para ATS, PDF Visual e Foto PNG) ----------
const fileBase = () => {
  const nome = (cv.nome || "Candidato").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "_");
  const tpl = TEMPLATES.find((x) => x.id === state.tpl).name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\W+/g, "");
  return `Curriculo_${nome}_${tpl}`;
};
function saveBlob(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
async function paperCanvas() {
  const paper = $("#paper");
  const prev = paper.style.transform;
  paper.style.transform = "none";
  const canvas = await html2canvas(paper, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  paper.style.transform = prev;
  return canvas;
}
async function downloadPDF() {
  if (state.tpl === "ats" || state.tpl === "internacional" || state.tpl === "academico") return downloadATSPDF();
  const canvas = await paperCanvas();
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const w = 210,
    h = (canvas.height * w) / canvas.width;
  const img = canvas.toDataURL("image/jpeg", 0.95);
  let y = 0;
  while (y < h) {
    if (y > 0) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, -y, w, h);
    y += 297;
  }
  pdf.save(fileBase() + ".pdf");
}

function downloadATSPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const M = 18,
    W = 210 - M * 2,
    BOTTOM = 297 - M;
  let y = M;
  const ensure = (h) => {
    if (y + h > BOTTOM) {
      pdf.addPage();
      y = M;
    }
  };
  const text = (t, { size = 10.5, bold = false, gap = 1.5, indent = 0 } = {}) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(String(t || ""), W - indent);
    const lh = size * 0.42;
    lines.forEach((ln) => {
      ensure(lh);
      pdf.text(ln, M + indent, y + lh * 0.8);
      y += lh;
    });
    y += gap;
  };
  const head = (t) => {
    ensure(12);
    y += 4;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11.5);
    pdf.text(t.toUpperCase(), M, y + 4);
    y += 6;
    pdf.setLineWidth(0.4);
    pdf.line(M, y, M + W, y);
    y += 3;
  };
  const en = state.tpl === "internacional";
  const acad = state.tpl === "academico";
  text(cv.nome, { size: 20, bold: true, gap: 1 });
  text(cv.cargo, { size: 11.5, bold: true, gap: 1 });
  // Linha de contatos com links clicáveis no PDF (LinkedIn e E-mail)
  const contactParts = [];
  if (cv.cidade) contactParts.push({ text: cv.cidade });
  if (cv.telefone) contactParts.push({ text: cv.telefone });
  if (cv.email) contactParts.push({ text: cv.email, url: `mailto:${cv.email}` });
  if (cv.linkedin) {
    const liUrl = cv.linkedin.startsWith("http") ? cv.linkedin : `https://${cv.linkedin}`;
    contactParts.push({ text: cv.linkedin, url: liUrl });
  }

  ensure(8);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  let curX = M;
  const contactY = y + 9.5 * 0.42 * 0.8;
  contactParts.forEach((part, idx) => {
    if (idx > 0) {
      pdf.setTextColor(100, 100, 100);
      pdf.text(" | ", curX, contactY);
      curX += pdf.getTextWidth(" | ");
    }
    if (part.url) {
      pdf.setTextColor(10, 102, 194);
      if (typeof pdf.textWithLink === "function") {
        pdf.textWithLink(part.text, curX, contactY, { url: part.url });
      } else {
        pdf.text(part.text, curX, contactY);
        if (typeof pdf.link === "function") {
          pdf.link(curX, contactY - 3, pdf.getTextWidth(part.text), 4, { url: part.url });
        }
      }
    } else {
      pdf.setTextColor(0, 0, 0);
      pdf.text(part.text, curX, contactY);
    }
    curX += pdf.getTextWidth(part.text);
  });
  pdf.setTextColor(0, 0, 0);
  y += 9.5 * 0.42 + 2;

  if (acad && cv.lattes) {
    const latUrl = cv.lattes.startsWith("http") ? cv.lattes : `http://${cv.lattes}`;
    ensure(8);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(0, 0, 0);
    const prefix = "Currículo Lattes / ORCID: ";
    pdf.text(prefix, M, y + 9.5 * 0.42 * 0.8);
    const prefixW = pdf.getTextWidth(prefix);
    pdf.setTextColor(10, 102, 194);
    if (typeof pdf.textWithLink === "function") {
      pdf.textWithLink(cv.lattes, M + prefixW, y + 9.5 * 0.42 * 0.8, { url: latUrl });
    } else {
      pdf.text(cv.lattes, M + prefixW, y + 9.5 * 0.42 * 0.8);
      if (typeof pdf.link === "function") {
        pdf.link(M + prefixW, y, pdf.getTextWidth(cv.lattes), 4, { url: latUrl });
      }
    }
    pdf.setTextColor(0, 0, 0);
    y += 9.5 * 0.42 + 2;
  }
  if (acad && cv.enderecoProfissional) text(`Endereço Profissional: ${cv.enderecoProfissional}`, { size: 9.5 });
  head(en ? "Professional Summary" : acad ? "Resumo (Texto Inicial do Currículo Lattes)" : "Resumo Profissional");
  text(acad ? formatToLattes3rdPerson(cv.resumo, cv) : cv.resumo);
  if (acad) {
    head("Formação Acadêmica / Titulação");
    text(cv.formacao);
    if (cv.formacaoComplementar) {
      head("Formação Complementar e Cursos de Extensão");
      cv.formacaoComplementar.split("\n").map((s) => s.trim()).filter(Boolean).forEach((fc) => text("• " + fc, { indent: 3, gap: 0.8 }));
    }
    if (cv.projetosPesquisa) {
      head("Projetos de Pesquisa / Iniciação Científica e Extensão");
      cv.projetosPesquisa.split("\n").map((s) => s.trim()).filter(Boolean).forEach((pr) => text("• " + pr, { indent: 3, gap: 0.8 }));
    }
    if (cv.publicacoes) {
      head("Produções Bibliográficas e Técnicas (Padrão ABNT)");
      cv.publicacoes.split("\n").map((s) => s.trim()).filter(Boolean).forEach((p) => text("• " + p, { indent: 3, gap: 0.8 }));
    }
    if (cv.eventosPremios) {
      head("Eventos, Congressos, Bancas e Prêmios");
      cv.eventosPremios.split("\n").map((s) => s.trim()).filter(Boolean).forEach((ev) => text("• " + ev, { indent: 3, gap: 0.8 }));
    }
  }
  head(en ? "Work Experience" : acad ? "Experiência Acadêmica, Docência e Profissional" : "Experiência Profissional");
  cv.experiencias.forEach((x) => {
    text(`${x.cargo}${x.empresa ? " - " + x.empresa : ""} (${x.periodo})`, { bold: true, gap: 1 });
    (x.itens || []).forEach((i) => text("• " + i, { indent: 3, gap: 0.8 }));
    y += 2;
  });
  if (!acad) {
    head(en ? "Education" : "Formação Acadêmica");
    text(cv.formacao);
  }
  head(en ? "Skills" : acad ? "Metodologias, Ferramentas e Competências" : "Habilidades");
  text((cv.habilidades || []).join(", "));
  head(en ? "Languages" : acad ? "Proficiência em Idiomas" : "Idiomas");
  text(cv.idiomas);
  if (state.watermark) {
    y += 6;
    text("Criado gratuitamente com Adapta Currículo", { size: 8.5 });
  }
  pdf.save(fileBase() + ".pdf");
}

async function downloadPNG() {
  const canvas = await paperCanvas();
  canvas.toBlob((b) => saveBlob(b, fileBase() + ".png"), "image/png");
}

async function downloadDOCX() {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, ExternalHyperlink } = window.docx;
  const en = state.tpl === "internacional";
  const acad = state.tpl === "academico";
  const color = state.tpl === "ats" || state.tpl === "internacional" ? "111111" : state.color.replace("#", "");
  const L = en
    ? ["Professional Summary", "Work Experience", "Education", "Skills", "Languages", "Publications & Research"]
    : acad
    ? [
        "Resumo Acadêmico e Interesses de Pesquisa",
        "Experiência Acadêmica, Docência e Profissional",
        "Formação Acadêmica e Titulação",
        "Metodologias, Ferramentas e Competências",
        "Proficiência em Idiomas",
        "Produção Científica, Publicações e Pesquisa",
      ]
    : ["Resumo Profissional", "Experiência Profissional", "Formação Acadêmica", "Habilidades", "Idiomas", "Publicações"];
  const font = state.tpl === "executivo" || state.tpl === "internacional" || acad ? "Georgia" : "Arial";
  const H = (t) =>
    new Paragraph({
      spacing: { before: 240, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color } },
      children: [new TextRun({ text: t.toUpperCase(), bold: true, color, font, size: 22 })],
    });
  const P = (t, o = {}) => new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: String(t || ""), font, size: 21, ...o })] });
  const exp = cv.experiencias.flatMap((x) => [
    P(`${x.cargo}${x.empresa ? " — " + x.empresa : ""}   (${x.periodo})`, { bold: true }),
    ...(x.itens || []).map((i) => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: i, font, size: 21 })] })),
  ]);
  const form = [
    H(L[2]),
    P(cv.formacao),
    ...(acad && cv.formacaoComplementar
      ? [
          H("Formação Complementar e Cursos de Extensão"),
          ...cv.formacaoComplementar
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((fc) => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: fc, font, size: 21 })] })),
        ]
      : []),
  ];
  const projSec =
    acad && cv.projetosPesquisa
      ? [
          H("Projetos de Pesquisa / Iniciação Científica e Extensão"),
          ...cv.projetosPesquisa
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((pr) => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: pr, font, size: 21 })] })),
        ]
      : [];
  const pubSec =
    acad && cv.publicacoes
      ? [
          H(L[5]),
          ...cv.publicacoes
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((p) => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: p, font, size: 21 })] })),
        ]
      : [];
  const evSec =
    acad && cv.eventosPremios
      ? [
          H("Eventos, Congressos, Bancas e Prêmios"),
          ...cv.eventosPremios
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((ev) => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: ev, font, size: 21 })] })),
        ]
      : [];
  const expSec = [H(L[1]), ...exp];

  // Constrói parágrafo de contatos com links clicáveis para E-mail e LinkedIn no Word (.docx)
  const contactRuns = [];
  if (cv.cidade) {
    contactRuns.push(new TextRun({ text: cv.cidade, font, size: 19 }));
  }
  if (cv.telefone) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: " · ", font, size: 19 }));
    contactRuns.push(new TextRun({ text: cv.telefone, font, size: 19 }));
  }
  if (cv.email) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: " · ", font, size: 19 }));
    if (typeof ExternalHyperlink === "function") {
      contactRuns.push(
        new ExternalHyperlink({
          children: [new TextRun({ text: cv.email, font, size: 19, color: "0A66C2", underline: {} })],
          link: `mailto:${cv.email}`,
        })
      );
    } else {
      contactRuns.push(new TextRun({ text: cv.email, font, size: 19 }));
    }
  }
  if (cv.linkedin) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: " · ", font, size: 19 }));
    const liUrl = cv.linkedin.startsWith("http") ? cv.linkedin : `https://${cv.linkedin}`;
    if (typeof ExternalHyperlink === "function") {
      contactRuns.push(
        new ExternalHyperlink({
          children: [new TextRun({ text: cv.linkedin, font, size: 19, color: "0A66C2", underline: {} })],
          link: liUrl,
        })
      );
    } else {
      contactRuns.push(new TextRun({ text: cv.linkedin, font, size: 19 }));
    }
  }
  const contactParagraph = new Paragraph({ spacing: { after: 60 }, children: contactRuns });

  let lattesParagraph = null;
  if (acad && cv.lattes) {
    const latUrl = cv.lattes.startsWith("http") ? cv.lattes : `http://${cv.lattes}`;
    if (typeof ExternalHyperlink === "function") {
      lattesParagraph = new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "Currículo Lattes / ORCID: ", font, size: 19, italics: true }),
          new ExternalHyperlink({
            children: [new TextRun({ text: cv.lattes, font, size: 19, color: "0A66C2", underline: {} })],
            link: latUrl,
          }),
        ],
      });
    } else {
      lattesParagraph = P(`Currículo Lattes / ORCID: ${cv.lattes}`, { size: 19, italics: true });
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
        children: [
          new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: cv.nome, bold: true, font, size: 40 })] }),
          P(cv.cargo, { bold: true, color }),
          contactParagraph,
          ...(lattesParagraph ? [lattesParagraph] : []),
          ...(acad && cv.enderecoProfissional ? [P(`Endereço Profissional: ${cv.enderecoProfissional}`, { size: 19 })] : []),
          H(L[0]),
          P(acad ? formatToLattes3rdPerson(cv.resumo, cv) : cv.resumo),
          ...(state.tpl === "primeiro" || acad ? [...form, ...projSec, ...pubSec, ...evSec, ...expSec] : [...expSec, ...form]),
          H(L[3]),
          P((cv.habilidades || []).join(" • ")),
          H(L[4]),
          P(cv.idiomas),
          ...(state.watermark
            ? [
                new Paragraph({
                  spacing: { before: 320 },
                  children: [new TextRun({ text: "Criado gratuitamente com Adapta Currículo", font, size: 17, color: "888888" })],
                }),
              ]
            : []),
        ],
      },
    ],
  });
  saveBlob(await Packer.toBlob(doc), fileBase() + ".docx");
}

const dlMenu = $("#dlMenu");
function renderDlMenu() {
  const ats = state.tpl === "ats";
  const isPaid = userPlan === "avulso" || userPlan === "pro";
  if (!isPaid) {
    const optsFree = {
      pdf_free: ["📄", "PDF ATS Grátis (Com marca d'água)", "Download gratuito imediato em formato ATS"],
      pdf: ["🔒", "PDF Sem Marca d'Água (Todos os 9 modelos)", "Liberar nos planos de R$ 19,90 ou R$ 29,90"],
      docx: ["🔒", "Word (DOCX Editável — Sem marca d'água)", "Liberar nos planos de R$ 19,90 ou R$ 29,90"],
      png: ["🔒", "Foto (PNG para WhatsApp — Sem marca d'água)", "Liberar nos planos de R$ 19,90 ou R$ 29,90"],
      link: ["🔗", "Copiar link do currículo", "Link compartilhável para enviar"],
    };
    dlMenu.innerHTML = ["pdf_free", "pdf", "docx", "png", "link"]
      .map((k) => `<button type="button" data-dl="${k}">${optsFree[k][0]} <span><b>${optsFree[k][1]}</b><small>${optsFree[k][2]}</small></span></button>`)
      .join("");
    return;
  }
  const opts = {
    docx: ["📝", "Word (DOCX)", ats ? "⭐ Recomendado para ATS · editável (Sem marca d'água)" : "Editável, sem marca d'água"],
    pdf: ["📄", "PDF", ats ? "Texto real, legível pelos sistemas ATS (Sem marca d'água)" : "Recomendado para e-mail e anexos (Sem marca d'água)"],
    png: ["🖼️", "Foto (PNG)", "Visualização rápida no WhatsApp (Sem marca d'água)"],
    link: ["🔗", "Copiar link do currículo", "Link compartilhável para enviar"],
  };
  const order = ats ? ["docx", "pdf", "png", "link"] : ["pdf", "docx", "png", "link"];
  dlMenu.innerHTML = order
    .map((k) => `<button type="button" data-dl="${k}">${opts[k][0]} <span><b>${opts[k][1]}</b><small>${opts[k][2]}</small></span></button>`)
    .join("");
}
$("#downloadBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  renderDlMenu();
  dlMenu.hidden = !dlMenu.hidden;
});
document.addEventListener("click", () => (dlMenu.hidden = true));
dlMenu.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-dl]");
  if (!b) return;
  dlMenu.hidden = true;
  const type = b.dataset.dl;
  if (type === "link") {
    const shareUrl = buildShareableLink();
    await copyText(shareUrl, "Link do currículo copiado para a área de transferência 🔗✓");
    return;
  }
  if (type === "pdf_free") {
    if (!window.jspdf) {
      toast("Sem internet para carregar o gerador. Tente novamente.");
      return;
    }
    toast("Gerando seu PDF ATS gratuito…");
    downloadATSPDF();
    toast("Download gratuito concluído ✓");
    return;
  }
  // Bloqueio antifraude de recursos pagos para usuários no plano Grátis
  if (userPlan === "free") {
    openCheckout("pro");
    toast("Escolha o Plano Intermediário (R$ 19,90) ou Pro Completo (R$ 29,90) para baixar sem marca d'água.");
    return;
  }
  const libs = { pdf: window.jspdf && (state.tpl === "ats" || window.html2canvas), png: window.html2canvas, docx: window.docx };
  if (!libs[type]) {
    toast("Sem internet para carregar o gerador. Tente novamente.");
    return;
  }
  toast("Gerando seu arquivo sem marca d'água…");
  try {
    if (type === "pdf") await downloadPDF();
    if (type === "png") await downloadPNG();
    if (type === "docx") await downloadDOCX();
    toast("Download concluído ✓");
  } catch (err) {
    console.error(err);
    toast("Não foi possível gerar o arquivo.");
  }
});

$("#whatsBtn").addEventListener("click", () => {
  const msg = encodeURIComponent(`Olá! Segue meu currículo para avaliação na vaga de ${cv.cargo}. Fico à disposição para conversar. — ${cv.nome}`);
  window.open(`https://wa.me/?text=${msg}`, "_blank");
});
if ($("#copyLinkDirectBtn")) {
  $("#copyLinkDirectBtn").addEventListener("click", () => {
    copyText(buildShareableLink(), "Link do currículo copiado para a área de transferência 🔗✓");
  });
}

// ---------- Ajuste por Vaga Específica (Match Score 0-100) ----------
const STOPWORDS = new Set([
  "para", "com", "que", "uma", "dos", "das", "nos", "nas", "por", "mais", "como", "mas", "foi", "sua", "seu",
  "são", "ser", "tem", "pelo", "pela", "até", "isso", "ela", "entre", "depois", "sem", "mesmo", "aos", "seus",
  "quem", "nas", "meio", "outros", "está", "estamos", "buscamos", "vaga", "empresa", "trabalho", "requisitos",
  "desejável", "experiência", "conhecimento", "atuação", "área", "rotinas", "ensino", "superior", "completo",
]);

$("#sampleJobBtn").addEventListener("click", () => {
  if ($("#jobTitleInput")) {
    $("#jobTitleInput").value = "Operador de Monitoramento / Analista Administrativo";
  }
  $("#jobUrlInput").value = "https://exemplo.gupy.io/jobs/849201";
  $("#jobDescInput").value =
    "Vaga: Operador de Monitoramento / Analista Administrativo-Financeiro.\nRequisitos: experiência em monitoramento de frotas e cargas em tempo real, rastreamento, tratativas de ocorrências, controle de planilhas em Excel avançado, contas a pagar e receber, conciliação bancária, indicadores KPIs, Power BI e sistema ERP SAP.";
  runJobCompatibilityAnalysis();
});

// Busca automática da vaga pelo Link (URL)
$("#fetchJobUrlBtn").addEventListener("click", async () => {
  const url = ($("#jobUrlInput").value || "").trim();
  if (!url) {
    toast("Cole o link (URL) da vaga primeiro.");
    return;
  }
  const btn = $("#fetchJobUrlBtn");
  const prevText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Lendo vaga…";
  try {
    const resp = await fetch(`/api/fetch-job?url=${encodeURIComponent(url)}`);
    const data = await resp.json();
    if (!resp.ok || data.error || !data.text || data.text.length < 40) {
      toast(data.error || "Este portal protege o link com login. Cole o texto da vaga no campo abaixo.");
    } else {
      $("#jobDescInput").value = data.text;
      // Tenta extrair o título da vaga do texto se o campo de título estiver vazio
      if ($("#jobTitleInput") && !$("#jobTitleInput").value.trim()) {
        const titleMatch = data.text.match(/(?:vaga|cargo|oportunidade|posi[çc][ãa]o)\s*[:\-–—]\s*([^\n\r.]+)/i);
        if (titleMatch && titleMatch[1]) {
          $("#jobTitleInput").value = titleMatch[1].trim();
        }
      }
      toast("Vaga lida pelo link! Calculando compatibilidade e formatando em ATS ✓");
      runJobCompatibilityAnalysis();
    }
  } catch (e) {
    toast("Não foi possível acessar o link diretamente. Cole a descrição da vaga no campo abaixo.");
  } finally {
    btn.disabled = false;
    btn.textContent = prevText;
  }
});

function runJobCompatibilityAnalysis() {
  const jobTitle = ($("#jobTitleInput") ? $("#jobTitleInput").value : "").trim();
  const jobText = ($("#jobDescInput") ? $("#jobDescInput").value : "").trim();

  if (!jobText && !jobTitle) {
    toast("Informe o nome do cargo ou cole a descrição da vaga primeiro.");
    return;
  }

  // Se o usuário informou o cargo da vaga desejada, alinha o cargo do currículo
  if (jobTitle) {
    cv.cargo = jobTitle;
    // Se o resumo profissional existir, alinha a abertura para o cargo desejado sem inventar dados
    if (cv.resumo) {
      if (!cv.resumo.toLowerCase().includes(jobTitle.toLowerCase())) {
        cv.resumo = cv.resumo.replace(
          /^(Profissional\s+com\s+s[óo]lida\s+atua[çc][ãa]o\s+em\s+)[^,.]+/i,
          `$1${jobTitle}`
        );
      }
    }
  }

  const combinedText = `${jobTitle} ${jobText}`.trim();
  const cvFull = JSON.stringify(cv).toLowerCase();

  // Extrai termos relevantes da vaga
  const words = combinedText
    .toLowerCase()
    .replace(/[.,;:()\/•\-"']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  const freq = {};
  words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  const topTerms = Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 14);

  const matched = [];
  const missing = [];
  topTerms.forEach((term) => {
    if (cvFull.includes(term)) matched.push(term);
    else missing.push(term);
  });

  state.matchedKeywords = matched;
  state.missingKeywords = missing;
  state.tpl = "ats"; // Seleciona automaticamente o padrão ATS

  const pct = topTerms.length ? Math.round((matched.length / topTerms.length) * 100) : 85;
  $("#jobMatchScore").textContent = `${pct}%`;

  $("#kwMatched").innerHTML = matched.length
    ? matched.map((k) => `<span class="kw-tag ok">✓ ${k}</span>`).join("")
    : `<span class="muted">Nenhuma palavra exata encontrada ainda.</span>`;

  $("#kwMissing").innerHTML = missing.length
    ? missing.map((k) => `<button type="button" class="kw-tag miss" data-add-kw="${k}" title="Clique se você domina isso para adicionar às habilidades">+ ${k}</button>`).join("")
    : `<span class="muted">Você já contempla todos os termos principais da vaga!</span>`;

  $("#jobAdaptAdvice").textContent =
    missing.length > 0
      ? `Seu currículo foi alinhado ao cargo "${cv.cargo}" no formato ATS! Clique nos termos amarelos que você domina para incluí-los e aumentar sua nota.`
      : `Excelente! Seu currículo está 100% alinhado com a vaga de "${cv.cargo}" no padrão ATS.`;

  saveCurrentState();
  renderEditor();
  $("#applyJobKeywordsBtn").hidden = false;
  toast(`Currículo adaptado para "${cv.cargo}" no formato ATS ✓`);
}

$("#analyzeJobBtn").addEventListener("click", runJobCompatibilityAnalysis);

$("#kwMissing").addEventListener("click", (e) => {
  const b = e.target.closest("[data-add-kw]");
  if (!b) return;
  const kw = b.dataset.addKw;
  const formatted = kw.charAt(0).toUpperCase() + kw.slice(1);
  if (!cv.habilidades.some((h) => h.toLowerCase() === kw.toLowerCase())) {
    cv.habilidades.push(formatted);
    state.matchedKeywords.push(kw);
    saveCurrentState();
  }
  b.classList.remove("miss");
  b.classList.add("ok");
  b.textContent = "✓ " + kw;
  // Recalcula a % de compatibilidade na hora ao adicionar a competência
  const total = state.matchedKeywords.length + Math.max(0, state.missingKeywords.length - 1);
  state.missingKeywords = state.missingKeywords.filter((x) => x !== kw);
  const newPct = total ? Math.round((state.matchedKeywords.length / total) * 100) : 100;
  $("#jobMatchScore").textContent = `${newPct}%`;
  toast(`"${formatted}" adicionado! Compatibilidade subiu para ${newPct}% ✓`);
});

$("#applyJobKeywordsBtn").addEventListener("click", () => {
  state.tpl = "ats";
  toast("Currículo formatado em ATS e alinhado com a vaga ✓");
  go("template");
});

// ---------- Pacote LinkedIn ----------
function renderLinkedIn() {
  const blocks = [
    ["Título (Headline)", `${cv.cargo} | ${(cv.habilidades || []).slice(0, 4).join(" • ")} | Foco em resultados e melhoria de processos`, 220],
    [
      "Sobre (Resumo em 1ª pessoa)",
      `${cv.resumo}\n\nPrincipais entregas e resultados:\n${cv.experiencias
        .flatMap((x) => x.itens)
        .slice(0, 4)
        .map((i) => "✅ " + i)
        .join("\n")}\n\nPrincipais competências: ${(cv.habilidades || []).join(", ")}.\n\n📩 Aberto(a) a conexões e novas oportunidades na área de ${cv.cargo}.`,
      2600,
    ],
    ...cv.experiencias.map((x) => [`Experiência — ${x.empresa}`, `${x.cargo}\nPeríodo: ${x.periodo}\n\n${(x.itens || []).map((i) => "• " + i).join("\n")}`, 2000]),
    ["Competências para cadastrar no perfil", (cv.habilidades || []).join("\n"), null],
    [
      "Checklist de Perfil Campeão (Dicas Extras)",
      "1. URL personalizada: ajuste em 'Editar perfil público e URL' para ficar limpa.\n2. Foto profissional: rosto ocupando 60% do quadro, boa iluminação e fundo neutro.\n3. Selo #OpenToWork: ative visível 'Apenas para recrutadores' especificando o cargo " +
        cv.cargo +
        ".",
      null,
    ],
  ];
  $("#liBlocks").innerHTML = blocks
    .map(
      ([title, text, max], i) => `
    <div class="li-block"><header><h3>${title}</h3><button type="button" class="btn btn-ghost btn-sm" data-copy="li${i}">Copiar</button></header>
    <pre id="li${i}">${text}</pre>${max ? `<span class="count">${text.length}/${max} caracteres</span>` : ""}</div>`
    )
    .join("");
}

$("#liBlocks").addEventListener("click", (e) => {
  const b = e.target.closest("[data-copy]");
  if (!b) return;
  copyText($("#" + b.dataset.copy).textContent, "Copiado! Cole no seu LinkedIn ✓");
});

$("#copyAllLiBtn").addEventListener("click", () => {
  const all = Array.from(document.querySelectorAll("#liBlocks pre"))
    .map((p) => p.textContent)
    .join("\n\n---\n\n");
  copyText(all, "Todo o pacote LinkedIn foi copiado ✓");
});

// ---------- Pacote Currículo Lattes Oficial (CNPq - https://lattes.cnpq.br/) ----------
function renderLattesPage() {
  const citName = buildCitationName(cv.nome);
  const idiomasLattes = buildLattesIdiomas(cv.idiomas);
  const resumo3aPessoa = formatToLattes3rdPerson(cv.resumo, cv);

  const blocks = [
    [
      "1. Dados Gerais → Identificação e Nome em Citações Bibliográficas (Padrão ABNT / CNPq)",
      `Nome completo: ${cv.nome}\nNome em citações bibliográficas: ${citName}\nLink Lattes / ORCID: ${cv.lattes || "A cadastrar em lattes.cnpq.br"}`,
      "Copie e cole no módulo 'Dados Gerais > Identificação' do Lattes.",
    ],
    [
      "2. Dados Gerais → Endereço Profissional / Instituição de Vínculo",
      cv.enderecoProfissional || `${cv.cidade || "Brasil"} — Instituição de ensino ou pesquisa de vínculo atual.`,
      "Para preencher no módulo 'Dados Gerais > Endereço'.",
    ],
    [
      "3. Dados Gerais → Texto Inicial do Currículo Lattes (Resumo em 3ª pessoa)",
      resumo3aPessoa,
      "O CNPq exige texto em 3ª pessoa começando pela titulação ('Possui graduação em...'). Nossa plataforma já converteu automaticamente.",
    ],
    [
      "4. Formação → Formação Acadêmica / Titulação",
      `Formação: ${cv.formacao}\nTítulo do Trabalho de Conclusão / Dissertação / Tese: (Conforme informado na titulação)\nNome do(a) Orientador(a): (Conforme informado na titulação)`,
      "Para cadastrar em 'Formação > Formação Acadêmica/Titulação'.",
    ],
    [
      "5. Formação → Formação Complementar e Cursos de Extensão",
      cv.formacaoComplementar || "Nenhum curso complementar informado ainda. Você pode adicionar cursos com carga horária em '✏️ Editar dados'.",
      "Para cadastrar em 'Formação > Formação Complementar'.",
    ],
    ...cv.experiencias.map((x, idx) => [
      `6.${idx + 1} Atuação → Atuação Profissional (${x.empresa || "Instituição"})`,
      `Instituição/Empresa: ${x.empresa || "Informar instituição"}\nVínculo institucional: ${x.cargo}\nPeríodo: ${x.periodo}\nEnquadramento funcional: ${x.cargo}\nAtividades exercidas:\n${(x.itens || [])
        .map((i) => "• " + i)
        .join("\n")}`,
      "Para cadastrar no menu 'Atuação > Atuação Profissional' do Lattes.",
    ]),
    [
      "7. Projetos → Projetos de Pesquisa, Iniciação Científica (PIBIC) e Extensão",
      cv.projetosPesquisa || "Nenhum projeto de pesquisa informado ainda. Adicione em '✏️ Editar dados' se tiver participado de IC, PIBIC ou extensão.",
      "Para cadastrar em 'Projetos > Projeto de Pesquisa / Extensão'.",
    ],
    [
      "8. Atuação → Áreas de Atuação (Grande Área / Área / Subárea CNPq) e Palavras-chave",
      (cv.habilidades || []).join(" | "),
      "Para cadastrar em 'Atuação > Áreas de Atuação' do Lattes.",
    ],
    [
      "9. Dados Gerais → Idiomas (Padrão Lê / Fala / Escreve / Compreende do CNPq)",
      idiomasLattes.map((id) => `${id.idioma}: ${id.detalhe}`).join("\n"),
      "Para preencher no módulo 'Dados Gerais > Idiomas'.",
    ],
    [
      "10. Produções e Eventos → Produção Bibliográfica (ABNT) + Eventos, Bancas e Prêmios",
      `PRODUÇÕES BIBLIOGRÁFICAS E TÉCNICAS:\n${cv.publicacoes || "Nenhuma publicação informada ainda."}\n\nEVENTOS, CONGRESSOS, BANCAS E PRÊMIOS:\n${cv.eventosPremios || "Nenhum evento ou prêmio informado ainda."}`,
      "Para cadastrar nos menus 'Produções', 'Eventos', 'Bancas' e 'Dados Gerais > Prêmios e Títulos'.",
    ],
  ];

  $("#lattesBlocks").innerHTML = blocks
    .map(
      ([title, text, hint], i) => `
    <div class="li-block">
      <header><h3>${title}</h3><button type="button" class="btn btn-ghost btn-sm" data-copy-lattes="lat${i}">Copiar</button></header>
      <pre id="lat${i}">${text}</pre>
      <span class="count">📌 ${hint}</span>
    </div>`
    )
    .join("");
}

if ($("#lattesBlocks")) {
  $("#lattesBlocks").addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy-lattes]");
    if (!b) return;
    copyText($("#" + b.dataset.copyLattes).textContent, "Bloco Lattes copiado ✓ Cole em lattes.cnpq.br");
  });
}

if ($("#copyAllLattesBtn")) {
  $("#copyAllLattesBtn").addEventListener("click", () => {
    const all = Array.from(document.querySelectorAll("#lattesBlocks pre"))
      .map((p) => p.textContent)
      .join("\n\n---\n\n");
    copyText(all, "Todos os módulos do Currículo Lattes foram copiados ✓");
  });
}

if ($("#viewLattesModelBtn")) {
  $("#viewLattesModelBtn").addEventListener("click", () => {
    state.tpl = "academico";
    state.photo = false;
    go("template");
    toast("Modelo visual Currículo Lattes (CNPq) aplicado na folha ✓");
  });
}

// ---------- Carta de Apresentação e E-mail ----------
function renderCarta() {
  const topBullet = (cv.experiencias[0] && cv.experiencias[0].itens[0]) || "sólida experiência prática na área";
  const blocks = [
    ["Assunto do E-mail", `Candidatura à vaga de ${cv.cargo} — ${cv.nome}`],
    [
      "Corpo do E-mail (curto e direto para recrutadores)",
      `Olá, equipe de Recrutamento e Seleção,\n\nEncaminho em anexo meu currículo para avaliação na oportunidade de ${cv.cargo}.\n\nPossuo experiência sólida em ${(cv.habilidades || [])
        .slice(0, 3)
        .join(", ")}, tendo alcançado resultados práticos como: "${topBullet}".\n\nFico à disposição para uma entrevista.\n\nAtenciosamente,\n${cv.nome}\n${cv.telefone} | ${cv.email}\n${cv.linkedin}`,
    ],
    [
      "Carta de Apresentação Completa (para portais de vagas)",
      `Prezado(a) Gestor(a) de Contratação,\n\nApresento minha candidatura para a posição de ${cv.cargo}. ${cv.resumo}\n\nAo longo da minha trajetória na ${
        cv.experiencias[0] ? cv.experiencias[0].empresa : "minha área"
      }, desenvolvi forte domínio em ${(cv.habilidades || []).join(", ")}, sempre com foco em eficiência operacional e entrega de resultados mensuráveis.\n\nAgradeço a atenção e coloco-me à disposição para detalhar como posso contribuir com as metas da equipe.\n\nCordialmente,\n${cv.nome}`,
    ],
  ];
  $("#cartaBlocks").innerHTML = blocks
    .map(
      ([title, text], i) => `
    <div class="li-block"><header><h3>${title}</h3><button type="button" class="btn btn-ghost btn-sm" data-copy-carta="ct${i}">Copiar</button></header>
    <pre id="ct${i}">${text}</pre></div>`
    )
    .join("");
}
$("#cartaBlocks").addEventListener("click", (e) => {
  const b = e.target.closest("[data-copy-carta]");
  if (!b) return;
  copyText($("#" + b.dataset.copyCarta).textContent, "Texto copiado ✓");
});

// ---------- Painel "Meus Currículos Salvos" ----------
function getSavedCVs() {
  try {
    return JSON.parse(localStorage.getItem("aprovado_saved_list") || "[]");
  } catch {
    return [];
  }
}
function setSavedCVs(list) {
  localStorage.setItem("aprovado_saved_list", JSON.stringify(list));
  $("#savedCount").textContent = list.length;
}
function saveNewVersion() {
  const list = getSavedCVs();
  const tplName = TEMPLATES.find((t) => t.id === state.tpl).name;
  const item = {
    id: Date.now(),
    title: `${cv.cargo || "Currículo"} (${tplName})`,
    date: new Date().toLocaleDateString("pt-BR"),
    tpl: state.tpl,
    color: state.color,
    photo: state.photo,
    cv: structuredClone(cv),
  };
  list.unshift(item);
  setSavedCVs(list.slice(0, 20));
  toast(`Versão "${item.title}" salva em Meus Currículos ✓`);
}

$("#saveVersionBtn").addEventListener("click", saveNewVersion);
$("#saveCurrentHereBtn").addEventListener("click", () => {
  saveNewVersion();
  renderSavedList();
});

function renderSavedList() {
  const list = getSavedCVs();
  $("#savedCount").textContent = list.length;

  const emailContainer = $("#emailSyncContainer");
  if (emailContainer) {
    const userEmail = (localStorage.getItem("aprovado_user_email") || "").trim();
    if (userEmail) {
      const planLabel =
        userPlan === "pro"
          ? "Pro Vitalício"
          : userPlan === "avulso"
          ? "Intermediário Vitalício"
          : "Plano Grátis";
      emailContainer.innerHTML = `
        <div class="user-email-banner linked">
          <div class="ueb-info">
            <span class="ueb-avatar">👤</span>
            <div>
              <div class="ueb-title">
                Conta vinculada: <strong>${userEmail}</strong>
                <span class="ueb-plan-tag">${planLabel}</span>
              </div>
              <small class="muted">Todas as alterações, novos modelos e versões salvas ficam guardados nesta conta.</small>
            </div>
          </div>
          <div class="ueb-actions">
            <button type="button" class="btn btn-ghost btn-xs" id="switchUserEmailBtn">Trocar e-mail</button>
            <button type="button" class="btn btn-ghost btn-xs" id="unlinkUserEmailBtn">Desconectar</button>
          </div>
        </div>`;
    } else {
      emailContainer.innerHTML = `
        <div class="user-email-banner unlinked">
          <div class="ueb-info">
            <span class="ueb-avatar">📧</span>
            <div>
              <div class="ueb-title">Vincule seu e-mail para não perder seus currículos</div>
              <small class="muted">Sem criar senha: recupere suas versões salvas e seu plano apenas digitando seu e-mail.</small>
            </div>
          </div>
          <div class="ueb-form">
            <input type="email" id="linkAccountEmailInput" placeholder="Digite seu e-mail..." />
            <button type="button" class="btn btn-primary btn-sm" id="linkAccountEmailBtn">Vincular e-mail</button>
          </div>
        </div>`;
    }
  }

  if (!list.length) {
    $("#savedList").innerHTML = `<div class="saved-card"><h3>Nenhuma versão salva ainda</h3><p class="muted">Clique em "+ Salvar currículo atual" para guardar diferentes versões (ex.: Vendas, Administrativo, Inglês).</p></div>`;
    return;
  }
  $("#savedList").innerHTML = list
    .map(
      (item) => `
    <div class="saved-card">
      <div>
        <h3>${item.title}</h3>
        <p class="muted">${item.cv.nome} · Salvo em ${item.date}</p>
      </div>
      <div class="saved-card-actions">
        <button type="button" class="btn btn-primary btn-sm" data-load-saved="${item.id}">Abrir no editor</button>
        <button type="button" class="btn btn-ghost btn-sm" data-del-saved="${item.id}">Excluir</button>
      </div>
    </div>`
    )
    .join("");
}

async function checkAndSyncUserEmail(email, showNotification = true) {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    if (showNotification) toast("Por favor, digite um e-mail válido.");
    return false;
  }
  localStorage.setItem("aprovado_user_email", cleanEmail);
  saveCurrentState();

  try {
    const resp = await fetch("/api/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail }),
    });
    if (!resp.ok) throw new Error("Erro na consulta do servidor");
    const data = await resp.json();
    if (data.ok) {
      if (data.plan === "pro" || data.plan === "avulso") {
        activateVerifiedPlan(data.plan, "email-sync", data.licenseToken);
        if (data.isTrial) {
          if (showNotification) toast(`🎉 Teste de Cortesia ativo para ${cleanEmail}! Você tem ${data.daysLeft} dias restantes ✓`);
        } else {
          if (showNotification) toast(`✨ Plano ${data.plan === "pro" ? "PRO VITALÍCIO" : "INTERMEDIÁRIO VITALÍCIO"} ativo para ${cleanEmail}! ✓`);
        }
      } else if (data.expired) {
        if (showNotification) toast(`⚠️ O período de teste para ${cleanEmail} expirou. Escolha um plano para continuar sem limites.`);
        userPlan = "free";
        localStorage.setItem("aprovado_user_plan", "free");
        localStorage.removeItem("aprovado_license_token");
        renderEditor();
      } else {
        if (showNotification) toast(`Conta vinculada ao e-mail ${cleanEmail} ✓ (Plano Grátis)`);
      }
    }
  } catch {
    if (showNotification) toast(`Conta vinculada ao e-mail ${cleanEmail} ✓`);
  }
  renderSavedList();
  renderEditor();
  return true;
}

if ($("#emailSyncContainer")) {
  $("#emailSyncContainer").addEventListener("click", async (e) => {
    if (e.target.id === "linkAccountEmailBtn") {
      const email = ($("#linkAccountEmailInput") ? $("#linkAccountEmailInput").value : "").trim().toLowerCase();
      const ok = await checkAndSyncUserEmail(email, true);
      if (ok) {
        if ($("#linkAccountEmailInput")) $("#linkAccountEmailInput").value = "";
      }
    } else if (e.target.id === "switchUserEmailBtn") {
      localStorage.removeItem("aprovado_user_email");
      renderSavedList();
      renderEditor();
    } else if (e.target.id === "unlinkUserEmailBtn") {
      localStorage.removeItem("aprovado_user_email");
      renderSavedList();
      renderEditor();
      toast("Conta desconectada neste navegador.");
    }
  });
}

$("#savedList").addEventListener("click", (e) => {
  const loadBtn = e.target.closest("[data-load-saved]");
  if (loadBtn) {
    const id = Number(loadBtn.dataset.loadSaved);
    const item = getSavedCVs().find((x) => x.id === id);
    if (item) {
      cv = structuredClone(item.cv);
      state.tpl = normTpl(item.tpl);
      state.color = item.color || COLORS[0];
      state.photo = item.photo ?? true;
      saveCurrentState();
      toast(`"${item.title}" carregado ✓`);
      go("template");
    }
  }
  const delBtn = e.target.closest("[data-del-saved]");
  if (delBtn) {
    const id = Number(delBtn.dataset.delSaved);
    setSavedCVs(getSavedCVs().filter((x) => x.id !== id));
    renderSavedList();
  }
});

// Inicializa contador de salvos
$("#savedCount").textContent = getSavedCVs().length;

// ---------- Checkout de Planos com Reconhecimento Automático Antifraude (Mercado Pago API) ----------
const DEFAULT_LINK_AVULSO = "https://mpago.la/1BaWCc3";
const DEFAULT_LINK_PRO = "https://mpago.la/2JuwzB7";
const checkoutModal = $("#checkoutModal");
let selectedPlan = "pro";
let paymentPollTimer = null;

function stopPaymentPolling() {
  if (paymentPollTimer) {
    clearInterval(paymentPollTimer);
    paymentPollTimer = null;
  }
}

function startAutomaticPaymentPolling() {
  stopPaymentPolling();
  const orderId = getOrCreateOrderId();
  paymentPollTimer = setInterval(async () => {
    if (!checkoutModal || checkoutModal.hidden) {
      stopPaymentPolling();
      return;
    }
    try {
      const resp = await fetch(`/api/verify-payment?order_id=${encodeURIComponent(orderId)}`);
      const data = await resp.json();
      if (data && data.verified) {
        stopPaymentPolling();
        activateVerifiedPlan(data.plan, data.paymentId, data.licenseToken);
        go("template");
      }
    } catch {}
  }, 4500);
}

function getPlanPaymentLink(planKey) {
  if (planKey === "avulso") {
    return localStorage.getItem("aprovado_link_avulso") || DEFAULT_LINK_AVULSO;
  }
  return localStorage.getItem("aprovado_link_pro") || DEFAULT_LINK_PRO;
}

function updateCheckoutModalUI(planKey) {
  selectedPlan = planKey === "avulso" ? "avulso" : "pro";
  const isPro = selectedPlan === "pro";

  document.querySelectorAll("[data-switch-plan]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.switchPlan === selectedPlan);
  });

  if ($("#lifetimeGuarantee")) {
    $("#lifetimeGuarantee").hidden = false;
    $("#lifetimeGuarantee").innerHTML = isPro
      ? `<strong>✨ Garantia Vitalícia do Plano Pro Completo (R$ 29,90):</strong>
         <ul>
           <li>✓ <strong>Acesso vitalício (pagamento único):</strong> nenhuma cobrança mensal ou recorrente.</li>
           <li>✓ <strong>100% sem marca d'água:</strong> todos os 9 modelos (incluindo Lattes) em Word, PDF e Foto + Ajuste por Vaga + LinkedIn + Carta.</li>
           <li>✓ <strong>Atualizações futuras grátis:</strong> acesso automático a todas as novas ferramentas que entrarem no site sem pagar nada a mais.</li>
         </ul>`
      : `<strong>✨ Garantia Vitalícia do Plano Intermediário (R$ 19,90):</strong>
         <ul>
           <li>✓ <strong>Acesso vitalício (pagamento único):</strong> nenhuma cobrança mensal ou recorrente.</li>
           <li>✓ <strong>100% sem marca d'água:</strong> baixe seu currículo nos 9 modelos (incluindo Currículo Lattes) em Word (.docx), PDF e Foto (.png).</li>
         </ul>`;
  }

  // Mantém sempre os links oficiais enviados para cada plano e valor correspondente:
  // Intermediário (R$ 19,90): https://mpago.la/1BaWCc3
  // Pro Completo (R$ 29,90): https://mpago.la/2JuwzB7
  const goBtn = $("#goExternalCheckoutBtn");
  const officialLink = getPlanPaymentLink(selectedPlan);
  if (goBtn) {
    goBtn.href = officialLink;
    goBtn.textContent = isPro
      ? "🔒 Pagar R$ 29,90 no Mercado Pago (Plano Pro Vitalício) →"
      : "🔒 Pagar R$ 19,90 no Mercado Pago (Plano Intermediário Vitalício) →";
  }
}

function openCheckout(planKey) {
  updateCheckoutModalUI(planKey || "pro");
  checkoutModal.hidden = false;
  startAutomaticPaymentPolling();
}

document.addEventListener("click", (e) => {
  const planCard = e.target.closest("[data-choose-plan]");
  if (planCard) {
    e.preventDefault();
    openCheckout(planCard.dataset.choosePlan);
  }
  const switchBtn = e.target.closest("[data-switch-plan]");
  if (switchBtn) {
    e.preventDefault();
    updateCheckoutModalUI(switchBtn.dataset.switchPlan);
  }
});

if ($("#closeCheckoutModal")) {
  $("#closeCheckoutModal").addEventListener("click", () => {
    checkoutModal.hidden = true;
    stopPaymentPolling();
  });
}

if ($("#verifyReceiptBtn")) {
  $("#verifyReceiptBtn").addEventListener("click", async () => {
    const paymentId = ($("#mpPaymentIdInput").value || "").trim();
    if (!paymentId || !/^\d{6,}$/.test(paymentId)) {
      toast("Informe o número de operação válido do comprovante Mercado Pago.");
      return;
    }
    const btn = $("#verifyReceiptBtn");
    btn.disabled = true;
    btn.textContent = "Verificando…";
    try {
      const resp = await fetch(`/api/verify-payment?payment_id=${encodeURIComponent(paymentId)}`);
      const data = await resp.json();
      if (data && data.verified) {
        stopPaymentPolling();
        activateVerifiedPlan(data.plan, data.paymentId, data.licenseToken);
        go("template");
      } else if (data && data.reason === "missing_token") {
        toast("Configure seu Access Token do Mercado Pago no ⚙️ Painel do Administrador para validar comprovantes.");
      } else {
        toast("Pagamento ainda não consta como aprovado no Mercado Pago. Verifique o número informado.");
      }
    } catch {
      toast("Erro ao consultar o Mercado Pago. Tente novamente em instantes.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Validar no Mercado Pago";
    }
  });
}

if ($("#recoverEmailAccessBtn")) {
  $("#recoverEmailAccessBtn").addEventListener("click", async () => {
    const email = ($("#userEmailRecoveryInput").value || "").trim().toLowerCase();
    const ok = await checkAndSyncUserEmail(email, true);
    if (ok) {
      if (checkoutModal) checkoutModal.hidden = true;
      if (userPlan === "pro" || userPlan === "avulso") go("template");
    }
  });
}

// ---------- Painel do Administrador (Gestão de Clientes, Planos e Configurações) ----------
const aiModal = $("#aiModal");
let currentAdminUsers = [];

function getAdminAuthKey() {
  return sessionStorage.getItem("adapta_admin_auth") || "";
}

function setAdminAuthKey(key) {
  if (key) sessionStorage.setItem("adapta_admin_auth", key);
  else sessionStorage.removeItem("adapta_admin_auth");
}

async function verifyAdminAuth(key) {
  if (!key) return false;
  try {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: key }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function openAdminModal() {
  aiModal.hidden = false;
  const gate = $("#adminPasswordGate");
  const dash = $("#adminDashboardContent");
  const authBadge = $("#adminAuthStatusBadge");
  const authErr = $("#adminAuthError");
  if (authErr) authErr.style.display = "none";

  const key = getAdminAuthKey();
  const isValid = await verifyAdminAuth(key);

  if (isValid) {
    if (gate) gate.style.display = "none";
    if (dash) dash.style.display = "block";
    if (authBadge) authBadge.style.display = "inline-block";
    populateAdminSettingsFields();
    loadAdminUsers();
  } else {
    setAdminAuthKey("");
    if (gate) gate.style.display = "block";
    if (dash) dash.style.display = "none";
    if (authBadge) authBadge.style.display = "none";
    const pwInput = $("#adminMasterPasswordInput");
    if (pwInput) {
      pwInput.value = "";
      setTimeout(() => pwInput.focus(), 150);
    }
  }
}

function populateAdminSettingsFields() {
  if ($("#geminiKeyInput")) $("#geminiKeyInput").value = localStorage.getItem("aprovado_gemini_key") || "";
  if ($("#linkAvulsoInput")) $("#linkAvulsoInput").value = localStorage.getItem("aprovado_link_avulso") || DEFAULT_LINK_AVULSO;
  if ($("#linkProInput")) $("#linkProInput").value = localStorage.getItem("aprovado_link_pro") || DEFAULT_LINK_PRO;
  if ($("#pixKeyInput")) $("#pixKeyInput").value = localStorage.getItem("aprovado_pix_key") || "";
  if ($("#adminPlanSelect")) $("#adminPlanSelect").value = userPlan;
}

// Login de Administrador
if ($("#adminLoginBtn")) {
  $("#adminLoginBtn").addEventListener("click", async () => {
    const input = $("#adminMasterPasswordInput");
    const pwd = (input ? input.value : "").trim();
    const err = $("#adminAuthError");
    if (!pwd) {
      if (err) { err.textContent = "Digite a senha mestra."; err.style.display = "block"; }
      return;
    }
    const ok = await verifyAdminAuth(pwd);
    if (ok) {
      setAdminAuthKey(pwd);
      openAdminModal();
      toast("Acesso de administrador liberado ✓");
    } else {
      if (err) { err.textContent = "Senha incorreta. Verifique e tente novamente."; err.style.display = "block"; }
    }
  });
}

if ($("#adminMasterPasswordInput")) {
  $("#adminMasterPasswordInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      $("#adminLoginBtn").click();
    }
  });
}

// Logout de Administrador
if ($("#adminLogoutBtn")) {
  $("#adminLogoutBtn").addEventListener("click", () => {
    setAdminAuthKey("");
    openAdminModal();
    toast("Sessão de administrador encerrada.");
  });
}

// Fechar Modal
if ($("#closeAiModal")) {
  $("#closeAiModal").addEventListener("click", () => (aiModal.hidden = true));
}

// Abas do Painel
document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-admin-tab");
    $("#adminPaneClients").style.display = tab === "clients" ? "block" : "none";
    $("#adminPaneSettings").style.display = tab === "settings" ? "block" : "none";
    $("#adminPaneSecurity").style.display = tab === "security" ? "block" : "none";
  });
});

// Carregar Lista de Clientes
async function loadAdminUsers() {
  const key = getAdminAuthKey();
  if (!key) return;
  const tbody = $("#adminUsersTableBody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px;">Carregando clientes...</td></tr>`;

  try {
    const res = await fetch("/api/admin/users", {
      headers: { "x-admin-key": key },
    });
    if (!res.ok) throw new Error("Falha na autenticação");
    const data = await res.json();
    currentAdminUsers = data.users || [];
    renderAdminUsersTable(currentAdminUsers);
  } catch {
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--red);padding:20px;">Erro ao carregar clientes. Verifique a senha.</td></tr>`;
  }
}

function renderAdminUsersTable(users) {
  const tbody = $("#adminUsersTableBody");
  const countPill = $("#adminUsersCount");
  if (countPill) countPill.textContent = users.length;
  if (!tbody) return;

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px;">Nenhum cliente cadastrado ainda. Use o formulário acima para liberar o primeiro.</td></tr>`;
    return;
  }

  tbody.innerHTML = users
    .map((u) => {
      let planBadge = "";
      if (u.plan === "pro") planBadge = `<span class="plan-pill pro">Pro Vitalício</span>`;
      else if (u.plan === "avulso") planBadge = `<span class="plan-pill avulso">Intermediário</span>`;
      else planBadge = `<span class="plan-pill free">Grátis</span>`;

      let validity = "Vitalício";
      if (u.expiresAt) {
        if (u.isExpired || u.daysLeft <= 0) {
          validity = `<span style="color:var(--red);font-weight:600;">Expirado</span>`;
          planBadge = `<span class="plan-pill trial">Teste Expirado</span>`;
        } else {
          validity = `<span style="color:#D97706;font-weight:600;">${u.daysLeft} dia(s) restante(s)</span>`;
          planBadge = `<span class="plan-pill trial">Teste Cortesia</span>`;
        }
      }

      const dateStr = u.grantedAt ? new Date(u.grantedAt).toLocaleDateString("pt-BR") : (u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR") : "—");

      return `
        <tr>
          <td><strong>${u.email}</strong></td>
          <td>${planBadge}</td>
          <td><small>${dateStr}<br>${validity}</small></td>
          <td><small class="muted">${u.notes || "—"}</small></td>
          <td style="text-align:right;white-space:nowrap;">
            <button type="button" class="btn btn-ghost btn-xs" data-admin-edit="${u.email}" title="Carregar no formulário">Editar ✏️</button>
            <button type="button" class="btn btn-ghost btn-xs" style="color:var(--red);" data-admin-del="${u.email}" title="Excluir/Revogar">✕</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

// Filtro de busca na tabela
if ($("#adminSearchUsersInput")) {
  $("#adminSearchUsersInput").addEventListener("input", (e) => {
    const q = (e.target.value || "").toLowerCase().trim();
    if (!q) {
      renderAdminUsersTable(currentAdminUsers);
      return;
    }
    const filtered = currentAdminUsers.filter(
      (u) => (u.email && u.email.toLowerCase().includes(q)) || (u.notes && u.notes.toLowerCase().includes(q))
    );
    renderAdminUsersTable(filtered);
  });
}

if ($("#adminRefreshUsersBtn")) {
  $("#adminRefreshUsersBtn").addEventListener("click", () => {
    loadAdminUsers();
    toast("Lista atualizada ✓");
  });
}

// Ações na tabela (Editar e Excluir)
if ($("#adminUsersTableBody")) {
  $("#adminUsersTableBody").addEventListener("click", async (e) => {
    const editEmail = e.target.getAttribute("data-admin-edit");
    const delEmail = e.target.getAttribute("data-admin-del");

    if (editEmail) {
      const u = currentAdminUsers.find((x) => x.email.toLowerCase() === editEmail.toLowerCase());
      if (u) {
        if ($("#adminUserEmailInput")) $("#adminUserEmailInput").value = u.email;
        if ($("#adminUserPlanSelect")) {
          if (u.expiresAt && !u.isExpired) {
            $("#adminUserPlanSelect").value = u.daysLeft > 3 ? "trial_7" : "trial_3";
          } else {
            $("#adminUserPlanSelect").value = u.plan || "pro";
          }
        }
        if ($("#adminUserNotesInput")) $("#adminUserNotesInput").value = u.notes || "";
        toast(`Dados de ${u.email} carregados no formulário.`);
        $("#adminUserEmailInput").focus();
      }
    } else if (delEmail) {
      if (confirm(`Tem certeza que deseja revogar o acesso e excluir o cliente ${delEmail}?`)) {
        try {
          const res = await fetch(`/api/admin/users?email=${encodeURIComponent(delEmail)}`, {
            method: "DELETE",
            headers: { "x-admin-key": getAdminAuthKey() },
          });
          const data = await res.json();
          if (data.ok) {
            toast(`Cliente ${delEmail} excluído com sucesso ✓`);
            currentAdminUsers = data.users || [];
            renderAdminUsersTable(currentAdminUsers);
          } else {
            toast(data.error || "Erro ao excluir cliente.");
          }
        } catch {
          toast("Erro de conexão ao excluir cliente.");
        }
      }
    }
  });
}

// Salvar / Liberar Acesso para Cliente
if ($("#adminSaveUserBtn")) {
  $("#adminSaveUserBtn").addEventListener("click", async () => {
    const email = ($("#adminUserEmailInput") ? $("#adminUserEmailInput").value : "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Por favor, informe um e-mail válido para o cliente.");
      return;
    }
    const planOpt = ($("#adminUserPlanSelect") ? $("#adminUserPlanSelect").value : "pro");
    const notes = ($("#adminUserNotesInput") ? $("#adminUserNotesInput").value : "").trim();

    let plan = "pro";
    let days = null;
    if (planOpt === "avulso") {
      plan = "avulso";
    } else if (planOpt === "trial_3") {
      plan = "pro";
      days = 3;
    } else if (planOpt === "trial_7") {
      plan = "pro";
      days = 7;
    } else if (planOpt === "free") {
      plan = "free";
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": getAdminAuthKey(),
        },
        body: JSON.stringify({ email, plan, days, notes }),
      });
      const data = await res.json();
      if (data.ok) {
        toast(`Acesso para ${email} salvo com sucesso! ✓`);
        if ($("#adminUserEmailInput")) $("#adminUserEmailInput").value = "";
        if ($("#adminUserNotesInput")) $("#adminUserNotesInput").value = "";
        currentAdminUsers = data.users || [];
        renderAdminUsersTable(currentAdminUsers);
      } else {
        toast(data.error || "Erro ao salvar cliente.");
      }
    } catch {
      toast("Erro de conexão ao salvar cliente.");
    }
  });
}

if ($("#adminClearUserFormBtn")) {
  $("#adminClearUserFormBtn").addEventListener("click", () => {
    if ($("#adminUserEmailInput")) $("#adminUserEmailInput").value = "";
    if ($("#adminUserNotesInput")) $("#adminUserNotesInput").value = "";
    if ($("#adminUserPlanSelect")) $("#adminUserPlanSelect").value = "pro";
  });
}

// Trocar Senha Mestra
if ($("#adminChangePwSubmitBtn")) {
  $("#adminChangePwSubmitBtn").addEventListener("click", async () => {
    const currentPassword = ($("#adminCurrentPwInput") ? $("#adminCurrentPwInput").value : "").trim();
    const newPassword = ($("#adminNewPwInput") ? $("#adminNewPwInput").value : "").trim();
    const confirmPassword = ($("#adminConfirmPwInput") ? $("#adminConfirmPwInput").value : "").trim();

    if (!currentPassword) {
      toast("Digite a senha atual.");
      return;
    }
    if (newPassword.length < 4) {
      toast("A nova senha deve ter no mínimo 4 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("A nova senha e a confirmação não coincidem.");
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        setAdminAuthKey(newPassword);
        toast("Senha mestra alterada com sucesso! ✓");
        $("#adminCurrentPwInput").value = "";
        $("#adminNewPwInput").value = "";
        $("#adminConfirmPwInput").value = "";
      } else {
        toast(data.error || "Erro ao alterar senha.");
      }
    } catch {
      toast("Erro de conexão ao alterar senha.");
    }
  });
}

// Salvar Configurações Gerais (Links Mercado Pago, Pix, MP Access Token)
$("#saveAiKeyBtn").addEventListener("click", async () => {
  const k = $("#geminiKeyInput").value.trim();
  if (k) localStorage.setItem("aprovado_gemini_key", k);
  else localStorage.removeItem("aprovado_gemini_key");

  if ($("#linkAvulsoInput")) localStorage.setItem("aprovado_link_avulso", $("#linkAvulsoInput").value.trim());
  if ($("#linkProInput")) localStorage.setItem("aprovado_link_pro", $("#linkProInput").value.trim());
  if ($("#pixKeyInput")) localStorage.setItem("aprovado_pix_key", $("#pixKeyInput").value.trim());

  const desiredAdminPlan = $("#adminPlanSelect") ? $("#adminPlanSelect").value : "free";
  try {
    const resp = await fetch("/api/admin-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mpAccessToken: $("#mpAccessTokenInput") ? $("#mpAccessTokenInput").value.trim() : "",
        adminPlan: desiredAdminPlan,
      }),
    });
    const data = await resp.json();
    if (desiredAdminPlan === "free") {
      userPlan = "free";
      localStorage.setItem("aprovado_user_plan", "free");
      localStorage.removeItem("aprovado_license_token");
    } else if (data && data.licenseToken) {
      activateVerifiedPlan(desiredAdminPlan, "admin-test", data.licenseToken);
    }
  } catch {
    userPlan = desiredAdminPlan;
    localStorage.setItem("aprovado_user_plan", userPlan);
  }

  if ($("#template").classList.contains("active")) renderEditor();
  toast("Configurações salvas com sucesso ✓");
  aiModal.hidden = true;
});

$("#clearAiKeyBtn").addEventListener("click", () => {
  localStorage.removeItem("aprovado_gemini_key");
  localStorage.removeItem("aprovado_link_avulso");
  localStorage.removeItem("aprovado_link_pro");
  localStorage.removeItem("aprovado_pix_key");
  $("#geminiKeyInput").value = "";
  if ($("#linkAvulsoInput")) $("#linkAvulsoInput").value = DEFAULT_LINK_AVULSO;
  if ($("#linkProInput")) $("#linkProInput").value = DEFAULT_LINK_PRO;
  if ($("#pixKeyInput")) $("#pixKeyInput").value = "";
  aiModal.hidden = true;
  toast("Configurações restauradas para o padrão ✓");
});

// Abertura do Painel: Atalho de teclado, Hash #admin e Botão do Rodapé
if ($("#aiConfigBtn")) {
  $("#aiConfigBtn").addEventListener("click", openAdminModal);
}

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
    e.preventDefault();
    openAdminModal();
  }
});

function checkAdminHash() {
  if (location.hash === "#admin") {
    openAdminModal();
    if (history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }
}
window.addEventListener("hashchange", checkAdminHash);
checkAdminHash();

// Sincronização automática silenciosa do e-mail do usuário ao iniciar se já estiver cadastrado
(() => {
  const existingEmail = (localStorage.getItem("aprovado_user_email") || "").trim();
  if (existingEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(existingEmail)) {
    checkAndSyncUserEmail(existingEmail, false).catch(() => {});
  }
})();

// ---------- App instalável (PWA) ----------
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
(() => {
  const bar = $("#installBar");
  const isStandalone = (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches) || Boolean(navigator.standalone);
  const isMobile = typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia("(max-width: 900px)").matches : false;
  if (isStandalone || !isMobile || localStorage.getItem("installDismissed")) return;
  let promptEvent = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    promptEvent = e;
    setTimeout(() => (bar.hidden = false), 3000);
  });
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS) {
    $("#installText").innerHTML = "Toque em <b>Compartilhar ⎋</b> e depois em <b>Adicionar à Tela de Início</b>.";
    $("#installBtn").textContent = "Entendi";
    setTimeout(() => (bar.hidden = false), 3000);
  }
  $("#installBtn").addEventListener("click", async () => {
    if (promptEvent) {
      promptEvent.prompt();
      await promptEvent.userChoice;
      promptEvent = null;
    }
    bar.hidden = true;
  });
  $("#installClose").addEventListener("click", () => {
    bar.hidden = true;
    localStorage.setItem("installDismissed", "1");
  });
  window.addEventListener("appinstalled", () => {
    bar.hidden = true;
    toast("Adapta Currículo instalado ✓");
  });
})();


// ---------- Módulo de Acesso / Dashboard Estilo OnlineCurrículo (Zero IA Externa) ----------
function initAuthAndDashboard() {
  let activeSocialProvider = "google";

  function updateUserDisplay() {
    const email = (localStorage.getItem("aprovado_user_email") || "").trim();
    const name = (localStorage.getItem("aprovado_user_name") || "").trim();
    const provider = (localStorage.getItem("aprovado_user_provider") || "email").toLowerCase();
    const currentPlan = localStorage.getItem("aprovado_user_plan") || (typeof userPlan !== "undefined" ? userPlan : "free") || "free";

    const displayName = name || (email ? email.split("@")[0] : "");
    const providerLabels = {
      google: "Google",
      linkedin: "LinkedIn",
      facebook: "Facebook",
      email: "E-mail",
    };
    const planLabels = {
      pro: "Plano Pro Vitalício",
      avulso: "Plano Intermediário",
      free: "Plano Grátis",
    };

    const navBtn = document.getElementById("navAuthBtn");
    if (navBtn) {
      navBtn.textContent = displayName ? "👤 " + displayName : "👤 Entrar";
    }

    // Dashboard User Card
    const dashName = document.getElementById("dashUserNameDisplay");
    const dashEmail = document.getElementById("dashUserEmailDisplay");
    const dashPlan = document.getElementById("dashUserPlanDisplay");
    const dashAvatar = document.getElementById("dashUserAvatar");
    const dashTitle = document.getElementById("dashWelcomeTitle");

    if (dashName) dashName.textContent = displayName || "Visitante";
    if (dashEmail) dashEmail.textContent = email || "Sem e-mail vinculado";
    if (dashPlan) {
      dashPlan.textContent = (planLabels[currentPlan] || "Plano Grátis") + (provider !== "email" ? ` (${providerLabels[provider] || provider})` : "");
    }
    if (dashAvatar && displayName) {
      dashAvatar.textContent = displayName.charAt(0).toUpperCase();
    }
    if (dashTitle) {
      dashTitle.textContent = displayName
        ? `Olá, ${displayName}! O que você deseja fazer agora?`
        : "O que você deseja fazer agora?";
    }

    // Auth screen active box
    const activeBox = document.getElementById("authActiveAccountBox");
    const activeName = document.getElementById("authActiveNameDisplay");
    const activeEmail = document.getElementById("authActiveEmailDisplay");
    const activeTag = document.getElementById("authActiveProviderTag");
    const activePlan = document.getElementById("authActivePlanBadge");
    const activeAvatar = document.getElementById("authActiveAvatar");
    const emailInput = document.getElementById("authEmailInput");

    if (activeBox) {
      if (email) {
        activeBox.style.display = "flex";
        if (activeName) activeName.textContent = displayName;
        if (activeEmail) activeEmail.textContent = email;
        if (activeTag) activeTag.textContent = "Conectado via " + (providerLabels[provider] || "E-mail");
        if (activePlan) {
          activePlan.className = "auth-plan-badge " + currentPlan;
          activePlan.textContent = planLabels[currentPlan] || "Plano Grátis";
        }
        if (activeAvatar && displayName) activeAvatar.textContent = displayName.charAt(0).toUpperCase();
        if (emailInput && !emailInput.value) emailInput.value = email;
      } else {
        activeBox.style.display = "none";
      }
    }
  }

  updateUserDisplay();

  async function handleAccountLink({ email, name, provider, headline }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast("Por favor, digite um e-mail válido para vincular.");
      return false;
    }

    const cleanName = (name || cleanEmail.split("@")[0]).trim();
    localStorage.setItem("aprovado_user_email", cleanEmail);
    if (cleanName) localStorage.setItem("aprovado_user_name", cleanName);
    if (provider) localStorage.setItem("aprovado_user_provider", provider);

    // Atualiza currículo se dados estiverem vazios
    if (!cv.email) cv.email = cleanEmail;
    if (cleanName && (!cv.name || cv.name === "Mariana Costa Silva")) {
      cv.name = cleanName;
    }
    if (headline && (!cv.title || cv.title === "Analista Administrativo Pleno")) {
      cv.title = headline.trim();
    }
    saveCurrentState();

    try {
      const resp = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, name: cleanName, provider: provider || "email" }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.ok && (data.plan === "pro" || data.plan === "avulso")) {
          activateVerifiedPlan(data.plan, "account-sync", data.licenseToken);
        }
      }
    } catch (e) {
      console.warn("Check email fallback:", e);
    }

    updateUserDisplay();
    go("dashboard");
    toast(`✨ Conta vinculada com sucesso! Bem-vindo(a), ${cleanName}! ✓`, 3500);
    return true;
  }

  // Formulário de E-mail
  const emailSubmitBtn = document.getElementById("authSubmitEmailBtn");
  const emailInput = document.getElementById("authEmailInput");
  if (emailSubmitBtn && emailInput) {
    emailSubmitBtn.addEventListener("click", () => {
      const val = emailInput.value.trim();
      handleAccountLink({ email: val, provider: "email" });
    });
    emailInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = emailInput.value.trim();
        handleAccountLink({ email: val, provider: "email" });
      }
    });
  }

  // Botões de Sessão Ativa
  const resumeActiveBtn = document.getElementById("authResumeActiveBtn");
  if (resumeActiveBtn) {
    resumeActiveBtn.addEventListener("click", () => go("dashboard"));
  }
  const unlinkBtn = document.getElementById("authUnlinkBtn");
  if (unlinkBtn) {
    unlinkBtn.addEventListener("click", () => {
      localStorage.removeItem("aprovado_user_email");
      localStorage.removeItem("aprovado_user_name");
      localStorage.removeItem("aprovado_user_provider");
      if (emailInput) emailInput.value = "";
      updateUserDisplay();
      toast("Conta desconectada. Você pode entrar com outro e-mail ou rede social.");
    });
  }

  const dashSwitchBtn = document.getElementById("dashSwitchAccountBtn");
  if (dashSwitchBtn) {
    dashSwitchBtn.addEventListener("click", () => {
      go("auth");
      toast("Gerencie ou troque sua conta abaixo.");
    });
  }

  // Modal de Redes Sociais
  const socialModal = document.getElementById("socialAuthModal");
  const socialIcon = document.getElementById("socialModalIcon");
  const socialTitle = document.getElementById("socialModalTitle");
  const socialSubtitle = document.getElementById("socialModalSubtitle");
  const socialNameInput = document.getElementById("socialNameInput");
  const socialEmailInput = document.getElementById("socialEmailInput");
  const socialHeadlineWrap = document.getElementById("socialHeadlineWrap");
  const socialHeadlineInput = document.getElementById("socialHeadlineInput");
  const closeSocialBtn = document.getElementById("closeSocialAuthModal");
  const cancelSocialBtn = document.getElementById("cancelSocialAuthBtn");
  const confirmSocialBtn = document.getElementById("confirmSocialAuthBtn");

  function openSocialModal(provider) {
    activeSocialProvider = provider;
    if (!socialModal) return;

    const savedEmail = localStorage.getItem("aprovado_user_email") || cv.email || "";
    const savedName = localStorage.getItem("aprovado_user_name") || (cv.name !== "Mariana Costa Silva" ? cv.name : "");

    if (socialNameInput) socialNameInput.value = savedName || "";
    if (socialEmailInput) socialEmailInput.value = savedEmail || "";
    if (socialHeadlineInput) socialHeadlineInput.value = cv.title !== "Analista Administrativo Pleno" ? (cv.title || "") : "";

    if (provider === "google") {
      socialIcon.className = "social-modal-icon google";
      socialIcon.textContent = "G";
      socialTitle.textContent = "Conectar Conta Google";
      socialSubtitle.textContent = "Vincule sua conta Google ao Adapta Currículo para salvar seus currículos e sincronizar em qualquer dispositivo.";
      if (socialHeadlineWrap) socialHeadlineWrap.style.display = "none";
      if (!socialEmailInput.value) socialEmailInput.placeholder = "exemplo@gmail.com";
    } else if (provider === "linkedin") {
      socialIcon.className = "social-modal-icon linkedin";
      socialIcon.textContent = "in";
      socialTitle.textContent = "Conectar Perfil do LinkedIn";
      socialSubtitle.textContent = "Vincule seu perfil profissional do LinkedIn para importar seus dados e montar seu currículo com foco nas melhores vagas.";
      if (socialHeadlineWrap) socialHeadlineWrap.style.display = "block";
      if (!socialEmailInput.value) socialEmailInput.placeholder = "seu.email@linkedin.com";
    } else if (provider === "facebook") {
      socialIcon.className = "social-modal-icon facebook";
      socialIcon.textContent = "f";
      socialTitle.textContent = "Conectar com Facebook";
      socialSubtitle.textContent = "Vincule sua conta do Facebook para acessar com rapidez e salvar seus dados.";
      if (socialHeadlineWrap) socialHeadlineWrap.style.display = "none";
      if (!socialEmailInput.value) socialEmailInput.placeholder = "seu.email@facebook.com";
    }

    socialModal.hidden = false;
    setTimeout(() => {
      if (!socialNameInput.value) socialNameInput.focus();
      else if (!socialEmailInput.value) socialEmailInput.focus();
    }, 100);
  }

  function closeSocialModal() {
    if (socialModal) socialModal.hidden = true;
  }

  if (closeSocialBtn) closeSocialBtn.addEventListener("click", closeSocialModal);
  if (cancelSocialBtn) cancelSocialBtn.addEventListener("click", closeSocialModal);

  if (confirmSocialBtn) {
    confirmSocialBtn.addEventListener("click", async () => {
      const name = (socialNameInput ? socialNameInput.value : "").trim();
      const email = (socialEmailInput ? socialEmailInput.value : "").trim();
      const headline = (socialHeadlineInput ? socialHeadlineInput.value : "").trim();

      if (!name) {
        toast("Por favor, preencha seu nome completo.");
        if (socialNameInput) socialNameInput.focus();
        return;
      }
      if (!email || !email.includes("@")) {
        toast("Por favor, informe um e-mail válido.");
        if (socialEmailInput) socialEmailInput.focus();
        return;
      }

      confirmSocialBtn.disabled = true;
      confirmSocialBtn.textContent = "Vinculando conta…";

      const ok = await handleAccountLink({
        email,
        name,
        provider: activeSocialProvider,
        headline,
      });

      confirmSocialBtn.disabled = false;
      confirmSocialBtn.textContent = "Vincular Conta e Continuar →";
      if (ok) closeSocialModal();
    });
  }

  const googleBtn = document.getElementById("authGoogleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => openSocialModal("google"));
  }

  const linkedinBtn = document.getElementById("authLinkedinBtn");
  if (linkedinBtn) {
    linkedinBtn.addEventListener("click", () => openSocialModal("linkedin"));
  }

  const facebookBtn = document.getElementById("authFacebookBtn");
  if (facebookBtn) {
    facebookBtn.addEventListener("click", () => openSocialModal("facebook"));
  }

  const skipBtn = document.getElementById("authSkipBtn");
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      go("dashboard");
      toast("Acesso direto ao painel ✓");
    });
  }

  const directDashBtn = document.getElementById("authDirectDashBtn");
  if (directDashBtn) {
    directDashBtn.addEventListener("click", () => {
      go("dashboard");
    });
  }

  // Ações dos 5 cards do Dashboard
  const dashStartBlankCorpBtn = document.getElementById("dashStartBlankCorpBtn");
  if (dashStartBlankCorpBtn) {
    dashStartBlankCorpBtn.addEventListener("click", () => {
      startBlankCorp();
    });
  }

  const dashUploadBtn = document.getElementById("dashUploadBtn");
  if (dashUploadBtn) {
    dashUploadBtn.addEventListener("click", () => {
      go("upload");
    });
  }

  const dashLinkedinBtn = document.getElementById("dashLinkedinBtn");
  if (dashLinkedinBtn) {
    dashLinkedinBtn.addEventListener("click", () => {
      go("linkedin");
    });
  }

  const dashStartBlankLattesBtn = document.getElementById("dashStartBlankLattesBtn");
  if (dashStartBlankLattesBtn) {
    dashStartBlankLattesBtn.addEventListener("click", () => {
      startBlankLattes();
    });
  }

  const dashConvertLattesBtn = document.getElementById("dashConvertLattesBtn");
  if (dashConvertLattesBtn) {
    dashConvertLattesBtn.addEventListener("click", () => {
      state.tpl = "academico";
      go("upload");
      toast("Envie seu currículo abaixo para convertê-lo no padrão Lattes CNPq ✓", 4000);
    });
  }

  const dashJobTailorBtn = document.getElementById("dashJobTailorBtn");
  if (dashJobTailorBtn) {
    dashJobTailorBtn.addEventListener("click", () => {
      if (typeof openJobTailorModal === "function") {
        openJobTailorModal();
      } else {
        go("vaga");
      }
    });
  }
}

// Inicialização segura no carregamento da página
try {
  polishFullCV(cv);
  saveCurrentState();
  initAuthAndDashboard();
} catch (err) {
  console.warn("Init polish:", err);
}
