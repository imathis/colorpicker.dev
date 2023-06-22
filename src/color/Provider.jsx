import { ColorContext } from './Context'
import { useColorHooks } from './useColor'
import { useForm, FormProvider } from 'react-hook-form'

export const ColorProvider = (props) => {
  const value = useColorHooks()
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <form>
        <ColorContext.Provider value={value} {...props} />
      </form>
    </FormProvider>
  )
}
