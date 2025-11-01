/**
 * Default base units for file size formatting using binary (1024-based) conversion.
 *
 * Units progression: Bytes → Kilobytes → Megabytes → Gigabytes → Terabytes
 *
 * @since 0.0.1
 */
export const BASE_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"];

/**
 * Formats a file size in bytes to a human-readable string with appropriate unit.
 *
 * This function converts a raw byte value into a formatted string with the most
 * appropriate unit (B, KB, MB, GB, TB). It uses binary (1024-based) conversion
 * and rounds to 2 decimal places for precision.
 *
 * @param sizeInBytes - The size in bytes to format. Must be a finite positive number.
 * @param base - Array of unit labels to use for formatting. Defaults to BASE_SIZE_UNITS.
 *               The array should be ordered from smallest to largest unit.
 * @returns A formatted string with the size and unit (e.g., "1.5 MB").
 *          Returns "0 B" (or "0" with first unit in base) for invalid inputs
 *          (zero, negative, NaN, or infinite values).
 *
 * @example
 * ```typescript
 * // Basic usage
 * formatSize(1024); // Returns: "1 KB"
 * formatSize(1536); // Returns: "1.5 KB"
 * formatSize(1048576); // Returns: "1 MB"
 * formatSize(1073741824); // Returns: "1 GB"
 *
 * // Various file sizes
 * formatSize(500); // Returns: "500 B"
 * formatSize(2500000); // Returns: "2.38 MB"
 * formatSize(5368709120); // Returns: "5 GB"
 *
 * // Edge cases
 * formatSize(0); // Returns: "0 B"
 * formatSize(-100); // Returns: "0 B"
 * formatSize(NaN); // Returns: "0 B"
 * formatSize(Infinity); // Returns: "0 B"
 *
 * // Custom units (for decimal/SI units)
 * formatSize(1000, ["B", "kB", "MB", "GB", "TB"]);
 * // Note: Still uses 1024-based calculation
 *
 * // Practical examples
 * const fileSize = 2457600; // 2.4 MB
 * console.log(`File size: ${formatSize(fileSize)}`); // "File size: 2.34 MB"
 *
 * const downloadSpeed = 5242880; // bytes per second
 * console.log(`Speed: ${formatSize(downloadSpeed)}/s`); // "Speed: 5 MB/s"
 * ```
 *
 * @since 0.0.1
 */
export function formatSize(sizeInBytes: number, base: Array<string> = BASE_SIZE_UNITS): string {
  if (sizeInBytes <= 0 || Number.isNaN(sizeInBytes) || !Number.isFinite(sizeInBytes)) {
    return `0 ${base[0]}`;
  }

  const k = 1024;
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
  const size = parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2));

  return `${size} ${base[i]}`;
}
