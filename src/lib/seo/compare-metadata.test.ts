import { describe, expect, it } from "vitest";
import { goalPages } from "@/data/goalPages";
import { symptomPages } from "@/data/symptomPages";
import { Route as CompareIndexRoute } from "@/routes/compare.index";
import { Route as CompareGoalsIndexRoute } from "@/routes/compare.goals.index";
import { Route as CompareSymptomsIndexRoute } from "@/routes/compare.symptoms.index";
import { Route as CompareGoalDetailRoute } from "@/routes/compare.goals.$goalSlug";
import { Route as CompareSymptomDetailRoute } from "@/routes/compare.symptoms.$symptomSlug";
import { buildCompareDetailStructuredData } from "@/lib/seo/compare-structured-data";

const SITE_URL = "https://myhealthcheckup.co.uk";

interface MetaEntry {
  readonly title?: string;
  readonly name?: string;
  readonly property?: string;
  readonly content?: string;
}

interface HeadResult {
  readonly meta?: readonly MetaEntry[];
  readonly links?: readonly { rel?: string; href?: string }[];
}

type HeadFn = (ctx: { params: Record<string, string> }) => HeadResult;

const readHead = (route: unknown, params: Record<string, string> = {}): HeadResult => {
  const head = (route as { options: { head?: HeadFn } }).options.head;
  expect(head, "route is missing a head() definition").toBeTypeOf("function");
  return (head as HeadFn)({ params });
};

const metaValue = (head: HeadResult, key: "name" | "property", value: string): string | undefined =>
  head.meta?.find((entry) => entry[key] === value)?.content;

/** Every compare route, resolved to a concrete path for canonical assertions. */
const comparePages: readonly { path: string; head: HeadResult }[] = [
  { path: "/compare", head: readHead(CompareIndexRoute) },
  { path: "/compare/goals", head: readHead(CompareGoalsIndexRoute) },
  { path: "/compare/symptoms", head: readHead(CompareSymptomsIndexRoute) },
  ...goalPages.map((goal) => ({
    path: `/compare/goals/${goal.slug}`,
    head: readHead(CompareGoalDetailRoute, { goalSlug: goal.slug }),
  })),
  ...symptomPages.map((symptom) => ({
    path: `/compare/symptoms/${symptom.slug}`,
    head: readHead(CompareSymptomDetailRoute, { symptomSlug: symptom.slug }),
  })),
];

describe("compare page metadata", () => {
  it.each(comparePages.map((page) => [page.path, page] as const))(
    "%s ships complete, self-referencing metadata",
    (path, page) => {
      const { head } = page;
      const url = `${SITE_URL}${path}`;

      const title = head.meta?.find((entry) => typeof entry.title === "string")?.title;
      expect(title, "missing <title>").toBeTruthy();
      expect(title!.length).toBeLessThan(70);
      expect(title).toContain("myhealth checkup");
      expect(title).not.toMatch(/Lovable/i);

      const description = metaValue(head, "name", "description");
      expect(description, "missing meta description").toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThan(180);

      expect(metaValue(head, "property", "og:title")).toBe(title);
      expect(metaValue(head, "property", "og:description")).toBe(description);
      expect(metaValue(head, "property", "og:url")).toBe(url);
      expect(metaValue(head, "property", "og:type")).toBeTruthy();
      expect(metaValue(head, "name", "twitter:title")).toBe(title);
      expect(metaValue(head, "name", "twitter:description")).toBe(description);

      const canonicals = head.links?.filter((link) => link.rel === "canonical") ?? [];
      expect(canonicals).toHaveLength(1);
      expect(canonicals[0]?.href).toBe(url);
    },
  );

  it("gives every compare page a unique title and description", () => {
    const titles = comparePages.map(
      (page) => page.head.meta?.find((entry) => typeof entry.title === "string")?.title,
    );
    const descriptions = comparePages.map((page) => metaValue(page.head, "name", "description"));

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});

describe("compare detail structured data", () => {
  const cases = [
    ...goalPages.map((goal) =>
      buildCompareDetailStructuredData({
        kind: "goal" as const,
        slug: goal.slug,
        name: goal.name,
        explanation: goal.explanation,
        tests: goal.recommendedTests,
      }),
    ),
    ...symptomPages.map((symptom) =>
      buildCompareDetailStructuredData({
        kind: "symptom" as const,
        slug: symptom.slug,
        name: symptom.name,
        explanation: symptom.clinicalExplanation,
        tests: symptom.recommendedTests,
      }),
    ),
  ];

  it.each(cases.map((graph, index) => [index, graph] as const))(
    "graph %i describes the page, breadcrumbs and compared tests",
    (_index, graph) => {
      const nodes = graph["@graph"] as Record<string, unknown>[];
      const types = nodes.map((node) => node["@type"]);
      expect(types).toEqual(["MedicalWebPage", "BreadcrumbList", "ItemList"]);

      const page = nodes[0]!;
      const list = nodes[2] as { numberOfItems: number; itemListElement: unknown[] };
      expect(page["url"]).toMatch(/^https:\/\/myhealthcheckup\.co\.uk\/compare\//);
      expect(page["mainEntity"]).toEqual({ "@id": list["@id" as keyof typeof list] });
      expect(list.numberOfItems).toBeGreaterThan(0);
      expect(list.itemListElement).toHaveLength(list.numberOfItems);

      list.itemListElement.forEach((entry, i) => {
        const item = (entry as { position: number; item: Record<string, unknown> });
        expect(item.position).toBe(i + 1);
        expect(item.item["@type"]).toBe("MedicalTest");
        expect(item.item["name"]).toBeTruthy();
        expect(item.item["description"]).toBeTruthy();
        expect((item.item["additionalProperty"] as unknown[]).length).toBeGreaterThan(0);
      });

      // Structured data must survive serialisation into the <script> tag.
      expect(() => JSON.stringify(graph)).not.toThrow();
    },
  );
});
