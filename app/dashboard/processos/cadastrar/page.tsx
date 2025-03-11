"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Badge } from "@/components/Badge"
import { RiAddLine, RiCloseLine } from "@remixicon/react"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

// Esquema de validação com Zod
const processSchema = z.object({
  folder: z.string().min(1, "A pasta é obrigatória"),
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  tags: z.array(z.string()),
  instance: z.string().min(1, "A instância é obrigatória"),
  processNumber: z.string().min(1, "O número do processo é obrigatório"),
  responsible: z.string().min(1, "O responsável é obrigatório"),
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  court: z.object({
    number: z.string().optional(),
    courtSection: z.string().optional(),
    forum: z.string().optional(),
  }),
  action: z.string().optional(),
  courtLink: z.string().url("Link inválido").optional().or(z.literal("")),
  description: z.string().optional(),
  caseValue: z.number().optional(),
  distributionDate: z.string().optional(),
  convictionValue: z.number().optional(),
  observations: z.string().optional(),
  accessLevel: z.enum(["public", "private", "restricted"]),
  clients: z.array(
    z.object({
      name: z.string().min(1, "O nome do cliente é obrigatório"),
      qualification: z.string().optional(),
    })
  ),
  involved: z.array(
    z.object({
      name: z.string().min(1, "O nome do envolvido é obrigatório"),
      qualification: z.string().optional(),
    })
  ),
})

type ProcessFormData = z.infer<typeof processSchema>

