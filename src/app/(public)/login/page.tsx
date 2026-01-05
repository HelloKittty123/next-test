"use client";

import { Button, CheckboxRadix, Input, SelectRadix, TextCustom } from "@components";
import { REGEX_EMAIL } from "@constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks";
import { Skeleton } from "@radix-ui/themes";
import { encodeBase64URL, fetchData } from "@utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { bool, object, string } from "yup";
export interface IFormLogin {
  email: string;
  name: string;
  school?: string;
  city?: string;
  rememberMe?: boolean;
}

const schema = object({
  email: string().required("Đây là trường bắt buộc").matches(new RegExp(REGEX_EMAIL), "Email không hợp lệ"),
  name: string().required("Đây là trường bắt buộc"),
  school: string().optional(),
  city: string().optional(),
  rememberMe: bool().optional(),
});

function LoginPage() {
  const NEXT_PUBLIC_APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE;
  const [cities, setCities] = useState<Array<{ label: string; value: string }>>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(true);

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      school: "",
      city: "",
      rememberMe: true,
    },
  });

  const { setLoading } = useAuth();

  const t = useTranslations();

  const router = useRouter();

  useEffect(() => {
    getCities();
  }, []);

  const onSubmit = (formData: IFormLogin) => {
    const accessToken = encodeBase64URL(JSON.stringify({ ...formData, type: "u" }));
    if (formData.rememberMe) {
      localStorage.setItem("acess_token", accessToken);
    } else {
      sessionStorage.setItem("access_token", accessToken);
    }
    toast("Đăng nhập thành công!", { type: "success", delay: 3000 });

    setLoading(true);
    router.replace("/u");
  };

  const getCities = async () => {
    try {
      const resCities = await fetchData<{
        total: number;
        data: { id: string; name: string; slug: string; type: string }[];
      }>({
        api: "/provinces/location/provinces",
        method: "GET",
        params: {
          page: 0,
          size: 100,
        },
      });

      const cities = resCities?.data.map((city) => ({
        label: city.name,
        value: city.id,
      }));

      setCities(cities || []);
      setLoadingCities(false);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setLoadingCities(false);
    }
  };

  return (
    <div className="w-[500px] max-w-full bg-white rounded-lg flex flex-col items-center px-4 py-6">
      <TextCustom text={NEXT_PUBLIC_APP_TITLE} style={{ fontSize: "20px", lineHeight: "28px", fontWeight: 600 }} />
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
          name="name"
          control={control}
          render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              error={error}
              value={value}
              label={{ text: "Họ và tên", required: true }}
              type="text"
              placeholder="Nhập họ và tên"
              className="h-[48px]"
            />
          )}
        />
        {loadingCities ? (
          <Skeleton height="48px" style={{ borderRadius: "8px" }} />
        ) : (
          <Controller
            name="city"
            control={control}
            render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
              <SelectRadix
                items={cities}
                label={{ text: "Thành phố" }}
                placeholder="Chọn thành phố"
                onChange={onChange}
                value={value}
                disabled={disabled}
                error={error}
                trigger={{
                  class: "!h-12",
                }}
              />
            )}
          />
        )}

        <Controller
          name="school"
          control={control}
          render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              error={error}
              value={value}
              label={{ text: "Trường" }}
              type="text"
              placeholder="Nhập tên trường"
              className="h-[48px]"
            />
          )}
        />
        <Controller
          name="rememberMe"
          control={control}
          render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
            <CheckboxRadix value={value} label={{ text: "Ghi nhớ phiên đăng nhập" }} onChange={onChange} />
          )}
        />
        <Button onClick={handleSubmit(onSubmit)} className="h-12 rounded-lg w-full">
          Đăng nhập
        </Button>
      </div>
    </div>
  );
}

const submit = () => {};

export default LoginPage;
