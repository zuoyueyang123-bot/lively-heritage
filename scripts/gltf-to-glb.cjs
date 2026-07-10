// 将外部格式 .gltf (scene.gltf + scene.bin + textures/) 打包为自包含 .glb
// 用法: node scripts/gltf-to-glb.cjs <gltfDir> <outName>
const fs = require("fs");
const path = require("path");

const dir = process.argv[2] || "public/models/heritage/cloisonne";
const outName = process.argv[3] || "cloisonne.glb";

const gltfPath = path.join(dir, "scene.gltf");
if (!fs.existsSync(gltfPath)) {
  console.error("缺少 scene.gltf:", gltfPath);
  process.exit(1);
}

const gltf = JSON.parse(fs.readFileSync(gltfPath, "utf8"));

// 1) 读取 bin 缓冲
const buffers = gltf.buffers || [];
let binBuffer = null;
for (const b of buffers) {
  if (b.uri && !b.uri.startsWith("data:")) {
    binBuffer = fs.readFileSync(path.join(dir, b.uri));
    // GLB 中 buffer 不写 uri（指向 BIN chunk）
    delete b.uri;
  } else if (b.uri && b.uri.startsWith("data:")) {
    const base64 = b.uri.split(",")[1];
    binBuffer = Buffer.from(base64, "base64");
    delete b.uri;
  }
}
if (!binBuffer) {
  console.error("未在 gltf 中找到可嵌入的 buffer");
  process.exit(1);
}

// 2) 将外部纹理以 data URI 内嵌
for (const img of gltf.images || []) {
  if (img.uri && !img.uri.startsWith("data:")) {
    const ext = path.extname(img.uri).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    const data = fs.readFileSync(path.join(dir, img.uri));
    img.uri = `data:${mime};base64,${data.toString("base64")}`;
  }
}

// 3) 组装 GLB
function pad4(buf, fill) {
  const rem = buf.length % 4;
  if (rem) return Buffer.concat([buf, Buffer.alloc(4 - rem, fill)]);
  return buf;
}

const jsonChunk = Buffer.from(JSON.stringify(gltf), "utf8");
const jsonPadded = pad4(jsonChunk, 0x20); // JSON chunk 用空格补齐
const binPadded = pad4(binBuffer, 0x00); // BIN chunk 用 0 补齐

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0); // 'glTF'
header.writeUInt32LE(2, 4); // version 2
header.writeUInt32LE(
  12 + 8 + jsonPadded.length + 8 + binPadded.length,
  8
);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonPadded.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binPadded.length, 0);
binHeader.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

const glb = Buffer.concat([header, jsonHeader, jsonPadded, binHeader, binPadded]);
const outPath = path.join(dir, outName);
fs.writeFileSync(outPath, glb);

console.log(
  `✓ 已生成 ${outPath} (${glb.length} bytes, json ${jsonPadded.length}, bin ${binPadded.length})`
);
