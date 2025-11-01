/**
 * Splits an array into smaller chunks of a specified size.
 *
 * This function divides an array into multiple sub-arrays (chunks), where each chunk
 * contains at most the specified number of elements. The last chunk may contain fewer
 * elements if the array length is not evenly divisible by the chunk size.
 *
 * @template T - The type of elements in the array
 * @param source - The array to split into chunks
 * @param size - The maximum size of each chunk. Must be at least 1. Defaults to 5.
 *               Negative values or 0 will be clamped to 1.
 * @returns A two-dimensional array where each sub-array is a chunk of the original array.
 *          Returns the original array wrapped in an array if source length ≤ size.
 *
 * @example
 * ```typescript
 * // Basic usage with default size
 * chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
 * // Returns: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
 *
 * // Custom chunk size
 * chunk([1, 2, 3, 4, 5, 6, 7], 3);
 * // Returns: [[1, 2, 3], [4, 5, 6], [7]]
 *
 * // Chunk size of 2
 * chunk(['a', 'b', 'c', 'd', 'e'], 2);
 * // Returns: [['a', 'b'], ['c', 'd'], ['e']]
 *
 * // Array smaller than chunk size
 * chunk([1, 2, 3], 5);
 * // Returns: [[1, 2, 3]]
 *
 * // Edge cases
 * chunk([1, 2, 3, 4], 1);
 * // Returns: [[1], [2], [3], [4]]
 *
 * chunk([1, 2, 3], 0); // Size clamped to 1
 * // Returns: [[1], [2], [3]]
 *
 * chunk([], 3);
 * // Returns: []
 *
 * // Practical examples
 * // Batch processing
 * const users = Array.from({ length: 100 }, (_, i) => ({ id: i }));
 * const batches = chunk(users, 10); // Process 10 users at a time
 *
 * // Pagination
 * const items = [1, 2, 3, 4, 5, 6, 7, 8];
 * const pages = chunk(items, 3); // 3 items per page
 *
 * // Grid layout
 * const products = ['A', 'B', 'C', 'D', 'E', 'F'];
 * const rows = chunk(products, 3); // 3 products per row
 * ```
 *
 * @since 0.0.1
 */
export function chunk<T>(source: T[], size = 5): T[][] {
  size = Math.max(size, 1);

  if (source.length === 0) {
    return [];
  }

  if (source.length <= size) {
    return [source];
  }

  const result: T[][] = [];

  for (let i = 0; i < source.length; i += size) {
    result.push(source.slice(i, i + size));
  }

  return result;
}
