import ClientRegistrationForm from "@/components/register/ClientRegistrationForm";
import { useClientRegistrationForm } from "@/services/ClientRegistration/useClientRegistrationForm";

const ClientRegistration = () => {
  const onClose = () => {
    console.log("close modal / navigate / whatever");
  };

  const { form, onSubmit, isPending, serverMessage, clearServerMessage } =
    useClientRegistrationForm(onClose);

  return (
    <ClientRegistrationForm
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      serverMessage={serverMessage}
      onClearMessage={clearServerMessage}
    />
  );
};

export default ClientRegistration;
