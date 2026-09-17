#!/usr/bin/env python3
"""Compress images in images/ directory using TinyPNG API."""

import os
import sys
import tinify
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

IMAGES_DIR = Path(__file__).parent / "images"
COMPRESSED_LOG = IMAGES_DIR / ".compressed-log"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def load_compressed_log():
    """Load set of already-compressed file paths."""
    if not COMPRESSED_LOG.exists():
        return set()
    return set(COMPRESSED_LOG.read_text().strip().splitlines())


def save_compressed_log(compressed):
    """Save set of compressed file paths."""
    COMPRESSED_LOG.write_text("\n".join(sorted(compressed)) + "\n")


def get_image_files(specific_files=None):
    """Get image files to process. If specific_files given, use those; otherwise scan all."""
    if specific_files:
        files = []
        for f in specific_files:
            p = Path(f).resolve()
            if p.exists() and p.suffix.lower() in SUPPORTED_EXTENSIONS:
                files.append(p)
        return files

    files = []
    for ext in SUPPORTED_EXTENSIONS:
        files.extend(IMAGES_DIR.rglob(f"*{ext}"))
    return sorted(files)


def compress_image(filepath):
    """Compress a single image via TinyPNG. Returns (original_size, new_size)."""
    original_size = filepath.stat().st_size
    source = tinify.from_file(str(filepath))
    source.to_file(str(filepath))
    new_size = filepath.stat().st_size
    return original_size, new_size


def main():
    api_key = os.getenv("TINYPNG_API_KEY")
    if not api_key:
        print("Error: TINYPNG_API_KEY not found in .env file")
        sys.exit(1)

    tinify.key = api_key

    # Accept specific files as arguments (used by pre-commit hook)
    specific_files = sys.argv[1:] if len(sys.argv) > 1 else None

    compressed_log = load_compressed_log()
    image_files = get_image_files(specific_files)

    # Filter out already-compressed files
    to_compress = [f for f in image_files if str(f.relative_to(Path(__file__).parent)) not in compressed_log]

    if not to_compress:
        print("All images are already compressed.")
        return

    print(f"Found {len(to_compress)} image(s) to compress.\n")

    total_original = 0
    total_new = 0
    errors = 0

    for i, filepath in enumerate(to_compress, 1):
        rel_path = str(filepath.relative_to(Path(__file__).parent))
        print(f"[{i}/{len(to_compress)}] Compressing {rel_path}...", end=" ", flush=True)

        try:
            original_size, new_size = compress_image(filepath)
            savings = original_size - new_size
            pct = (savings / original_size * 100) if original_size > 0 else 0

            total_original += original_size
            total_new += new_size

            print(f"{original_size // 1024}KB -> {new_size // 1024}KB ({pct:.1f}% saved)")

            compressed_log.add(rel_path)
            save_compressed_log(compressed_log)

        except tinify.Error as e:
            print(f"ERROR: {e}")
            errors += 1

    print(f"\nDone! Compressed {len(to_compress) - errors}/{len(to_compress)} images.")
    if total_original > 0:
        total_savings = total_original - total_new
        pct = total_savings / total_original * 100
        print(f"Total: {total_original // 1024 // 1024}MB -> {total_new // 1024 // 1024}MB ({pct:.1f}% saved)")


if __name__ == "__main__":
    main()
