import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { SignupSchema, signupSchema } from "../../lib/validators";
import { Link } from "react-router-dom";

const Signup = () => {
  const { VITE_BACKEND_URL } = import.meta.env;

  const { signup } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<SignupSchema> = async (data) => {
    try {
      const usernameExistsResponse = await fetch(
        `${VITE_BACKEND_URL}/api/user?username=${data.username}`
      );
      const usernameExistsData = await usernameExistsResponse.json();
      if (usernameExistsData.exists) {
        setError("username", {
          type: "manual",
          message: "Username already exists",
        });
        return;
      }

      const emailExistsResponse = await fetch(
        `${VITE_BACKEND_URL}/api/user?email=${data.email}`
      );
      const emailExistsData = await emailExistsResponse.json();
      if (emailExistsData.exists) {
        setError("email", {
          type: "manual",
          message: "Email already exists",
        });
        return;
      }

      await signup(data.email, data.username, data.password);
      reset();
      setSuccessMessage("Signup successful! Please log in.");
    } catch (error) {
      setError("root", {
        message: "Failed to signup",
      });
    }
  };

  return (
    <AuthLayout title="Create a new account">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="flex flex-col gap-4 max-w-lg w-full">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  required
                  type="email"
                  className="w-full"
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email?.message}</p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Username
          </label>
          <div className="mt-2">
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  required
                  type="text"
                  className="w-full"
                  {...field}
                />
              )}
            />
            {errors.username && (
              <p className="text-red-600">{errors.username?.message}</p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
          <div className="mt-2">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input id="password" type="password" required {...field} />
              )}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password?.message}</p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Confirm Password
          </label>
          <div className="mt-2">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  {...field}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-600">{errors.confirmPassword?.message}</p>
            )}
          </div>
        </div>
        <Button className="mt-2 text-xl"  color="primary" onClick={handleSubmit(onSubmit)}>Sign up</Button>
        <p className="text-sm dark:text-gray-400">
          Do you already have an account?
          <a
            href="#"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            <Link to="/login" className="ml-1">Sign in</Link>
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;