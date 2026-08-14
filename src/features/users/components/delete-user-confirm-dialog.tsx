import { toast } from 'sonner'
import { DialogProps } from '@/hooks/use-dialogs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteUser } from '../hooks/use-delete-user'
import { UserItem } from '../types'

interface DeleteUserConfirmDialogPayload {
  user: UserItem
  onSuccess?: () => void
}

export function DeleteUserConfirmDialog({
  open,
  onClose,
  payload,
}: DialogProps<DeleteUserConfirmDialogPayload, boolean>) {
  const { user, onSuccess } = payload
  const { mutateAsync: deleteUser } = useDeleteUser()

  const handleConfirm = async () => {
    const deleteUserPromise = deleteUser({
      params: {
        path: {
          id: user.id,
        },
      },
    })

    toast.promise(deleteUserPromise, {
      loading: 'Đang xóa người dùng...',
      success: () => {
        onSuccess?.()
        return `Đã xóa người dùng ${user.name} thành công`
      },
      error: (error) => {
        return error?.message || 'Xóa người dùng thất bại'
      },
    })

    await deleteUserPromise
    await onClose(true)
  }

  const handleCancel = async () => {
    await onClose(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) void handleCancel()
      }}
    >
      <AlertDialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa người dùng{' '}
            <span className='font-semibold'>{user.name}</span>? Hành động này
            không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              void handleCancel()
            }}
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              void handleConfirm()
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
