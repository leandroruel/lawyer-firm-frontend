"use client"

import { Card } from "@/components/Card"
import { PageHeader } from "@/components/PageHeader"

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Dashboard"
        description="Bem-vindo ao seu painel de controle"
      />
      
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Processos Ativos
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            24
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            +4 novos esta semana
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Tarefas Pendentes
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            12
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            3 com prazo próximo
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Cobranças do Mês
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            R$ 15.280
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            +12% em relação ao mês anterior
          </p>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Atividade Recente
          </h3>
          <div className="mt-4 space-y-4">
            {/* Lista de atividades recentes */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhuma atividade recente para exibir.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
