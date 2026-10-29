import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const sourceDir = 'C:/Users/Administrator/.codex/generated_images/01a185e9-8101-7763-8b7d-a6ab4fc6cd70'
const sources = {
  hero: 'exec-4331faea-7c0c-419e-9e65-a4e264444880.png',
  earrings: 'exec-fb210399-fe36-48ba-8e9f-2724c996c01b.png',
  necklaces: 'exec-b64f49fd-3a17-4e95-bf06-e93e8f0f6d1f.png',
  bracelets: 'exec-7ed5f962-ddf9-44f9-ac77-c9230c3aa314.png',
  rings: 'exec-e1f59d99-1181-4c14-bbf1-e3f798205c5b.png',
  hair: 'exec-468bb490-4d76-485c-a361-f227bf47f8d5.png'
}
const output = path.join(root, 'public', 'products')
await fs.mkdir(output, { recursive: true })
await sharp(path.join(sourceDir, sources.hero)).resize(1200, 900, { fit: 'cover' }).webp({ quality: 88 }).toFile(path.join(output, 'hero.webp'))

for (const [category, filename] of Object.entries(sources).filter(([key]) => key !== 'hero')) {
  const file = path.join(sourceDir, filename)
  const meta = await sharp(file).metadata()
  const width = meta.width ?? 2048
  const height = meta.height ?? 1024
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const left = Math.round(col * width / 5) + 4
      const top = Math.round(row * height / 2) + 4
      const right = Math.round((col + 1) * width / 5) - 4
      const bottom = Math.round((row + 1) * height / 2) - 4
      await sharp(file).extract({ left, top, width: right - left, height: bottom - top }).resize(720, 720, { fit: 'cover' }).webp({ quality: 88 }).toFile(path.join(output, `${category}-${row * 5 + col + 1}.webp`))
    }
  }
}
console.log('Generated hero.webp and 50 unique local product WebP files.')
