"use client"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Checkbox } from "@/components/Checkbox"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RiExternalLinkLine } from "@remixicon/react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { roles } from "@/data/data"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/Calendar"
import { cn } from "@/lib/utils"

export default function General() {
  const { user } = useAuthStore()
  console.log(user)

  const formSchema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    birthDate: z.string().min(1).refine((date) => !isNaN(Date.parse(date)), {
      message: "Data de nascimento inválida"
    }),
  })

  const formSchemaPassword = z.object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  }).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"]
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      birthDate: "",
    },
  })

  const formPassword = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Atualizar os valores quando o user mudar
  useEffect(() => {
    if (user) {
      form.setValue("name", user.name || "")
      form.setValue("lastName", user.lastName || "")
      form.setValue("email", user.email || "")
      form.setValue("birthDate", user.birthDate || "")
    }
  }, [user, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data)
   const result = await fetch(`/api/user/${user?.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
   })

   if (result.ok) {
    toast.success('Informações atualizadas com sucesso')
   } else {
    toast.error('Erro ao atualizar informações')
   }
  }

  const onSubmitPassword = async (data: z.infer<typeof formSchemaPassword>) => {
    try {
      const result = await fetch(`/api/user/${user?.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      })

      const response = await result.json()

      if (result.ok) {
        toast.success('Senha alterada com sucesso')
        formPassword.reset() 
      } else {
        switch (response.code) {
          case 'INVALID_CURRENT_PASSWORD':
            formPassword.setError('currentPassword', {
              type: 'manual',
              message: 'Senha atual incorreta'
            })
            break
          case 'SAME_PASSWORD':
            formPassword.setError('newPassword', {
              type: 'manual',
              message: 'A nova senha não pode ser igual à senha atual'
            })
            break
          case 'UNAUTHORIZED':
            toast.error('Sessão expirada. Por favor, faça login novamente.')
            // Aqui você pode adicionar lógica para redirecionar para o login
            break
          case 'USER_NOT_FOUND':
            toast.error('Usuário não encontrado')
            break
          default:
            toast.error(response.message || 'Erro ao alterar senha')
        }
      }
    } catch (error) {
      toast.error('Erro ao processar a requisição')
    }
  }

  return (
    <>
      <div className="space-y-10">
        <section aria-labelledby="personal-information">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                  <h2
                  id="personal-information"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Informações pessoais
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Gerencie suas informações pessoais e seu papel.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="col-span-full sm:col-span-3">                 
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="given-name" placeholder="Emma" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              autoComplete="family-name"
                              placeholder="Stone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3">
                   <FormField
                      control={form.control}
                      name="email"
                      disabled
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="emma@acme.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="birthDate" 
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de nascimento</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="secondary"
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "P", { locale: ptBR })
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3">
                    <Label htmlFor="email" className="font-medium">
                      Role
                    </Label>
                    <Select defaultValue="member">
                      <SelectTrigger
                        name="role"
                        id="role"
                        className="mt-2"
                        disabled
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-2 text-xs text-gray-500">
                      Os papéis podem ser alterados apenas pelo administrador do sistema.
                    </p>
                  </div>
                  <div className="col-span-full mt-6 flex justify-end">
                    <Button type="submit">Salvar</Button>
                  </div>
                </div>
              </div>
            </div>
            </form>
          </Form>
        </section>
        <Divider />
        <section aria-labelledby="password-settings">
          <Form {...formPassword}>
            <form onSubmit={formPassword.handleSubmit(onSubmitPassword)}>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
              <div>
                <h2
                  id="password-settings"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Configurações de senha
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Gerencie suas configurações de senha.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                  <div className="col-span-full">
                    <FormField
                      control={formPassword.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha atual</FormLabel>
                          <FormDescription>
                            Digite sua senha atual para confirmação
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="********"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-full">
                    <FormField
                      control={formPassword.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova senha</FormLabel>
                          <FormDescription>
                            A senha deve conter pelo menos 8 caracteres.
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="********"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-full">
                    <FormField
                      control={formPassword.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirme a nova senha</FormLabel>
                          <FormDescription>
                            Digite novamente a nova senha
                          </FormDescription>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="********"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full mt-6 flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
            </form>
          </Form>
        </section>
        <Divider />
        <section aria-labelledby="notification-settings">
          <form>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
              <div>
                <h2
                  id="notification-settings"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Configurações de notificação
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Configure as notificações que você deseja receber.
                </p>
              </div>
              <div className="md:col-span-2">
                <fieldset>
                  <legend className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Equipe
                  </legend>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Configure as notificações de equipe que você deseja receber.
                  </p>
                  <ul
                    role="list"
                    className="mt-4 divide-y divide-gray-200 dark:divide-gray-800"
                  >
                    <li className="flex items-center gap-x-3 py-3">
                      <Checkbox
                        id="team-requests"
                        name="team-requests"
                        defaultChecked
                      />
                      <Label htmlFor="team-requests">Solicitações de entrada na equipe</Label>
                    </li>
                    <li className="flex items-center gap-x-3 py-3">
                      <Checkbox id="team-activity-digest" />
                      <Label htmlFor="team-activity-digest">
                        Resumo semanal de atividades da equipe
                      </Label>
                    </li>
                  </ul>
                </fieldset>
                <fieldset className="mt-6">
                  <legend className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Usage
                  </legend>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Configure as notificações de uso que você deseja receber.
                  </p>
                  <ul
                    role="list"
                    className="mt-4 divide-y divide-gray-200 dark:divide-gray-800"
                  >
                    <li className="flex items-center gap-x-3 py-3">
                      <Checkbox id="api-requests" name="api-requests" />
                      <Label htmlFor="api-requests">Incidentes da API</Label>
                    </li>
                    <li className="flex items-center gap-x-3 py-3">
                      <Checkbox
                        id="workspace-execution"
                        name="workspace-execution"
                      />
                      <Label htmlFor="workspace-execution">
                        Incidentes da plataforma
                      </Label>
                    </li>
                    <li className="flex items-center gap-x-3 py-3">
                      <Checkbox
                        id="query-caching"
                        name="query-caching"
                        defaultChecked
                      />
                      <Label htmlFor="query-caching">
                        Transações de pagamento
                      </Label>
                    </li>
                    <li className="flex items-center gap-x-3 py-3">
                      <Checkbox id="storage" name="storage" defaultChecked />
                      <Label htmlFor="storage">Comportamento do usuário</Label>
                    </li>
                  </ul>
                </fieldset>
                <div className="col-span-full mt-6 flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </div>
            </div>
          </form>
        </section>
        <Divider />
        <section aria-labelledby="danger-zone">
          <form>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
              <div>
                <h2
                  id="danger-zone"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Zona de perigo
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Gerencie o espaço de trabalho geral. Contate o administrador do sistema para mais
                  informações.{" "}
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline hover:underline-offset-4 dark:text-indigo-400"
                  >
                    Saiba mais
                    <RiExternalLinkLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                </p>
              </div>
              <div className="space-y-6 md:col-span-2">
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-10">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        Sair do espaço de trabalho
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Revogue seu acesso a este espaço de trabalho. Outras pessoas que você tem
                        adicionado ao espaço de trabalho permanecerão.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      className="text-red-600 dark:text-red-500"
                    >
                      Sair
                    </Button>
                  </div>
                </Card>
                <Card className="overflow-hidden p-0">
                  <div className="flex items-start justify-between gap-10 p-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 dark:text-gray-600">
                        Excluir espaço de trabalho
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-gray-400 dark:text-gray-600">
                        Revogue seu acesso a este espaço de trabalho. Outras pessoas que você tem
                        adicionado ao espaço de trabalho permanecerão.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      disabled
                      className="whitespace-nowrap text-red-600 disabled:text-red-300 disabled:opacity-50 dark:text-red-500 disabled:dark:text-red-700"
                    >
                      Excluir espaço de trabalho
                    </Button>
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">
                      Você não pode excluir o espaço de trabalho porque você não é o
                      administrador do sistema.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
