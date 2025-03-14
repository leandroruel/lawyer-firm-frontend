"use client"

import * as React from "react"
import Select, { 
  components, 
  OptionProps, 
  ClearIndicatorProps,
  DropdownIndicatorProps,
  StylesConfig
} from "react-select"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cx } from "@/lib/utils"
import { Button } from "@/components/Button"

export interface Option {
  value: string
  label: string
  color?: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: Option[]
  value?: Option[]
  onChange: (value: Option[]) => void
  placeholder?: string
  className?: string
  isClearable?: boolean
  isSearchable?: boolean
  isDisabled?: boolean
  maxMenuHeight?: number
  menuPlacement?: "auto" | "bottom" | "top"
  noOptionsMessage?: string
}

const selectStyles: StylesConfig<Option, true> = {
  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    backgroundColor: "transparent",
    border: "none",
    minHeight: "unset",
    cursor: "pointer",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0",
    gap: "4px",
  }),
  input: (provided) => ({
    ...provided,
    padding: "0",
    margin: "0",
    color: "inherit",
  }),
  indicatorsContainer: () => ({
    display: "none",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--menu-bg, white)",
    border: "1px solid var(--menu-border, #e5e7eb)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderRadius: "0.375rem",
    zIndex: 50,
    marginTop: "0",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "4px",
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    padding: "8px 12px",
    backgroundColor: state.isSelected 
      ? "var(--option-selected-bg, rgba(79, 70, 229, 0.1))" 
      : state.isFocused 
        ? "var(--option-hover-bg, #f3f4f6)" 
        : "transparent",
    color: "var(--option-color, #111827)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.875rem",
    borderRadius: "0.25rem",
    '&:hover': {
      backgroundColor: state.isSelected 
        ? "var(--option-selected-bg, rgba(79, 70, 229, 0.1))" 
        : "var(--option-hover-bg, #f3f4f6)",
    },
    '&:active': {
      backgroundColor: "var(--option-active-bg, #e5e7eb)",
    },
  }),
  multiValue: () => ({
    display: "none",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "var(--muted-color, #6b7280)",
    fontSize: "0.875rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--muted-color, #6b7280)",
  }),
}

const DropdownIndicator = (props: DropdownIndicatorProps<Option, true>) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </components.DropdownIndicator>
  )
}

const ClearIndicator = (props: ClearIndicatorProps<Option, true>) => {
  return (
    <components.ClearIndicator {...props}>
      <X className="h-4 w-4 shrink-0 opacity-50" />
    </components.ClearIndicator>
  )
}

const Option = (props: OptionProps<Option, true>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {props.isSelected && (
          <div className="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <Check className="h-4 w-4" />
          </div>
        )}
        {!props.isSelected && <div className="w-4"></div>}
        <span>{props.label}</span>
      </div>
    </components.Option>
  )
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  className,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  maxMenuHeight = 200,
  menuPlacement = "auto",
  noOptionsMessage = "Nenhuma opção encontrada",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('light')
      document.documentElement.classList.remove('dark')
    }
    
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])
  
  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.style.setProperty('--menu-bg', '#0f172a')
      root.style.setProperty('--menu-border', '#374151')
      root.style.setProperty('--option-color', '#e5e7eb')
      root.style.setProperty('--option-hover-bg', 'rgba(55, 65, 81, 0.7)')
      root.style.setProperty('--option-active-bg', 'rgba(55, 65, 81, 1)')
      root.style.setProperty('--option-selected-bg', 'rgba(99, 102, 241, 0.2)')
      root.style.setProperty('--muted-color', '#9ca3af')
    } else {
      root.style.setProperty('--menu-bg', 'white')
      root.style.setProperty('--menu-border', '#e5e7eb')
      root.style.setProperty('--option-color', '#111827')
      root.style.setProperty('--option-hover-bg', '#f3f4f6')
      root.style.setProperty('--option-active-bg', '#e5e7eb')
      root.style.setProperty('--option-selected-bg', 'rgba(79, 70, 229, 0.1)')
      root.style.setProperty('--muted-color', '#6b7280')
    }
  }, [theme])

  const ref = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])

  return (
    <div className={cx("relative w-full", className)} ref={ref}>
      <Button
        variant="secondary"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        disabled={isDisabled}
        type="button"
      >
        {value && value.length > 0 
          ? `${value.length} selecionado${value.length === 1 ? "" : "s"}`
          : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-4 z-50 w-full" style={{ marginTop: '2px' }}>
          <Select
            isMulti
            options={options}
            value={value}
            onChange={onChange}
            components={{
              DropdownIndicator,
              ClearIndicator,
              Option,
            }}
            styles={selectStyles}
            menuIsOpen
            menuPlacement={menuPlacement}
            className="multi-select"
            classNamePrefix="select"
            isClearable={isClearable}
            isSearchable={isSearchable}
            isDisabled={isDisabled}
            maxMenuHeight={maxMenuHeight}
            placeholder=""
            noOptionsMessage={() => noOptionsMessage}
            hideSelectedOptions={false}
            {...props}
          />
        </div>
      )}
      
      {value && value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((option) => {
            const badgeStyle = option.color 
              ? { backgroundColor: option.color, color: '#fff' } 
              : undefined
              
            return (
              <span 
                key={option.value} 
                className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                style={badgeStyle}
              >
                {option.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(value.filter((item) => item.value !== option.value));
                  }}
                />
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
