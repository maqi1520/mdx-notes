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
import { Button } from '@/components/ui/button'
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
      <PopoverTrigger asChild>
        <Button size="icon" variant="secondary">
          <SettingsIcon
            className={clsx('w-5 h-5', {
              'stroke-primary fill-sky-100 dark:fill-sky-400/50': open,
            })}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
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

        {/* <div>
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
        </div> */}
        <div className="flex items-center justify-between">
          <Label className="flex-none pr-2">{t('Mac style')}</Label>
          <Switch
            checked={value.isMac}
            onCheckedChange={(isMac) => onChange({ ...value, isMac })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="flex-none pr-2">{t('Format markdown')}</Label>
          <Switch
            checked={value.formatMarkdown}
            onCheckedChange={(formatMarkdown) =>
              onChange({ ...value, formatMarkdown })
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
