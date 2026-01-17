"use client";

import { Button, Input, TextCustom } from "@components";
import { REGEX_EMAIL } from "@constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks";
import { loginAD } from "@services";
import { IADFormLogin } from "@types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { object, string } from "yup";

const schema = object({
  email: string().required("Đây là trường bắt buộc").matches(new RegExp(REGEX_EMAIL), "Email không hợp lệ"),
  password: string().required("Đây là trường bắt buộc"),
});

function LoginADPage() {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { setLoading } = useAuth();

  const onSubmit = async (formData: IADFormLogin) => {
    try {
      setIsSubmit(true);
      const response = await loginAD({ ...formData, name: "admin", type: "a" });

      if (response && response.verified) {
        toast("Đăng nhập thành công!", { type: "success", position: "top-right" });
        setLoading(true);
        router.replace("/");
      }
    } catch (error) {
      toast("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.", {
        type: "error",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
      });
      setIsSubmit(false);
    }
  };

  return (
    <div className="w-[500px] max-w-full bg-white rounded-lg flex flex-col items-center px-4 py-6">
      <TextCustom
        text="Chào mừng bạn đến trang ADMIN"
        style={{ fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}
      />
      <div className="w-full flex flex-col gap-5">
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              error={error}
              value={value}
              label={{ text: "Email", required: true }}
              type="text"
              placeholder="Nhập email"
              className="h-[48px]"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              error={error}
              value={value}
              label={{ text: "Mật khẩu", required: true }}
              customType="password"
              placeholder="Nhập mật khẩu"
              className="h-[48px]"
            />
          )}
        />

        <Button
          onClick={handleSubmit(onSubmit)}
          loading={isSubmit}
          disabled={isSubmit}
          className="h-12 rounded-lg w-full"
        >
          Đăng nhập
        </Button>
      </div>
    </div>
  );
}

export default LoginADPage;
