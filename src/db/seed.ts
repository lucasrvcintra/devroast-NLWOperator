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
  "Parabéns, você conseguiu escrever O(n^infinity) acidentalmente.",
  "Este código tem mais bugs do que um filme de terror.",
  "A única coisa mais desorganizada que isso é a minha sala.",
  "Quem escreveu isso? O café estava quente demais?",
  "Isso não é código, é uma confissão de crimes.",
  "Tentei rodar isso e meu terminal pediu desculpas.",
  "Este código é a razão pela qual precisamos de revisões.",
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
    "Não segue o style guide",
  ],
  good: [
    "Boa nomenclatura",
    "Código limpo",
    "Boa prática de erros",
    "Função bem encapsulada",
    "Documentação clara",
  ],
};

const BAD_CODES: Record<string, string[]> = {
  javascript: [
    `function calc() {
  var x=1; var y=2; var z=3;
  if(true){return x+y+z;}
  console.log(x);
}`,
    `const data = fetch('/api/users').then(r => r.json());
data.then(d => console.log(d));`,
    `function process(items) {
  items.forEach(i => { i.processed = true; });
  return items.filter(i => i.active);
}`,
  ],
  typescript: [
    `interface Data {
  id: string;
  value: any;
}
function getData(): any {
  return null;
}`,
    `type Config = {
  url: string,
  method: string
}
const config: Config = { url: '', method: 'GET' };`,
  ],
  python: [
    `def process():
    x=1;y=2;z=3
    if True:
     return x+y+z
    print(x)`,
    `def get_data():
 return requests.get('url').json()`,
  ],
  rust: [
    `fn main() {
    let x = 1;
    let y = 2;
    println!("{}", x);
}`,
    `fn process(data: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    for i in data {
        result.push(i * 2);
    }
    return result;
}`,
  ],
  go: [
    `func process() {
    x := 1
    y := 2
    fmt.Println(x)
    return x + y
}`,
    `func getData() map[string]interface{} {
    return nil
}`,
  ],
  java: [
    `public int calculate() {
    int x=1; int y=2; int z=3;
    if(true) { return x+y+z; }
    System.out.println(x);
}`,
    `public Object getData() {
    return null;
}`,
  ],
  c: [
    `int process() {
    int x=1,y=2,z=3;
    if(1) { return x+y+z; }
    printf("%d\\n", x);
}`,
    `char* getData() {
    return NULL;
}`,
  ],
  cpp: [
    `int process() {
    int x=1; int y=2; int z=3;
    if(true) { return x+y+z; }
    cout << x << endl;
}`,
    `std::string getData() {
    return NULL;
}`,
  ],
  csharp: [
    `public int Calculate() {
    int x=1;int y=2;int z=3;
    if(true) { return x+y+z; }
    Console.WriteLine(x);
}`,
    `public object GetData() {
    return null;
}`,
  ],
  ruby: [
    `def process
    x=1;y=2;z=3
    if true
     return x+y+z
    end
    puts x
    end`,
    `def get_data
    return nil
    end`,
  ],
  swift: [
    `func process() -> Int {
    var x = 1
    var y = 2
    print(x)
    return x + y
}`,
    `func getData() -> [String: Any] {
    return nil
}`,
  ],
  kotlin: [
    `fun process(): Int {
    val x = 1; val y = 2; val z = 3
    if (true) { return x + y + z }
    println(x)
}`,
    `fun getData(): Map<String, Any>? {
    return null
}`,
  ],
  sql: [
    `SELECT * FROM users WHERE id = ` +
      faker.string.alphanumeric(5) +
      `;
SELECT name, email FROM orders WHERE status = 'pending';
SELECT u.name, o.total FROM users u, orders o WHERE u.id = o.user_id;`,
    `select id,name,email,password from users where email='admin@example.com';`,
    `SELECT * FROM products, categories, orders WHERE products.id = orders.product_id;`,
  ],
};

const GOOD_CODES: Record<string, string[]> = {
  javascript: [
    `function calculateSum(a, b) {
  return a + b;
}`,
    `const fetchUser = async (id) => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};`,
  ],
  typescript: [
    `interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User | null> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}`,
  ],
  python: [
    `def calculate_sum(a: int, b: int) -> int:
    """Calculate the sum of two numbers."""
    return a + b`,
    `def get_user(user_id: int) -> dict | None:
    """Fetch user data from API."""
    response = requests.get(f"/api/users/{user_id}")
    return response.json() if response.ok else None`,
  ],
  rust: [
    `fn calculate_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = calculate_sum(1, 2);
    println!("{}", result);
}`,
  ],
  go: [
    `func calculateSum(a, b int) int {
    return a + b
}`,
    `func getUser(id string) (*User, error) {
    resp, err := http.Get("/api/users/" + id)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    return decodeUser(resp.Body)
}`,
  ],
  java: [
    `public int calculateSum(int a, int b) {
    return a + b;
}`,
    `public Optional<User> getUser(Long id) {
    return Optional.ofNullable(userRepository.findById(id));
}`,
  ],
  c: [
    `int calculate_sum(int a, int b) {
    return a + b;
}`,
    `char* get_greeting(const char* name) {
    size_t len = strlen(name) + 6;
    char* result = malloc(len);
    snprintf(result, len, "Hello, %s!", name);
    return result;
}`,
  ],
  cpp: [
    `int calculateSum(int a, int b) {
    return a + b;
}`,
    `std::optional<User> getUser(int id) {
    auto result = db.query("SELECT * FROM users WHERE id = ?", id);
    return result.empty() ? std::nullopt : std::make_optional(result[0]);
}`,
  ],
  csharp: [
    `public int CalculateSum(int a, int b) => a + b;`,
    `public async Task<User?> GetUserAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }`,
  ],
  ruby: [
    `def calculate_sum(a, b)
    a + b
    end`,
    `def get_user(user_id)
    User.find_by(id: user_id)
    end`,
  ],
  swift: [
    `func calculateSum(_ a: Int, _ b: Int) -> Int {
    return a + b
}`,
    `func getUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}`,
  ],
  kotlin: [
    `fun calculateSum(a: Int, b: Int): Int = a + b`,
    `suspend fun getUser(id: String): User? {
    return userService.getUserById(id)
}`,
  ],
  sql: [
    `SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.status = 'active'
GROUP BY u.id
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC;`,
    `SELECT 
    p.id,
    p.name AS product_name,
    c.name AS category_name,
    p.price
FROM products p
INNER JOIN categories c ON c.id = p.category_id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 50;`,
    `INSERT INTO audit_log (entity_type, entity_id, action, user_id, created_at)
SELECT 'user', id, 'deleted', 1, NOW()
FROM users
WHERE status = 'inactive'
AND last_login < NOW() - INTERVAL '1 year';`,
  ],
};

function generateCode(language: string, isGood: boolean): string {
  const codes = isGood ? GOOD_CODES : BAD_CODES;
  const options = codes[language] || codes.javascript;
  return faker.helpers.arrayElement(options);
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
    const isGoodCode = faker.datatype.boolean();
    const score = parseFloat(
      faker.number.float({ min: 0, max: 10, fractionDigits: 1 }).toFixed(1),
    );
    const verdict = getVerdict(score);
    const roastMode = faker.datatype.boolean();
    const code = generateCode(language, isGoodCode);
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
        suggestedFix:
          roastMode && !isGoodCode ? generateCode(language, true) : null,
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
      const severity = isGoodCode
        ? faker.helpers.arrayElement(["warning", "good"])
        : faker.helpers.arrayElement(["critical", "warning"]);
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
