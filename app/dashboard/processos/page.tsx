"use client"

import { Button } from "@/components/Button"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { useEffect, useState } from "react"
import type { Process } from "@/components/ui/data-table/columns"
import { FilterConfig } from "@/components/ui/data-table/DataTableFilterbar"
import { createBaseColumns, cellFormatters } from "@/components/ui/data-table/columns"
import { ColumnDef } from "@tanstack/react-table"
import { RiMoreFill, RiPencilLine, RiDeleteBinLine } from "@remixicon/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Dropdown"

const processFilters: FilterConfig[] = [
  {
    column: "tags",
    type: "checkbox",
    title: "Etiquetas",
    options: [
      { label: "Urgente", value: "urgente" },
      { label: "Civil", value: "civil" },
      // ... outras tags
    ]
  },
  {
    column: "instance",
    type: "select",
    title: "Instância",
    options: [
      { label: "1ª Instância", value: "1" },
      { label: "2ª Instância", value: "2" },
      // ... outras instâncias
    ]
  }
]

function createProcessColumns(): ColumnDef<Process>[] {
  return [
    ...createBaseColumns<Process>(),
    {
      accessorKey: "folder",
      header: "Pasta",
    },
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "tags",
      header: "Etiquetas",
      cell: ({ row }) => cellFormatters.tags(row.getValue("tags")),
    },
    {
      accessorKey: "instance",
      header: "Instância",
    },
    {
      accessorKey: "processNumber",
      header: "Número do Processo",
    },
    {
      accessorKey: "responsible",
      header: "Responsável",
    },
    {
      id: "actions",
      cell: ({ row }) => <ProcessActions process={row.original} />
    },
  ]
}

// Componente separado para as ações
function ProcessActions({ process }: { process: Process }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800"
        >
          <RiMoreFill className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => console.log('Editar', process._id)}
          className="flex items-center"
        >
          <RiPencilLine className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => console.log('Excluir', process._id)}
          className="flex items-center text-red-600 dark:text-red-500"
        >
          <RiDeleteBinLine className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function ProcessosPage() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch('/api/process')
        
        if (!response.ok) {
          throw new Error('Falha ao carregar processos')
        }
        
        const data = await response.json()
        setProcesses(data)
      } catch (err) {
        setError('Erro ao carregar processos')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProcesses()
  }, [])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  const processColumns = createProcessColumns()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Processos
        </h1>
        <Button 
          variant="primary" 
          onClick={() => console.log('Adicionar novo processo')}
        >
          Cadastrar Novo Processo
        </Button>
      </div>
      <DataTable 
        data={processes} 
        columns={processColumns} 
        filters={processFilters}
        searchColumn="title"
      />
    </div>
  )
} 