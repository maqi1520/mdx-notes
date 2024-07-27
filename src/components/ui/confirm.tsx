import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslation } from 'react-i18next'
import { createGlobalState } from 'react-use'

const defaultValue = {
  title: '',
  description: '',
  open: false,
  onOk: () => {},
}

const useGlobalState = createGlobalState<{
  title: string
  description: string
  open: boolean
  onOk: () => void
}>(defaultValue)

export function useConfirm() {
  const [state = defaultValue, setState] = useGlobalState()

  const onOpenChange = (open: boolean) => {
    setState({ ...state, open })
  }

  const confirm = ({
    title,
    description,
    onOk = () => {},
  }: {
    title: string
    description: string
    onOk: () => void
  }) => {
    setState({
      title,
      onOk,
      description,
      open: true,
    })
  }

  return {
    ...state,
    onOpenChange,
    confirm,
  }
}

export function Confirm() {
  const { t } = useTranslation()
  const { title, description, open, onOpenChange, onOk } = useConfirm()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onOk}>{t('Continue')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
