import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input } from "@nextui-org/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "../../lib/validators";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      await login(data.email, data.password);
      reset();
      setSuccessMessage("Login successful!");
    } catch (error) {
      setError("root", {
        message: "Failed to login",
      });
    }
  };

  return (
    <AuthLayout title="Sign in to your account">
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
                  id="email"
                  type="email"
                  required
                  className="w-full"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
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
                <Input
                  id="password"
                  type="password"
                  required
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password?.message}</p>
            )}
          </div>
        </div>
        <Button
          className="mt-2 text-xl"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Sign in
        </Button>
        <p className="text-sm dark:text-gray-400">
          Don’t have an account yet?
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
