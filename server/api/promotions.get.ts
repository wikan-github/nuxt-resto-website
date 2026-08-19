// ============================================================================
// server/api/promotions.get.ts — GET /api/promotions API Route
// ============================================================================
// This Nitro server route reads the promotions JSON file and returns
// all current promotion objects to the frontend.
//
// 📚 LEARNING — CRUD (Create, Read, Update, Delete):
// This is the "Read" part of CRUD.
// Later we could add:
//   - POST /api/promotions (Create) → promote.post.ts
//   - PUT  /api/promotions/:id (Update) → [id].put.ts
//   - DELETE /api/promotions/:id (Delete) → [id].delete.ts
// For now, the server-side JSON acts as our simple database.
// ============================================================================

import { readFileSync } from 'fs'
import { join, resolve } from 'path'

// Define the route handler — Nuxt auto-imports `defineEventHandler`
export default defineEventHandler(() => {

  // ── Read and return the promotions JSON data ──
  const filePath = join(resolve('.'), 'server', 'data', 'promotions.json')
  const rawData = readFileSync(filePath, 'utf-8')
  const promotions = JSON.parse(rawData)

  // 📚 The frontend receives a JSON array of Promotion objects.
  //    Each promo has: id, title, description, discount, pricing fields,
  //    image, category, validUntil, and isFeatured.
  return promotions
})
