
## Form

Demo:

```tsx
import React from 'react';
import { Form } from 'dumi-rc-form-perf-demo';

const [form] = Form.useForm()
export default () => {
  const formRef = React.useRef(null)
  React.useEffect(() => {
    // console.log('get formRef is: ', formRef)
  }, [form]);
  const initialValues = {
    username: 'test name',
    password: '123123'
  }
  const onFinish = (values) => {
    console.log('Form Values: ', values)
  }
  const onFinishFailed = (values) => {
    console.log('Validation Failed: ', values)
  }
  const formChange = (values) => {
    console.log('formChange: ', values)
  }
  return (
    <Form onFormChange={formChange} form={form} ref={formRef} initialValues={initialValues} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Field name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
        {(control, meta) => {
          return (
            <div>
              <input placeholder="Username" {...control} /><br/>
              {meta.errors.length > 0 && (
                <span style={{ color: "red" }}>{JSON.stringify(meta)}</span>
              )}
            </div>
          )
        }}
      </Form.Field>
      <Form.Field name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        {({ value, onChange }) => <input placeholder="Password" value={value} onChange={onChange} />}
      </Form.Field>
      <button type="submit">Submit</button>
    </Form>
  )
}
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
