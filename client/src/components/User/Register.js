import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { useHistory } from "react-router";

const schema = yup.object({
	username: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().required(),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match")
		.required(),
});

const Register = () => {
	const { registerUser } = useContext(UserContext);
	const history = useHistory();

	const handleSubmit = async (values) => {
		const { username, email, password, password2 } = values;
		const user = {
			username,
			email,
			password,
			password2,
		};
		await registerUser(user);
		history.goBack();
	};

	return (
		<>
			<Formik
				initialValues={{
					username: "",
					email: "",
					password: "",
					password2: "",
				}}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<Field label="Username" name="username" component={TextFieldForm} />
						<Field label="Email" name="email" component={TextFieldForm} />
						<Field
							label="Password"
							name="password"
							type="password"
							component={TextFieldForm}
						/>
						<Field
							label="Confirm Password"
							name="password2"
							type="password"
							component={TextFieldForm}
						/>
						<Button type="submit" mt="2">
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default Register;