export default function CadastrarProcessoPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newTag, setNewTag] = useState("")
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<ProcessFormData>({
    folder: "",
    title: "",
    tags: [],
    instance: "",
    processNumber: "",
    responsible: "",
    userId: user?.id || "",
    court: {
      number: "",
      courtSection: "",
      forum: "",
    },
    action: "",
    courtLink: "",
    description: "",
    caseValue: 0,
    distributionDate: "",
    convictionValue: 0,
    observations: "",
    accessLevel: "public",
    clients: [{ name: "", qualification: "" }],
    involved: [],
  })

  // Função para adicionar uma nova tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  // Função para remover uma tag
  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  // Função para adicionar um novo cliente
  const addClient = () => {
    setFormData({
      ...formData,
      clients: [...formData.clients, { name: "", qualification: "" }],
    })
  }

  // Função para remover um cliente
  const removeClient = (index: number) => {
    setFormData({
      ...formData,
      clients: formData.clients.filter((_, i) => i !== index),
    })
  }

  // Função para atualizar dados do cliente
  const updateClient = (index: number, field: keyof typeof formData.clients[0], value: string) => {
    const updatedClients = [...formData.clients]
    updatedClients[index][field] = value
    setFormData({
      ...formData,
      clients: updatedClients,
    })
  }

  // Função para adicionar um novo envolvido
  const addInvolved = () => {
    setFormData({
      ...formData,
      involved: [...formData.involved, { name: "", qualification: "" }],
    })
  }

  // Função para remover um envolvido
  const removeInvolved = (index: number) => {
    setFormData({
      ...formData,
      involved: formData.involved.filter((_, i) => i !== index),
    })
  }

  // Função para atualizar dados do envolvido
  const updateInvolved = (index: number, field: keyof typeof formData.involved[0], value: string) => {
    const updatedInvolved = [...formData.involved]
    updatedInvolved[index][field] = value
    setFormData({
      ...formData,
      involved: updatedInvolved,
    })
  }

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith("court.")) {
      const courtField = name.split(".")[1]
      setFormData({
        ...formData,
        court: {
          ...formData.court,
          [courtField]: value,
        },
      })
    } else if (name === "caseValue" || name === "convictionValue") {
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validar os dados com Zod
      const validatedData = processSchema.parse(formData)
      
      // Enviar dados para a API
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao cadastrar processo")
      }

      // Usar o Sonner conforme documentação
      toast.success("Processo cadastrado com sucesso!", {
        description: "Você será redirecionado para a lista de processos."
      })
      
      // Aguardar um momento antes de redirecionar
      setTimeout(() => {
        router.push("/dashboard/processos")
      }, 1500)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mapear erros de validação do Zod
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const field = err.path.join(".")
          fieldErrors[field] = err.message
        })
        setErrors(fieldErrors)
      } else if (error instanceof Error) {
        setErrors({ form: error.message })
        // Mostrar erro com Sonner
        toast.error("Erro ao cadastrar processo", {
          description: error.message
        })
      } else {
        setErrors({ form: "Ocorreu um erro ao cadastrar o processo" })
      }
      console.error("Erro ao cadastrar processo:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cadastrar Novo Processo</h1>
        <p className="text-gray-600 dark:text-gray-400">Preencha os dados do processo</p>
      </div>

      {errors.form && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-400">{errors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input type="hidden" name="userId" value={user?.id || ""} className="hidden" />
          {/* Pasta */}
          <div>
            <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pasta
            </label>
            <Input
              id="folder"
              name="folder"
              value={formData.folder}
              onChange={handleChange}
              className={errors.folder ? "border-red-500" : ""}
            />
            {errors.folder && <p className="mt-1 text-sm text-red-600">{errors.folder}</p>}
          </div>

          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Instância */}
          <div>
            <label htmlFor="instance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Instância
            </label>
            <Select
              value={formData.instance}
              onValueChange={(value) => setFormData({ ...formData, instance: value })}
            >
              <SelectTrigger className={errors.instance ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione a instância" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 grau">1º Grau</SelectItem>
                <SelectItem value="2 grau">2º Grau</SelectItem>
                <SelectItem value="superior">Superior</SelectItem>
                <SelectItem value="supremo">Supremo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.instance && <p className="mt-1 text-sm text-red-600">{errors.instance}</p>}
          </div>

          {/* Número do Processo */}
          <div>
            <label htmlFor="processNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Número do Processo
            </label>
            <Input
              id="processNumber"
              name="processNumber"
              value={formData.processNumber}
              onChange={handleChange}
              className={errors.processNumber ? "border-red-500" : ""}
            />
            {errors.processNumber && <p className="mt-1 text-sm text-red-600">{errors.processNumber}</p>}
          </div>

          {/* Responsável */}
          <div>
            <label htmlFor="responsible" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Responsável
            </label>
            <Input
              id="responsible"
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              className={errors.responsible ? "border-red-500" : ""}
            />
            {errors.responsible && <p className="mt-1 text-sm text-red-600">{errors.responsible}</p>}
          </div>

          {/* Nível de Acesso */}
          <div>
            <label htmlFor="accessLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nível de Acesso
            </label>
            <Select
              value={formData.accessLevel}
              onValueChange={(value) => setFormData({ ...formData, accessLevel: value as "public" | "private" | "restricted" })}
            >
              <SelectTrigger className={errors.accessLevel ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione o nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="private">Privado</SelectItem>
                <SelectItem value="restricted">Restrito</SelectItem>
              </SelectContent>
            </Select>
            {errors.accessLevel && <p className="mt-1 text-sm text-red-600">{errors.accessLevel}</p>}
          </div>
        </div>

        {/* Etiquetas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Etiquetas</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <RiCloseLine className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nova etiqueta"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" onClick={addTag} variant="secondary">
              Adicionar
            </Button>
          </div>
          {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
        </div>

        {/* Tribunal */}
        <div className="border p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">Dados do Tribunal</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="court.number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número
              </label>
              <Input
                id="court.number"
                name="court.number"
                value={formData.court.number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="court.courtSection" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Seção
              </label>
              <Input
                id="court.courtSection"
                name="court.courtSection"
                value={formData.court.courtSection}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="court.forum" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fórum
              </label>
              <Input
                id="court.forum"
                name="court.forum"
                value={formData.court.forum}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Clientes */}
        <div className="border p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Clientes</h3>
            <Button type="button" onClick={addClient} variant="secondary">
              <RiAddLine className="mr-1 h-4 w-4" />
              Adicionar Cliente
            </Button>
          </div>
          
          {formData.clients.map((client, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4 pb-4 border-b last:border-b-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome
                </label>
                <Input
                  value={client.name}
                  onChange={(e) => updateClient(index, "name", e.target.value)}
                  className={errors[`clients.${index}.name`] ? "border-red-500" : ""}
                />
                {errors[`clients.${index}.name`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`clients.${index}.name`]}</p>
                )}
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Qualificação
                  </label>
                  <Input
                    value={client.qualification}
                    onChange={(e) => updateClient(index, "qualification", e.target.value)}
                  />
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => removeClient(index)}
                    variant="destructive"
                    className="mb-1"
                  >
                    <RiCloseLine className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Envolvidos */}
        <div className="border p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Envolvidos</h3>
            <Button type="button" onClick={addInvolved} variant="secondary">
              <RiAddLine className="mr-1 h-4 w-4" />
              Adicionar Envolvido
            </Button>
          </div>
          
          {formData.involved.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum envolvido adicionado</p>
          ) : (
            formData.involved.map((person, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4 pb-4 border-b last:border-b-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome
                  </label>
                  <Input
                    value={person.name}
                    onChange={(e) => updateInvolved(index, "name", e.target.value)}
                    className={errors[`involved.${index}.name`] ? "border-red-500" : ""}
                  />
                  {errors[`involved.${index}.name`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`involved.${index}.name`]}</p>
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Qualificação
                    </label>
                    <Input
                      value={person.qualification}
                      onChange={(e) => updateInvolved(index, "qualification", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeInvolved(index)}
                    variant="destructive"
                    className="mb-1"
                  >
                    <RiCloseLine className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Campos adicionais */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ação
            </label>
            <Input
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="courtLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link do Tribunal
            </label>
            <Input
              id="courtLink"
              name="courtLink"
              value={formData.courtLink}
              onChange={handleChange}
              className={errors.courtLink ? "border-red-500" : ""}
            />
            {errors.courtLink && <p className="mt-1 text-sm text-red-600">{errors.courtLink}</p>}
          </div>

          <div>
            <label htmlFor="caseValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor da Causa
            </label>
            <Input
              id="caseValue"
              name="caseValue"
              type="number"
              value={formData.caseValue || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="distributionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Distribuição
            </label>
            <Input
              id="distributionDate"
              name="distributionDate"
              type="date"
              value={formData.distributionDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="convictionValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor da Condenação
            </label>
            <Input
              id="convictionValue"
              name="convictionValue"
              type="number"
              value={formData.convictionValue || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Observações */}
        <div>
          <label htmlFor="observations" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Observações
          </label>
          <textarea
            id="observations"
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
          />
          {errors.observations && <p className="mt-1 text-sm text-red-600">{errors.observations}</p>}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/processos")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Processo"}
          </Button>
        </div>
      </form>
    </div>
  )
} 