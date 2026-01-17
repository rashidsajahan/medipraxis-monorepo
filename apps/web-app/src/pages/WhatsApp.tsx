import { WhatsAppClient, WhatsAppService } from "@repo/whatsapp";

const WhatsApp = () => {
    
  const sendWhatsApp = async () => {
    // const url = `https://graph.facebook.com/v20.0/997165740137495/messages`; // busy
    const url = `https://graph.facebook.com/v20.0/977178835473013/messages`; // bot-test

    const payload = {
      messaging_product: "whatsapp",
      to: 94763203204,
      type: "template",
      template: {
        name: "hello_world",
        // name: "appointment_confirmation",
        language: { code: "en_US" },
        // components: [
        //   {
        //     type: "body",
        //     parameters: [
        //       { type: "text", text: "John Doe" }, //
        //       { type: "text", text: "Smith Well" },
        //       { type: "text", text: "15th January" },
        //       { type: "text", text: "4.00pm" },
        //       { type: "text", text: "6" },
        //       {
        //         type: "text",
        //         text: "https://www.medipraxis.com.lk/view-appointment/6",
        //       },
        //     ],
        //   },
        // ],
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer EAAJ51YouF1IBQWs7EWfsRf8hJozG5js519UXObGBcl5hWYW9Q3oyCr8GaQVkZBExjQkvxUCb5OfnZATLKrxk8CURg9KJYyOiziJKtuPLGaCW18fye1YjQ4kNSZAOR4WkHsB8EZALFZBB7D10wyjHekZBDsxOosefZCwoVB5uuYZAAITmAzZCUzBV4TWx4Tfd1ZBwZDZD`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      throw new Error("Failed to send WhatsApp message");
    }

    return data;
  };
  const waService = new WhatsAppService(new WhatsAppClient());

  const sendWhatsAppService = async () => {
    debugger;
    await waService.sendAppointmentConfirmation("94770690506", {
      clientName: "John",
      practitionerName: "Silva",
      date: "12 Feb 2026",
      time: "10:30 AM",
      apptNumber: "42",
      apptLink: "https://www.medipraxis.com.lk/view-appointment/42",
    });
  };
  return <button onClick={sendWhatsAppService}>Send WhatsApp Message</button>;
};

export default WhatsApp;
