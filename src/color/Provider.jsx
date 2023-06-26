import { ColorContext } from './Context'
import { useColorHooks } from './useColor'

export const ColorProvider = (props) => {
  const value = useColorHooks()

  return (
    <form onSubmit={() => null}>
      <ColorContext.Provider value={value} {...props} />
    </form>
  )
}
