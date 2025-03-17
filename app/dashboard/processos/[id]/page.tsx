"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RiArrowLeftLine } from "@remixicon/react"

// Tipo para o processo com mapeamento para os campos do backend
type Processo = {
  _id: string
  folder: string // pasta
  title: string // título
  processNumber: string // número do processo
  clients?:  Array<{
    name: string
    qualification: string
    id?: string
  }>
  status?: string // status (pode não existir no backend)
  responsible: string // responsável
  action?: string // ação (pode não existir no backend)
  court?:  {
    forum: string
    courtSection: string
    number: number
  }
  courtLink?: string // link no tribunal (pode não existir no backend)
  caseValue?: number 
  convictionValue?: number 
  distributedAt?: string // distribuído em (pode não existir no backend)
  createdAt?: string // criado em (pode não existir no backend)
  involved: Array<{
    name: string
    qualification: string
    id?: string
  }>
  tags: string[] // etiquetas
  instance: string // instância
}

export default function ProcessoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const reus = () => {
    if (processo?.involved) {
      return processo.involved.filter(p => p.qualification === 'Réu')
    }
    return []
  }

  const authors = () => {
    if (processo?.involved) {
      return processo.involved.filter(p => p.qualification === 'Autor')
    }
    return []
  }

  const formatCurrency = (value: number) => {
    return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || "Não informado"
  }

  const formatDate = (date: string) => {
    return date ? new Date(date).toLocaleDateString('pt-BR') : "Não informado"
  }

  useEffect(() => {
    const fetchProcesso = async () => {
      try {
        setLoading(true)
        
        const id = params.id 
        const response = await fetch(`/api/process/${id}`)
        
        if (!response.ok) {
          throw new Error(`Falha ao carregar dados do processo: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('data', data)

        if (data) {
          setProcesso({
            ...data,
            client: data.client || "Não informado",
            status: data.status || "Não informado",
            action: data.action || "Não informado",
            court: data.court || "Não informado",
            courtLink: data.courtLink || "#",
            causeValue: data.causeValue || "Não informado",
            condemnationValue: data.condemnationValue || "Não informado",
            distributedAt: data.distributedAt || "Não informado",
            createdAt: data.createdAt || "Não informado",
            authors: data.authors || [],
            involved: data.involved || []
          })
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError('Erro ao carregar dados do processo')
      } finally {
        setLoading(false)
      }
    }

    fetchProcesso()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!processo) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <h2 className="text-red-800 dark:text-red-400 font-medium">Erro</h2>
        <p className="text-red-700 dark:text-red-300">{error || "Processo não encontrado"}</p>
        <Button 
          variant="secondary" 
          className="mt-4"
          onClick={() => router.push('/dashboard/processos')}
        >
          <RiArrowLeftLine className="mr-2 h-4 w-4" />
          Voltar para lista
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Botão de voltar */}
      <div>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/processos')}
          className="p-2"
        >
          <RiArrowLeftLine className="h-5 w-5" />
          <span className="ml-2">Voltar</span>
        </Button>
      </div>

      {/* Card 1: Informações Principais */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{processo.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Número do Processo</p>
            <p className="text-gray-900 dark:text-white">{processo.processNumber || ''}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
            <p className="text-gray-900 dark:text-white">{processo.clients?.map(client => client.name).join(', ') || "Não informado"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
            <Badge variant="default">{processo.status || "Não informado"}</Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsável</p>
            <p className="text-gray-900 dark:text-white">{processo.responsible}</p>
          </div>
        </div>
      </div>

      {/* Card 2: Dados do Processo com Abas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="atividade">Atividade</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumo" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ação</p>
                <p className="text-gray-900 dark:text-white">{processo.action || "Não informado"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Número</p>
                <p className="text-gray-900 dark:text-white">{processo.processNumber}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Juízo</p>
                <p className="text-gray-900 dark:text-white">{processo?.court?.forum || "Não informado"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Link no Tribunal</p>
                {processo.courtLink ? (
                  <a 
                    href={processo.courtLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Acessar processo
                  </a>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Não disponível</p>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor da Causa</p>
                <p className="text-gray-900 dark:text-white">{formatCurrency(processo.caseValue || 0)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor da Condenação</p>
                <p className="text-gray-900 dark:text-white">{formatCurrency(processo.convictionValue || 0)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Distribuído em</p>
                <p className="text-gray-900 dark:text-white">{formatDate(processo.distributedAt || "")}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</p>
                <p className="text-gray-900 dark:text-white">{formatDate(processo.createdAt || "")}</p>
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Autores</h3>
                  {authors().length > 0 ? (
                    <ul className="space-y-2">
                      {authors()
                        .filter(p => p.qualification === 'Autor')
                        .map((autor, index) => (
                          <li key={index} className="text-gray-900 dark:text-white">{autor.name}</li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Nenhum autor cadastrado</p>
                  )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Réus</h3>
                {reus().length > 0 ? (
                  <ul className="space-y-2">
                    {reus()
                      .filter(p => p.qualification === 'Réu')
                      .map((reu, index) => (
                        <li key={index} className="text-gray-900 dark:text-white">{reu.name}</li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Nenhum réu cadastrado</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="atividade" className="p-6">
            <div className="text-gray-500 dark:text-gray-400 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              Nenhuma atividade registrada para este processo.
            </div>
          </TabsContent>
          
          <TabsContent value="historico" className="p-6">
            <div className="text-gray-500 dark:text-gray-400 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              Nenhum histórico disponível para este processo.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 