import { useFormContext } from 'react-hook-form'

const Input = ({ onChange: onChangeProp, ...props }) => {
  const { register } = useFormContext()
  const onChange = ({ target: { name, value } }) => {
    if (onChangeProp) { onChangeProp([name, value])}
  }
  return <input {...register(props.name, { onChange })} {...props} /> 
}

export {
  Input,
}
