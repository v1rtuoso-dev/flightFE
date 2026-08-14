import * as React from 'react'
import { DateFilter } from './date-filter'
import { MultiSelectFilter } from './multi-select-filter'
import { SelectFilter } from './select-filter'
import { TextFilter } from './text-filter'
import { FilterRendererProps } from './types'

export const FilterRenderer: React.FC<FilterRendererProps> = (props) => {
  switch (props.filter.type) {
    case 'text': {
      return <TextFilter {...props} />
    }
    case 'date': {
      return <DateFilter {...props} />
    }
    case 'select': {
      return <SelectFilter {...props} />
    }
    case 'multiSelect': {
      return <MultiSelectFilter {...props} />
    }
    default: {
      return null
    }
  }
}
