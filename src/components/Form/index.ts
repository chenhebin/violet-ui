
import FieldForm from './Form';
import Field from './Field';
import { useForm } from './hook/useForm'

const ViForm = FieldForm as any;
ViForm.Field = Field as any;
ViForm.useForm = useForm;

export { Field, useForm };
export default ViForm;
