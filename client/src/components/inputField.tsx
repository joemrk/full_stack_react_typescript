import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/core';
import { useField } from 'formik';
import React, {InputHTMLAttributes} from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  placeholder?: string
  label: string,
  textarea?: boolean
}

const InputField: React.FC<InputFieldProps> = ({label, textarea, size: _, ...props}) => {
  let C = Input
  if(textarea) C = Textarea

  const [field, {error}] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <C {...field} type={props.type} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
export default InputField