export interface FilterConfig {
  id: string
  label: string
  type: 'text' | 'date' | 'select' | 'multiSelect'
  options?: { label: string; value: string }[]
  placeholder?: string
}

export interface FilterRendererProps {
  filter: FilterConfig
  value: any
  onChange: (value: any) => void
}
