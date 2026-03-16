import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "./index";
import { analysisItems, roasts } from "./schema";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
];

const VERDICTS = [
  "needs_serious_help",
  "rough_around_edges",
  "decent_code",
  "solid_work",
  "exceptional",
] as const;

const SEVERITIES = ["critical", "warning", "good"] as const;

const ROAST_QUOTES = [
  "Este código é tão ruim que até o compilador está chorando.",
  "Eu vi códigos melhores em scripts de SQL injection.",
  " parabéns, você conseguiu escrever O(n^infinity) acidentalmente.",
  "Este código tem mais bugs do que um filme de terror.",
  "A única coisa mais desorganizada que isso é a minha sala.",
  "Quem escreveu isso? O café estava quente demais?",
  "Isso não é código, é uma confissão de crimes.",
  "Tentei rodar isso e meu terminal pediu desculpas.",
  "Este código é a razão pela qual precisamos de revisões.",
  "坊主(deixa), esse código precisa de exorcismo.",
];

const ANALYSIS_TITLES = {
  critical: [
    "Variável não utilizada",
    "Memory leak detectado",
    "SQL Injection vulnerável",
    "Sem tratamento de erros",
    "Loop infinito possível",
    "Credenciais expostas",
  ],
  warning: [
    "Nome de variável confuso",
    "Função muito longa",
    "Código duplicado",
    "Nomenclatura inconsistente",
    "Comentários desatualizados",
    "Não siguen o style guide",
  ],
  good: [
    "Boa nomenclatura",
    "Código limpo",
    "Boa prática de erros",
    "Função bem encapsulada",
    "Documentação clara",
  ],
};

function generateCode(language: string): string {
  const templates: Record<string, () => string> = {
    javascript: () => {
      const bad = faker.datatype.boolean();
      if (bad) {
        return `function ${faker.word.noun()}() {
  var x = 1;
  var y = 2;
  if (true) { return x + y; }
  console.log(x);
}`;
      }
      return `function calculateSum(a, b) {
  return a + b;
}`;
    },
    python: () => {
      const bad = faker.datatype.boolean();
      if (bad) {
        return `def process():
    x=1
    y=2
    if True:
     return x+y
    print(x)`;
      }
      return `def calculate_sum(a, b):
    return a + b`;
    },
    typescript: () => {
      const bad = faker.datatype.boolean();
      if (bad) {
        return `interface User {
  name: string;
  email: string;
}

function getUser(id: string) {
  const user: any = null;
  return user;
}`;
      }
      return `interface User {
  id: string;
  name: string;
}

function getUser(id: string): User | null {
  return { id, name: "John" };
}`;
    },
    rust: () => {
      const bad = faker.datatype.boolean();
      if (bad) {
        return `fn main() {
    let x = 1;
    let y = 2;
    println!("{}", x);
}`;
      }
      return `fn main() {
    let sum = |a: i32, b: i32| a + b;
    println!("{}", sum(1, 2));
}`;
    },
  };

  const generator = templates[language] || templates.javascript;
  return generator();
}

function getVerdict(score: number): (typeof VERDICTS)[number] {
  if (score <= 2) return "needs_serious_help";
  if (score <= 4) return "rough_around_edges";
  if (score <= 6) return "decent_code";
  if (score <= 8) return "solid_work";
  return "exceptional";
}

async function seed() {
  console.log("🌱 Starting seed...");

  const roastCount = 100;

  for (let i = 0; i < roastCount; i++) {
    const language = faker.helpers.arrayElement(LANGUAGES);
    const score = parseFloat(
      faker.number.float({ min: 0, max: 10, fractionDigits: 1 }).toFixed(1),
    );
    const verdict = getVerdict(score);
    const roastMode = faker.datatype.boolean();
    const code = generateCode(language);
    const lineCount = code.split("\n").length;

    const [roast] = await db
      .insert(roasts)
      .values({
        code,
        language,
        lineCount,
        roastMode,
        score,
        verdict,
        roastQuote: roastMode ? faker.helpers.arrayElement(ROAST_QUOTES) : null,
        suggestedFix: roastMode ? generateCode(language) : null,
      })
      .returning();

    const analysisItemCount = faker.number.int({ min: 2, max: 6 });
    const items: {
      roastId: string;
      severity: (typeof SEVERITIES)[number];
      title: string;
      description: string;
      order: number;
    }[] = [];

    for (let j = 0; j < analysisItemCount; j++) {
      const severity = faker.helpers.arrayElement(SEVERITIES);
      const titles = ANALYSIS_TITLES[severity];

      items.push({
        roastId: roast.id,
        severity,
        title: faker.helpers.arrayElement(titles),
        description: faker.lorem.sentence(),
        order: j,
      });
    }

    if (items.length > 0) {
      await db.insert(analysisItems).values(items).returning();
    }

    if ((i + 1) % 10 === 0) {
      console.log(`✅ Inserted ${i + 1}/${roastCount} roasts`);
    }
  }

  console.log(`🎉 Seed completed! ${roastCount} roasts created.`);
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
