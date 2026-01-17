"use client";

import {
    Button,
    CheckboxRadix,
    DatePicker,
    Input,
    SelectRadix,
    TextCustom,
} from "@components";
import { REGEX_EMAIL } from "@constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth, useLoading } from "@hooks";
import { Skeleton } from "@radix-ui/themes";
import { encodeBase64URL, fetchData } from "@utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { bool, date, object, string } from "yup";
export interface IFormLogin {
    email: string;
    name: string;
    school?: string;
    city?: string;
    rememberMe?: boolean;
    address?: string;
    identity?: string;
    dob?: Date;
    org?: string;
}

const schema = object({
    email: string()
        .required("Đây là trường bắt buộc")
        .matches(new RegExp(REGEX_EMAIL), "Email không hợp lệ"),
    name: string().required("Đây là trường bắt buộc"),
    // city: string().required("Đây là trường bắt buộc"),
    address: string().required("Đây là trường bắt buộc"),
    identity: string().required("Đây là trường bắt buộc"),
    dob: date().required("Đây là trường bắt buộc"),
    org: string().required("Đây là trường bắt buộc"),
});

function LoginPage() {
    const NEXT_PUBLIC_APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE;
    const [cities, setCities] = useState<
        Array<{ label: string; value: string }>
    >([]);
    const [loadingCities, setLoadingCities] = useState<boolean>(true);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { handleSubmit, control, reset } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            name: "",
            // city: "",
            address: "",
            identity: "",
            dob: new Date(),
            org: "",
        },
    });

    const { setLoading } = useAuth();

    const t = useTranslations();

    const router = useRouter();

    useEffect(() => {
        // getCities();
    }, []);

    const onSubmit = (formData: IFormLogin) => {
        setIsSubmit(true);

        const accessToken = encodeBase64URL(
            JSON.stringify({ ...formData, type: "u" }),
        );
        if (formData.rememberMe) {
            localStorage.setItem("acess_token", accessToken);
        } else {
            sessionStorage.setItem("access_token", accessToken);
        }
        toast("Đăng nhập thành công!", { type: "success", delay: 3000 });

        setLoading(true);
        router.replace("/");
    };

    const getCities = async () => {
        try {
            const resCities = await fetchData<{
                total: number;
                data: {
                    id: string;
                    name: string;
                    slug: string;
                    type: string;
                }[];
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
        <div className="w-[500px] max-w-full h-fit bg-white rounded-lg flex flex-col items-center px-4 py-6">
            <TextCustom
                text={NEXT_PUBLIC_APP_TITLE}
                style={{
                    fontSize: "20px",
                    lineHeight: "28px",
                    fontWeight: 600,
                }}
            />
            <div className="w-full flex flex-col gap-5">
                <Controller
                    name="email"
                    control={control}
                    render={({
                        field: { onChange, onBlur, value, name, disabled },
                        fieldState: { error },
                    }) => (
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
                    render={({
                        field: { onChange, onBlur, value, name, disabled },
                        fieldState: { error },
                    }) => (
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
                {/* {loadingCities ? (
                    <Skeleton height="48px" style={{ borderRadius: "8px" }} />
                ) : (
                    <Controller
                        name="city"
                        control={control}
                        render={({
                            field: { onChange, onBlur, value, name, disabled },
                            fieldState: { error },
                        }) => (
                            <SelectRadix
                                items={cities}
                                label={{ text: "Thành phố", required: true }}
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
                )} */}

                <Controller
                    name="address"
                    control={control}
                    render={({
                        field: { onChange, onBlur, value, name, disabled },
                        fieldState: { error },
                    }) => (
                        <Input
                            multipleLine={true}
                            onChange={onChange}
                            onBlur={onBlur}
                            disabled={disabled}
                            error={error}
                            value={value}
                            label={{
                                text: "Địa chỉ thường trú",
                                required: true,
                            }}
                            type="text"
                            placeholder="Ví du: Số nhà 12, ngõ 22, đường..."
                            className="h-[48px]"
                        />
                    )}
                />

                <Controller
                    name="identity"
                    control={control}
                    render={({
                        field: { onChange, onBlur, value, name, disabled },
                        fieldState: { error },
                    }) => (
                        <Input
                            onChange={onChange}
                            onBlur={onBlur}
                            disabled={disabled}
                            error={error}
                            value={value}
                            label={{ text: "CMND/CCCD", required: true }}
                            type="text"
                            placeholder="Nhập số CMND/CCCD"
                            className="h-[48px]"
                        />
                    )}
                />

                <Controller
                    name="dob"
                    control={control}
                    render={({
                        field: { onChange, onBlur, value, name, disabled },
                        fieldState: { error },
                    }) => (
                        <DatePicker
                            placeholder="Chọn ngày tháng năm sinh"
                            className="h-[48px]"
                            onChange={onChange}
                            value={value}
                            label={{
                                text: "Ngày tháng năm sinh",
                                required: true,
                            }}
                            disabled={disabled}
                        />
                    )}
                />

                <Controller
                    name="org"
                    control={control}
                    render={({
                        field: { onChange, onBlur, value, name, disabled },
                        fieldState: { error },
                    }) => (
                        <Input
                            onChange={onChange}
                            onBlur={onBlur}
                            disabled={disabled}
                            error={error}
                            value={value}
                            label={{ text: "Đơn vị", required: true }}
                            type="text"
                            placeholder="Nhập tên đơn vị"
                            className="h-[48px]"
                        />
                    )}
                />

                <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmit}
                    loading={isSubmit}
                    className="h-12 rounded-lg w-full"
                >
                    Đăng nhập
                </Button>
            </div>
        </div>
    );
}

const submit = () => {};

export default LoginPage;
