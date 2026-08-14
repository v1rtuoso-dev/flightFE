import { Suspense, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UsersRoute } from '@/routes/_authenticated/users'
import { Plus, RefreshCcw } from 'lucide-react'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialogs } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Main } from '@/components/layout/main'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { ExportExcelButton } from './components/export-excel-button'
import { SelectedUserCard } from './components/selected-user-card'
import { UpsertUserSheet } from './components/upsert-user-sheet'
import { UserSearchInput } from './components/user-search-input'
import { UsersActionBar } from './components/users-action-bar'
import { usersQueryOptions } from './hooks/use-users'
import { useUsersTableColumns } from './hooks/use-users-table-columns'
import { UserItem, UsersQueryParams } from './types'

// Transform search params to handle numeric filters
function transformSearchParams(params: any) {
  const transformed = { ...params }

  // Convert string teamId to number
  if (transformed.teamId && typeof transformed.teamId === 'string') {
    const teamIdNum = Number.parseInt(transformed.teamId, 10)
    transformed.teamId = Number.isNaN(teamIdNum) ? undefined : teamIdNum
  }

  // Convert string unitId to number
  if (transformed.unitId && typeof transformed.unitId === 'string') {
    const unitIdNum = Number.parseInt(transformed.unitId, 10)
    transformed.unitId = Number.isNaN(unitIdNum) ? undefined : unitIdNum
  }

  // Convert string page to number
  if (transformed.page && typeof transformed.page === 'string') {
    const pageNum = Number.parseInt(transformed.page, 10)
    transformed.page = Number.isNaN(pageNum) ? undefined : pageNum
  }

  // Convert string size to number
  if (transformed.size != null && typeof transformed.size === 'string') {
    const sizeNum = Number.parseInt(transformed.size, 10)
    transformed.size = Number.isNaN(sizeNum) ? undefined : sizeNum
  }

  return transformed as UsersQueryParams
}

function UsersPageContent() {
  const dialogs = useDialogs()
  const searchParams = UsersRoute.useSearch()
  const isFiltering = !!searchParams.keyword
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)

  const transformedParams = transformSearchParams(searchParams)

  const { data, isFetching, refetch } = useQuery(
    usersQueryOptions(transformedParams)
  )

  // Fallback for undefined response
  const safeUsersResponse = data || {
    data: {
      users: [],
      pagination: { totalPages: 1, currentPage: 1, pageSize: 10 },
    },
  }

  const users = safeUsersResponse.data?.users ?? []

  const handleRefresh = () => {
    void refetch()
  }

  const handleRowClick = (user: UserItem) => {
    setSelectedUser(user)
  }

  const handleCloseSelectedUser = () => {
    setSelectedUser(null)
  }

  const handleClearSelection = () => {
    table.resetRowSelection()
  }

  const columns = useUsersTableColumns()

  const { table, debounceMs } = useDataTable({
    data: users,
    columns,
    pageCount: safeUsersResponse.data?.pagination?.totalPages ?? 1,
    initialState: {
      columnPinning: { left: ['select', 'id'], right: ['actions'] },
      pagination: {
        pageIndex: (safeUsersResponse.data?.pagination?.currentPage ?? 1) - 1,
        pageSize: safeUsersResponse.data?.pagination?.pageSize ?? 20,
      },
    },
    getRowId: (row: UserItem) => String(row.id),
  })

  return (
    <Main className='flex-col gap-4 md:gap-6'>
      <div className='flex flex-col justify-end gap-2 sm:flex-row'>
        <div className='flex flex-wrap gap-2'>
          <Button
            variant='outline'
            className='flex-1 space-x-1 sm:flex-none'
            onClick={() => {
              handleRefresh()
            }}
            disabled={isFetching}
          >
            <span className='text-xs sm:text-sm'>
              {isFetching ? 'Đang tải...' : 'Tải lại'}
            </span>
            <RefreshCcw
              className={`h-3 w-3 sm:h-4 sm:w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>

          <ExportExcelButton
            users={users}
            selectedUsers={table
              .getSelectedRowModel()
              .rows.map((row) => row.original)}
            variant='outline'
            className='flex-1 sm:flex-none'
          />

          <Button
            onClick={() => {
              void dialogs.sheet(UpsertUserSheet, {
                onSuccess: () => {
                  void refetch()
                },
              })
            }}
            className='flex-1 sm:flex-none'
          >
            <Plus className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
            <span className='text-xs sm:text-sm'>Thêm người dùng</span>
          </Button>
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='flex-1'>
          <DataTable
            table={table}
            isLoading={isFetching}
            onRowClick={handleRowClick}
            selectedRowId={selectedUser ? String(selectedUser.id) : null}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            actionBar={
              <UsersActionBar
                selectedUsers={table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original)}
                onClearSelection={handleClearSelection}
              />
            }
          >
            <DataTableToolbar table={table}>
              <UserSearchInput
                isFiltering={isFiltering}
                debounceMs={debounceMs}
              />
            </DataTableToolbar>
          </DataTable>
        </div>

        {selectedUser && (
          <div className='w-80 shrink-0'>
            <SelectedUserCard
              user={selectedUser}
              onClose={handleCloseSelectedUser}
            />
          </div>
        )}
      </div>
    </Main>
  )
}

export function UsersPage() {
  return (
    <Suspense fallback={<PageTableSkeleton />}>
      <UsersPageContent />
    </Suspense>
  )
}
