import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/codeblock/codeblock";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  CodeCell,
  LangCell,
  RankCell,
  ScoreCell,
  TableRow,
} from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
}`;

const sections = [
  {
    title: "// buttons",
    component: (
      <div className="flex items-center gap-4">
        <Button variant="default" className="font-mono">
          $ roast_my_code
        </Button>
        <Button variant="secondary" className="font-mono">
          $ share_roast
        </Button>
        <Button variant="link" className="font-mono">
          $ view_all &gt;&gt;
        </Button>
      </div>
    ),
  },
  {
    title: "// toggle",
    component: (
      <div className="flex items-center gap-8">
        <Toggle label="roast mode" defaultChecked />
        <Toggle label="roast mode" />
      </div>
    ),
  },
  {
    title: "// badge_status",
    component: (
      <div className="flex items-center gap-6">
        <Badge variant="critical" dot>
          critical
        </Badge>
        <Badge variant="warning" dot>
          warning
        </Badge>
        <Badge variant="good" dot>
          good
        </Badge>
        <Badge variant="critical" size="lg" dot>
          needs_serious_help
        </Badge>
      </div>
    ),
  },
  {
    title: "// code_block",
    component: <CodeBlock code={sampleCode} filename="calculate.js" />,
  },
  {
    title: "// diff_line",
    component: (
      <div className="flex flex-col">
        <DiffLine type="removed" prefix="-">
          var total = 0;
        </DiffLine>
        <DiffLine type="added" prefix="+">
          const total = 0;
        </DiffLine>
        <DiffLine type="context" prefix=" ">
          for (let i = 0; i &lt; items.length; i++) {"{"}
        </DiffLine>
      </div>
    ),
  },
  {
    title: "// cards",
    component: (
      <Card label="critical" labelVariant="critical">
        <CardTitle>using var instead of const/let</CardTitle>
        <CardDescription>
          the var keyword is function-scoped rather than block-scoped, which can
          lead to unexpected behavior and bugs. modern javascript uses const for
          immutable bindings and let for mutable ones.
        </CardDescription>
      </Card>
    ),
  },
  {
    title: "// table_row",
    component: (
      <TableRow>
        <RankCell>#1</RankCell>
        <ScoreCell score={2.1} />
        <CodeCell>
          function calculateTotal(items) {"{ var total = 0; ..."}
        </CodeCell>
        <LangCell>javascript</LangCell>
      </TableRow>
    ),
  },
  {
    title: "// score_ring",
    component: (
      <div className="flex items-center gap-8">
        <ScoreRing score={3.5} />
        <ScoreRing score={7.2} size="sm" />
        <ScoreRing score={8.9} size="lg" />
      </div>
    ),
  },
];

export default async function ComponentsPage() {
  return (
    <main className="min-h-screen bg-bg-page p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="font-mono text-3xl font-bold text-text-primary">
            {"// component_library"}
          </h1>
        </header>

        {sections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="font-mono text-sm font-bold text-text-primary">
              {section.title}
            </h2>
            <div className="rounded-lg border border-border-primary bg-bg-page p-6">
              {section.component}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
