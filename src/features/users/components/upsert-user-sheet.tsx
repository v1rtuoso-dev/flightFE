import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { DialogProps } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { PasswordInput } from '@/components/password-input'
import { useAvailableOptions } from '../hooks/use-available-options'
import { useAvailablePermissions } from '../hooks/use-available-permissions'
import { useCreateUser } from '../hooks/use-create-user'
import { useUpdateUser } from '../hooks/use-update-user'
import { upsertUserSchema, type UpsertUserInput } from '../schema'
import { UserItem } from '../types'
import { groupPermissionsByCategory } from '../utils'
import { PermissionsField } from './permissions-field'

interface UpsertUserSheetPayload {
  user?: UserItem
  onSuccess?: () => void
}

export function UpsertUserSheet({
  open,
  onClose,
  payload,
}: DialogProps<UpsertUserSheetPayload>) {
  const { user, onSuccess } = payload
  const isEditMode = !!user

  const {
    roleOptions,
    teamOptions,
    unitOptions,
    isLoading: isLoadingOptions,
  } = useAvailableOptions()

  const { permissions: availablePermissions, isLoading: isLoadingPermissions } =
    useAvailablePermissions()

  const groupedPermissions = useMemo(
    () => groupPermissionsByCategory(availablePermissions),
    [availablePermissions]
  )

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  const form = useForm<UpsertUserInput>({
    resolver: zodResolver(upsertUserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      roleId: user?.roleId || 3,
      teamId: user?.teamId || undefined,
      unitId: user?.unitId || undefined,
      permissionCodes: user?.permissions || [],
    },
  })

  const onSubmit = (data: UpsertUserInput) => {
    if (isEditMode) {
      const { confirmPassword, password, roleId, permissionCodes, ...rest } =
        data

      const updatePayload = {
        ...rest,
        ...(password && password !== '' ? { password } : {}),
        permissionCodes,
      }

      const updateUserPromise = updateUserMutation.mutateAsync({
        params: {
          path: {
            id: user.id,
          },
        },
        body: updatePayload,
      })

      toast.promise(updateUserPromise, {
        loading: 'Đang cập nhật...',
        success: () => {
          onSuccess?.()
          void onClose()
          return 'Cập nhật người dùng thành công!'
        },
        error: (error) => error.message,
      })
    } else {
      const { confirmPassword, ...createData } = data

      const createUserPromise = createUserMutation.mutateAsync({
        body: {
          ...createData,
          roleId: createData.roleId!,
        },
      })

      toast.promise(createUserPromise, {
        loading: 'Đang tạo người dùng...',
        success: () => {
          form.reset()
          onSuccess?.()
          void onClose()
          return 'Tạo người dùng thành công!'
        },
        error: (error) => error.message,
      })
    }
  }

  const selectedPermissions = form.watch('permissionCodes')

  const handleTogglePermission = (permissionCode: string) => {
    const current = selectedPermissions || []
    const updated = current.includes(permissionCode)
      ? current.filter((code) => code !== permissionCode)
      : [...current, permissionCode]
    form.setValue('permissionCodes', updated)
  }

  const handleSelectAllGroup = (
    groupPermissions: ReadonlyArray<{
      readonly code: string
      readonly label: string
    }>
  ) => {
    const current = selectedPermissions || []
    const permissionCodes = groupPermissions.map((p) => p.code)
    const allSelected = permissionCodes.every((code) => current.includes(code))

    if (allSelected) {
      const updated = current.filter((code) => !permissionCodes.includes(code))
      form.setValue('permissionCodes', updated)
    } else {
      const updated = [...new Set([...current, ...permissionCodes])]
      form.setValue('permissionCodes', updated)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        void onClose()
      }}
    >
      <SheetContent
        className='flex size-full flex-col gap-3 overflow-hidden sm:max-w-3xl'
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <SheetHeader className='flex-shrink-0'>
          <SheetTitle>
            {isEditMode ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? `Cập nhật thông tin và quyền hạn cho ${user.name}`
              : 'Thêm người dùng mới và phân quyền trực tiếp'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e)
            }}
            className='flex flex-1 flex-col overflow-hidden'
          >
            <div className='flex-1 space-y-6 overflow-y-auto px-4'>
              {/* Thông tin cơ bản */}
              <div className='space-y-4'>
                <h3 className='muted-foreground text-sm font-medium'>
                  Thông tin cơ bản
                </h3>
                <div className='grid items-start gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder='Nguyễn Văn A' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='user@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Bảo mật */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='muted-foreground text-sm font-medium'>
                    Bảo mật
                  </h3>
                </div>
                <div className='grid items-start gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isEditMode ? 'Mật khẩu mới' : 'Mật khẩu'}
                        </FormLabel>
                        <FormControl>
                          <PasswordInput placeholder='••••••••' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder='••••••••' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Phân quyền & Tổ chức */}
              <div className='space-y-4'>
                <h3 className='muted-foreground text-sm font-medium'>
                  Phân quyền & Tổ chức
                </h3>
                <div className='grid items-start gap-4 md:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='roleId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vai trò</FormLabel>
                        <Select
                          disabled={isLoadingOptions}
                          value={field.value?.toString() ?? ''}
                          onValueChange={(value) => {
                            field.onChange(value ? Number(value) : undefined)
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full overflow-hidden'>
                              <SelectValue placeholder='Chọn vai trò' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleOptions.map(
                              (option: { value: string; label: string }) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='teamId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhóm</FormLabel>
                        <Select
                          disabled={isLoadingOptions}
                          value={field.value?.toString() ?? ''}
                          onValueChange={(value) => {
                            field.onChange(value ? Number(value) : undefined)
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full overflow-hidden'>
                              <SelectValue placeholder='Chọn nhóm' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='unitId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tổ</FormLabel>
                        <Select
                          disabled={isLoadingOptions}
                          value={field.value?.toString() ?? ''}
                          onValueChange={(value) => {
                            field.onChange(value ? Number(value) : undefined)
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full overflow-hidden'>
                              <SelectValue placeholder='Chọn tổ' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <PermissionsField
                selectedPermissions={selectedPermissions || []}
                availablePermissions={groupedPermissions}
                isLoading={isLoadingPermissions}
                onTogglePermission={handleTogglePermission}
                onSelectAllGroup={handleSelectAllGroup}
                idPrefix={isEditMode ? 'edit' : 'create'}
              />
            </div>

            <SheetFooter className='flex-shrink-0 flex-row justify-end border-t pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  void onClose()
                }}
              >
                Hủy
              </Button>
              <Button type='submit'>
                {isEditMode ? 'Lưu thay đổi' : 'Tạo người dùng'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
