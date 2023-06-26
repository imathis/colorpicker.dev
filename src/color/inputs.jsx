const codeTextProps = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: "false",
}

const Input = ({ onChange: onChangeProp, ...props }) => {
  const onChange = ({ target }) => {
    const { name, value } = target
    if (target.checkValidity()) {
      if (onChangeProp) { onChangeProp([name, value])}
    }
  }
  return <input 
    onChange={onChange}
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
