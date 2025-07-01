"use client";
import { FieldValues, useForm } from "react-hook-form";
import "./style.css";
import { useState } from "react";
import { ServerFetch } from "@/actions/server-fetch";
import { getSession } from "next-auth/react";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { RefreshCw } from "lucide-react";

interface ChangePasswordFormProps {
  className?: string;
}
function ChangePasswordForm({ className = "" }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState<FieldValues>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleFormSubmit = async (
    data: FieldValues,
    event: React.FormEvent
  ) => {
    setIsSubmitting(true);
    const session = await getSession();
    const dataPost = {
      email: session?.user.email,
      current_password: data.old_password,
      new_password: data.new_password,
    };
    const changePass = await ServerFetch(`/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.token}`,
      },
      body: JSON.stringify(dataPost),
    });

    if (changePass?.status) {
      SuccessToast("Password changed successfully");
      setIsSubmitting(false);
      reset();
    } else {
      ErrorToast(changePass?.message);
      setIsSubmitting(false);
    }
  };
  const onSubmit = (event: React.FormEvent) => {
    handleSubmit((data) => handleFormSubmit(data, event))(event);
  };

  return (
    <form className="cpf__form" onSubmit={onSubmit}>
      <div className="cpf__input--container">
        <label htmlFor="oldPass" className="dash-value">
          Old Password
        </label>
        <input
          type="password"
          id="oldPass"
          className={`input ${errors.old_password ? "error-input" : ""}`}
          placeholder="Old Password"
          {...register("old_password", {
            required: {
              value: true,
              message: "Please enter your old password.",
            },
          })}
        />
        {errors.old_password && (
          <p className="error">{errors.old_password.message}</p>
        )}
      </div>
      <div className="cpf__input--container">
        <label htmlFor="newPass" className="dash-value">
          New Password
        </label>
        <input
          type="password"
          id="newPass"
          className={`input ${errors.new_password ? "error-input" : ""}`}
          placeholder="New Password"
          {...register("new_password", {
            required: {
              value: true,
              message: "Please enter new password.",
            },
            minLength: {
              value: 8,
              message: "New Password should be at least 8 chracters.",
            },
          })}
        />
        {errors.new_password && (
          <p className="error">{errors.new_password.message}</p>
        )}
      </div>
      <div className="cpf__input--container">
        <label htmlFor="confirmPass" className="dash-value">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPass"
          className={`input ${errors.confirm_password ? "error-input" : ""}`}
          placeholder="Confirm Password"
          {...register("confirm_password", {
            required: {
              value: true,
              message: "Please enter confirm password.",
            },
            minLength: {
              value: 8,
              message: "Confirm Password should be at least 8 chracters.",
            },
            validate: (value) =>
              value === getValues("new_password") || "Passwords do not match",
          })}
        />
        {errors.confirm_password && (
          <p className="error">{errors.confirm_password.message}</p>
        )}
      </div>
      <input type="submit" hidden />
      <div className="cpf__buttons">
        <button
          disabled={isSubmitting}
          className="button__primary-light"
          type="submit"
        >
          Save
          {isSubmitting && <RefreshCw className="animate-spin" />}
        </button>
        <button type="button" className="button__transparent">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
