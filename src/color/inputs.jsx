import { useFormContext } from 'react-hook-form'

const codeTextProps = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: "false",
}

const Input = ({ onChange: onChangeProp, ...props }) => {
  const { register, getFieldState, setError } = useFormContext()
  const onChange = ({ target }) => {
    const { name, value } = target
    if (target.checkValidity()) {
      if (onChangeProp) { onChangeProp([name, value])}
    }
  }
  return <input 
    {...register(props.name, { onChange })}
    {...props}
  /> 
}

const CodeInput = (props) => (
  <Input type="text" {...props} {...codeTextProps} required />
)

export {
  Input,
  CodeInput,
}
