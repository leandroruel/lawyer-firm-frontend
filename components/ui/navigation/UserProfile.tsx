"use client"

import { Button } from "@/components/Button"
import { cx, focusRing } from "@/lib/utils"
import { RiMore2Fill } from "@remixicon/react"

import { DropdownUserProfile } from "./DropdownUserProfile"
import { useUser } from "@/hooks/useUser"

export const UserProfileDesktop = () => {
  const { user, isLoading } = useUser()

  const userInitials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const userImage = user?.image ? (
    <img src={user.image} alt={user.name} className="size-full object-cover rounded-full" />
  ) : userInitials

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <DropdownUserProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          focusRing,
          "group flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            aria-hidden="true"
          >
            {userImage}
          </span>
          <span>{user?.name}</span>
        </span>
        <RiMore2Fill
          className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
          aria-hidden="true"
        />
      </Button>
    </DropdownUserProfile>
  )
}

export const UserProfileMobile = () => {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <DropdownUserProfile align="end">
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          "group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
          aria-hidden="true"
        >
          {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </span>
      </Button>
    </DropdownUserProfile>
  )
}
