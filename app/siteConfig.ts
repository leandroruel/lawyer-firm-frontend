export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/dashboard",
    overview: "/dashboard/overview",
    details: "/dashboard/details",
    processos: "/dashboard/processos",
    tarefas: "/dashboard/tarefas",
    calendario: "/dashboard/calendario", 
    cobranca: "/dashboard/cobranca",
    perfil: "/dashboard/perfil",
    settings: {
      general: "/dashboard/settings/general",
      billing: "/dashboard/settings/billing",
      users: "/dashboard/settings/users",
    },
    login: "/login",
    signup: "/signup",
  },
}

export type siteConfig = typeof siteConfig
