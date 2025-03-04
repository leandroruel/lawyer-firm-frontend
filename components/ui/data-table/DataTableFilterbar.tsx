"use client"

import { Button } from "@/components/Button"
import { Searchbar } from "@/components/Searchbar"
import { formatters } from "@/lib/utils"
import { RiDownloadLine } from "@remixicon/react"
import { Table } from "@tanstack/react-table"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { DataTableFilter, FilterType } from "./DataTableFilter"
import { ViewOptions } from "./DataTableViewOptions"

export interface FilterConfig {
  column: string
  type: FilterType
  title: string
  options?: Array<{
    label: string
    value: string
    icon?: React.ComponentType
    variant?: string
  }>
  formatter?: (value: any) => string
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters?: FilterConfig[]
  searchColumn?: string
}

export function Filterbar<TData>({
  table,
  filters = [],
  searchColumn
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [searchTerm, setSearchTerm] = useState<string>("")

  const debouncedSetFilterValue = useDebouncedCallback((value) => {
    if (searchColumn) {
      table.getColumn(searchColumn)?.setFilterValue(value)
    }
  }, 300)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    debouncedSetFilterValue(value)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
      <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
        {filters.map((filter) => {
          const column = table.getColumn(filter.column)
          if (!column?.getIsVisible()) return null

          return (
            <DataTableFilter
              key={filter.column}
              column={column}
              title={filter.title}
              options={filter.options || []}
              type={filter.type}
              formatter={filter.formatter || formatters.default}
            />
          )
        })}
        
        {searchColumn && table.getColumn(searchColumn)?.getIsVisible() && (
          <Searchbar
            type="search"
            placeholder={`Buscar por ${searchColumn.toLowerCase()}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:max-w-[250px] sm:[&>input]:h-[30px]"
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="border border-gray-200 px-2 font-semibold text-indigo-600 sm:border-none sm:py-1 dark:border-gray-800 dark:text-indigo-500"
          >
            Limpar filtros
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
        >
          <RiDownloadLine className="size-4 shrink-0" aria-hidden="true" />
          Exportar
        </Button>
        <ViewOptions table={table} />
      </div>
    </div>
  )
}
