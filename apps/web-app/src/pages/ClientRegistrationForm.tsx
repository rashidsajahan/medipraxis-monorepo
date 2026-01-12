import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clientRegistrationFormSchema,
  GENDER_OPTIONS,
  TITLE_OPTIONS,
  type ClientRegistrationFormValues,
  type ClientRegistrationProps,
  type ServerMessage,
} from "@/types/clientRegistration.types";
import { useRegisterPatient } from "@/api/ClientRegistration";

const ClientRegistrationForm = ({ onClose }: ClientRegistrationProps) => {
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(
    null
  );

  const { mutate, isPending, reset } = useRegisterPatient({
    onSuccess: () => {
      setServerMessage({
        type: "success",
        text: "Patient registered successfully!",
      });
      setTimeout(onClose, 1500);
    },
    onError: (message) => {
      setServerMessage({
        type: "error",
        text: message,
      });
    },
  });

  const defaultValues: ClientRegistrationFormValues = {
    title: "Mr",
    first_name: "",
    last_name: "",
    gender: "MALE",
    date_of_birth: "",
    user_id: "",
    contact_id: "",
  };

  const form = useForm({
    resolver: zodResolver(clientRegistrationFormSchema),
    defaultValues,
  });

  const onSubmit = (values: ClientRegistrationFormValues) => {
    if (isPending) return;

    setServerMessage(null);
    reset();

    const payload: ClientRegistrationFormValues = {
      ...values,
      user_id: "2a3c19b8-d352-4b30-a2ac-1cdf993d310c",
      contact_id: "57e0f5d8-92ad-44c9-b546-ccd3502af7d0",
    };

    mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl pb-0 border-none">
        <CardHeader>
          <CardTitle>Patient Registration</CardTitle>
          <CardDescription>
            Enter patient details to create a new file.
          </CardDescription>
        </CardHeader>

        <CardContent className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form
              id="patient-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TITLE_OPTIONS.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}.
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* First Name */}
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jennifer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        {GENDER_OPTIONS.map((gender) => (
                          <FormItem
                            key={gender}
                            className="flex items-center space-x-2"
                          >
                            <FormControl>
                              <RadioGroupItem value={gender} />
                            </FormControl>
                            <FormLabel className="capitalize">
                              {gender.toLowerCase()}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Server Message */}
              {serverMessage && (
                <div
                  className={`p-3 rounded-lg text-sm flex justify-between ${
                    serverMessage.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span>{serverMessage.text}</span>
                  <button onClick={() => setServerMessage(null)}>
                    &times;
                  </button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-end bg-[#EBF4B6] h-16 rounded-b-2xl">
          <Button
            type="submit"
            form="patient-form"
            disabled={isPending}
            className="flex items-center bg-black text-white gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientRegistrationForm;
