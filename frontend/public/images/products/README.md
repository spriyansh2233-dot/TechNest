# Nova Product Image Assets

This directory stores the local image assets for all Nova products used in the SmartCart AI e‑commerce platform.

- All images are in **WebP** format for optimal web performance.
- Filenames follow the pattern `productname_sanitized.webp` (e.g., `nova_sonic_anc.webp`).
- Images are organized flat under this folder; you may optionally create sub‑folders per category if desired.
- The `DatabaseSeeder` references these images via relative URLs like `/images/products/<filename>.webp`.

When adding new products, place the corresponding WebP file here and ensure the seeder generates the matching filename.
