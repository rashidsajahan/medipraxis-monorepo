import type { Client } from "@repo/models";
import { parsePhoneNumber } from "libphonenumber-js";

// Base URL - configure this based on your environment
const API_BASE_URL = "http://localhost:8787"; // Hardcoded for development

// API Response types
interface FetchClientsResponse {
  clients: Client[];
  count: number;
}

interface CreateClientResponse {
  client: Client;
}

interface GetClientResponse {
  client: Client;
}

interface CheckPhoneResponse {
  exists: boolean;
  clients: Client[];
}

// Fetch all clients for a user
export async function fetchAllClients(userId: string): Promise<Client[]> {
  try {
    console.log(
      `Fetching clients from: ${API_BASE_URL}/api/clients?user_id=${userId}`
    );

    const response = await fetch(
      `${API_BASE_URL}/api/clients?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as FetchClientsResponse;
    console.log("Response data:", data);
    console.log("Clients count:", data.count);
    console.log("Clients array length:", data.clients?.length);

    return data.clients || [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}

//Create a new client
export async function createNewClient(
  clientData: {
    title?: string | null;
    firstName: string;
    lastName?: string | null;
    gender?: "MALE" | "FEMALE" | "OTHER" | null;
    dateOfBirth?: string | null;
    contactNumber?: string | null;
    emergencyContactName?: string | null;
    emergencyContactNumber?: string | null;
    emergencyContactRelationship?: string | null;
    knownConditions?: string[] | null;
    note?: string | null;
  },
  userId: string
): Promise<Client> {
  try {
    // Parse contact number
    let countryCode = "94";
    let contactNumber = "0000000000";
    
    if (clientData.contactNumber) {
      try {
        const phoneNumber = parsePhoneNumber(clientData.contactNumber);
        if (phoneNumber) {
          countryCode = phoneNumber.countryCallingCode;
          contactNumber = phoneNumber.nationalNumber;
        }
      } catch (error) {
        console.error("Error parsing contact number:", error);
      }
    }

    // Parse emergency contact number
    let emergencyCountryCode = null;
    let emergencyContactNumber = null;
    
    if (clientData.emergencyContactNumber) {
      try {
        const emergencyPhone = parsePhoneNumber(clientData.emergencyContactNumber);
        if (emergencyPhone) {
          emergencyCountryCode = emergencyPhone.countryCallingCode;
          emergencyContactNumber = emergencyPhone.nationalNumber;
        }
      } catch (error) {
        console.error("Error parsing emergency contact number:", error);
      }
    }

    const payload = {
      title: clientData.title || "Mr",
      first_name: clientData.firstName,
      last_name: clientData.lastName || "",
      gender: clientData.gender || "MALE",
      date_of_birth: "1900-01-01",
      country_code: countryCode,
      contact_number: contactNumber,
      emergency_contact_name: clientData.emergencyContactName || null,
      emergency_contact_country_code: emergencyCountryCode,
      emergency_contact_number: emergencyContactNumber,
      emergency_contact_relationship:
        clientData.emergencyContactRelationship || null,
      known_conditions: clientData.knownConditions || null,
      note: clientData.note || null,
      user_id: userId,
      contact_id: null,
    };

    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      console.error("Create client error response:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as CreateClientResponse;
    return data.client;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

// Get a single client by ID
export async function getClientById(clientId: string): Promise<Client | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as GetClientResponse;
    return data.client;
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}

// Check if a phone number exists
export async function checkPhoneExists(
  countryCode: string,
  contactNumber: string
): Promise<{ exists: boolean; clients: Client[] }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/clients/check-phone?country_code=${encodeURIComponent(
        countryCode
      )}&contact_number=${encodeURIComponent(contactNumber)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as CheckPhoneResponse;
    return data;
  } catch (error) {
    console.error("Error checking phone:", error);
    return { exists: false, clients: [] };
  }
}
