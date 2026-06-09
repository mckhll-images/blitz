import fs from "fs";
import path from "fs/promises";

async function main() {
  const url = "https://mapsvg.com/maps/geo-calibrated/kazakhstan.svg";
  console.log("Fetching SVG from:", url);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const svgText = await res.text();
    console.log("SVG fetched. Length:", svgText.length);
    console.log("First 1500 chars:", svgText.slice(0, 1500));

    // Save raw SVG for referencing/inline rendering if needed
    fs.mkdirSync("./public", { recursive: true });
    fs.writeFileSync("./public/kazakhstan.svg", svgText);
    console.log("Raw SVG written to ./public/kazakhstan.svg");

    // Let's parse all path elements using a regular expression
    // Standard format: <path d="..." id="..." name="..." ... />
    const pathRegex = /<path([^>]+)>/g;
    let match;
    const regions: any[] = [];

    while ((match = pathRegex.exec(svgText)) !== null) {
      const attrsStr = match[1];
      
      const getAttr = (name: string) => {
        const r = new RegExp(`${name}="([^"]+)"`);
        const m = r.exec(attrsStr);
        return m ? m[1] : null;
      };

      const id = getAttr("id");
      const title = getAttr("title") || getAttr("name") || id;
      const d = getAttr("d");

      if (id && d) {
        regions.push({ id, title, d });
      }
    }

    console.log(`Parsed ${regions.length} regions.`);
    console.log("Sample region:", regions[0]);

    // Save parsed regions to an easily importable typescript file
    const outputContent = `// Detailed geo-calibrated regions parsed from MapSVG
export interface MapSvgRegion {
  id: string;
  title: string;
  d: string;
}

export const kazakhstanSvgRegions: MapSvgRegion[] = ${JSON.stringify(regions, null, 2)};
`;

    fs.mkdirSync("./src/components", { recursive: true });
    fs.writeFileSync("./src/components/kazakhstan-paths.ts", outputContent);
    console.log("Parsed paths saved to ./src/components/kazakhstan-paths.ts");

  } catch (error) {
    console.error("Error in fetch-map:", error);
  }
}

main();
