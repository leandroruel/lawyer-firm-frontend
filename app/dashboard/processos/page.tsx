"use client"

import { Button } from "@/components/Button"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { columns } from "@/components/ui/data-table/columns"
import { mockProcesses } from "@/data/data"

export default function ProcessosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Processos</h1>
        <Button variant="primary" onClick={() => {/* Lógica para abrir modal ou redirecionar para a página de cadastro */}}>
          Cadastrar Novo Processo
        </Button>
      </div>
      <DataTable data={mockProcesses} columns={columns} />
    </div>
  )
} 