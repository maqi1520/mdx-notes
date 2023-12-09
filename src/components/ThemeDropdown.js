import React, { useState } from 'react'
import { t } from '@/utils/i18n'
import clsx from 'clsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SettingsIcon } from 'lucide-react'

export default function ThemeDropdown({ themes, codeThemes, onChange, value }) {
  const [open, onOpenChange] = useState(false)
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        className={clsx(
          'block ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4',
          'group focus:outline-none focus-visible:ring-2 rounded w-9 h-9 flex justify-center items-center',

          open
            ? 'focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400'
            : 'focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500'
        )}
      >
        <span className="sr-only">设置</span>
        <SettingsIcon
          className={clsx(
            'w-5 h-5',
            open
              ? 'fill-sky-100 stroke-sky-500 dark:fill-sky-400/50 dark:stroke-sky-400'
              : 'fill-gray-100 stroke-gray-400/70 hover:fill-gray-200 hover:stroke-gray-400 dark:fill-gray-400/20 dark:stroke-gray-500 dark:hover:fill-gray-400/30 dark:hover:stroke-gray-400'
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <div>
          <Label>{t('Themes')}</Label>
          <Select
            onValueChange={(markdownTheme) =>
              onChange({ ...value, markdownTheme })
            }
            value={value.markdownTheme}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.keys(themes).map((key) => (
                  <SelectItem key={key} value={key}>
                    {themes[key].name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('Code Themes')}</Label>
          <Select
            onValueChange={(codeTheme) => onChange({ ...value, codeTheme })}
            value={value.codeTheme}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.keys(codeThemes).map((key) => (
                  <SelectItem key={key} value={key}>
                    {codeThemes[key].name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <RadioGroup
            className="flex items-center justify-between"
            value={value.view}
            onValueChange={(view) => onChange({ ...value, view })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="html" id="r1" />
              <Label htmlFor="r1">HTML</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ppt" id="r2" />
              <Label htmlFor="r2">PPT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MindMap" id="r3" />
              <Label htmlFor="r3">MindMap</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center justify-between">
          <Label className="flex-none pr-2">{t('Mac style')}</Label>
          <Switch
            checked={value.isMac}
            onCheckedChange={(isMac) => onChange({ ...value, isMac })}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
