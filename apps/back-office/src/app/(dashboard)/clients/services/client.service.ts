interface Location {
  id: string;
  name: string;
  address?: string;
  is_active?: boolean;
}

interface ClientGroup {
  id: string;
  type: string;
  name: string;
}

export const createClient = async ({ body = {} }) => {
  try {
    const response: unknown = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/client`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const fetchClientGroups = async (): Promise<
  [ClientGroup[] | null, Error | null]
> => {
  try {
    const response: unknown = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/client/group`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return [response as ClientGroup[], null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
};
export const fetchLocations = async (): Promise<
  [Location[] | null, Error | null]
> => {
  try {
    const response: unknown = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/location`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return [response as Location[], null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
};
export const fetchClinicians = async () => {
  try {
    const response: unknown = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clinician`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
