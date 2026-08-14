import { components, paths } from '@/generated/api-schema'

export type UsersResponse = NonNullable<
  paths['/api/users']['get']['responses']['200']['content']['*/*']['data']
>

export type UserItem = components['schemas']['UserDTO']

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type UsersQueryParams = NonNullable<
  paths['/api/users']['get']['parameters']['query']
>
