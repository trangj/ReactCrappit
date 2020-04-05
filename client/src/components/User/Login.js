import React, { useState, useContext } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../../context/GlobalState";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const Login = () => {
  const { loginUser } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);

  const handleSubmit = (values) => {
    const { email, password } = values;
    const user = {
      email,
      password,
    };
    loginUser(user);
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} color="inherit">
        Login
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="title">Login</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {() => (
              <Form>
                <Field label="Email" name="email" component={TextFieldForm} />
                <Field
                  label="Password"
                  name="password"
                  type="password"
                  component={TextFieldForm}
                />
                <Button type="submit" style={{ float: "right" }}>
                  Post
                </Button>
              </Form>
            )}
          </Formik>
          <a href="http://localhost:5000/api/user/forgot">
            Forgot your password?
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
