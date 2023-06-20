import { useFormContext } from 'react-hook-form'

const codeTextProps = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: "false",
}

const Input = ({ onChange: onChangeProp, isCode, ...props }) => {
  const { register } = useFormContext()
  const onChange = ({ target: { name, value } }) => {
    if (onChangeProp) { onChangeProp([name, value])}
  }
  return <input 
    {...register(props.name, { onChange })}
    {...props}
  /> 
}

const CodeInput = (props) => (
  <Input type="text" {...props} {...codeTextProps} />
)

export {
  Input,
  CodeInput,
}
