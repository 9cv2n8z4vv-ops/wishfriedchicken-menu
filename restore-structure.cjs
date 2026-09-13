const fs = require("fs");
const path = require("path");

const root = __dirname;
const manifestPath = path.join(root, "structure-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

for (const item of manifest) {
  const source = path.join(root, item.packed);
  const target = path.join(root, item.target);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

console.log(`Wish Fried Chicken: ${manifest.length} proje dosyası build için otomatik olarak klasörlerine yerleştirildi.`);
