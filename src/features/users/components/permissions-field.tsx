import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormDescription } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

interface PermissionsFieldProps {
  selectedPermissions: string[]
  availablePermissions: Record<
    string,
    { label: string; permissions: Array<{ code: string; label: string }> }
  >
  isLoading?: boolean
  onTogglePermission: (permissionCode: string) => void
  onSelectAllGroup: (
    groupPermissions: ReadonlyArray<{
      readonly code: string
      readonly label: string
    }>
  ) => void
  idPrefix?: string
}

export function PermissionsField({
  selectedPermissions,
  availablePermissions,
  isLoading = false,
  onTogglePermission,
  onSelectAllGroup,
  idPrefix = 'perm',
}: PermissionsFieldProps) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div>
          <h3 className='text-base font-semibold'>Quyền hạn</h3>
          <FormDescription>
            Chọn các quyền cấp cho người dùng này
          </FormDescription>
        </div>
        <div className='space-y-4 rounded-md border p-4'>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
        </div>
      </div>
    )
  }

  const permissionGroups = Object.entries(availablePermissions)

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-base font-semibold'>Quyền hạn</h3>
        <FormDescription>Chọn các quyền cấp cho người dùng này</FormDescription>
      </div>

      <div className='space-y-4 rounded-md border p-4'>
        {permissionGroups.length === 0 ? (
          <p className='text-muted-foreground text-center text-sm'>
            Không có quyền khả dụng
          </p>
        ) : (
          permissionGroups.map(([groupKey, groupData], index) => {
            const groupPermissions = groupData.permissions
            const groupPermissionCodes = groupPermissions.map((p) => p.code)
            const allSelected = groupPermissionCodes.every((code) =>
              selectedPermissions.includes(code)
            )

            return (
              <div key={groupKey} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-sm font-medium'>{groupData.label}</h4>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      onSelectAllGroup(groupPermissions)
                    }}
                  >
                    {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                </div>
                <div className='grid gap-2 pl-4'>
                  {groupPermissions.map((permission) => (
                    <div
                      key={permission.code}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={`${idPrefix}-${permission.code}`}
                        checked={selectedPermissions.includes(permission.code)}
                        onCheckedChange={() => {
                          onTogglePermission(permission.code)
                        }}
                      />
                      <label
                        htmlFor={`${idPrefix}-${permission.code}`}
                        className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
                {index !== permissionGroups.length - 1 && (
                  <Separator className='my-2' />
                )}
              </div>
            )
          })
        )}
      </div>

      {selectedPermissions.length > 0 && (
        <p className='text-muted-foreground text-sm'>
          Tổng: {selectedPermissions.length} quyền đã chọn
        </p>
      )}
    </div>
  )
}
