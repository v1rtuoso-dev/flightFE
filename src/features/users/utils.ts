import { PERMISSION_CATEGORY_CONFIG, PERMISSION_LABELS } from './constants'

/**
 * Group available permissions by category
 */
export function groupPermissionsByCategory(permissions: string[]) {
  const grouped: Record<
    string,
    { label: string; permissions: Array<{ code: string; label: string }> }
  > = {}

  for (const [key, config] of Object.entries(PERMISSION_CATEGORY_CONFIG)) {
    const categoryPermissions = permissions
      .filter((code) => config.permissions.includes(code))
      .map((code) => ({
        code,
        label: PERMISSION_LABELS[code] || code,
      }))

    if (categoryPermissions.length > 0) {
      grouped[key] = {
        label: config.label,
        permissions: categoryPermissions,
      }
    }
  }

  return grouped
}
