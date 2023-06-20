import { ColorContext } from './Context'
import { useColorHooks } from './useColor'
import { useForm, FormProvider } from 'react-hook-form'
import { randomColor } from './helpers'

export const ColorProvider = (props) => {
  const value = useColorHooks({ color: randomColor() })
  const methods = useForm({
    /* defaultValues: value.colorObject(value.color) */
  })

  return (
    <FormProvider {...methods}>
      <form>
        <ColorContext.Provider value={value} {...props} />
      </form>
    </FormProvider>
  )
}
