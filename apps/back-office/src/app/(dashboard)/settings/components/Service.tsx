"use client";
import type React from "react";
import { Button, Checkbox, Input, Label } from "@mcw/ui";
import { useEffect, useState } from "react";
import { CreateService } from "./CreateService";

interface Service {
  id: string;
  code: string;
  description: string;
  rate: number;
  duration: number;
  type: string;
  color?: string;
  isActive?: boolean;
  isUnitBased?: boolean;
  isOnlineBookingEnabled?: boolean;
  minutesBlockBefore?: number;
  minutesBlockAfter?: number;
}

export default function Service() {
  const [services, setServices] = useState<Service[]>([]);
  const [createServiceModel, setCreateServiceModel] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const allowMultipleOpen = true;

  const toggleItem = (value: string) => {
    setOpenItems((prev) =>
      allowMultipleOpen
        ? prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
        : prev.includes(value)
          ? []
          : [value],
    );
  };

  const fetchServices = async () => {
    setIsLoadingServices(true);
    setError(null);
    try {
      const response = await fetch("/api/service");
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError("Failed to load services. Please try again.");
      console.error("Error fetching services:", err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (id: string, value: string, name: string) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id
          ? {
              ...service,
              [name]:
                name === "rate"
                  ? parseFloat(value) || 0
                  : name === "duration"
                    ? parseInt(value) || 0
                    : value,
            }
          : service,
      ),
    );
  };

  const validateService = (service: Service): boolean => {
    if (!service.description?.trim()) {
      return false;
    }

    if (service.rate < 0) {
      return false;
    }

    if (service.duration < 1) {
      return false;
    }

    return true;
  };

  const submitEditForm = async (id: string) => {
    try {
      const service = services.find((s) => s.id === id);
      if (!service) {
        throw new Error("Service not found");
      }

      if (!validateService(service)) {
        return;
      }

      const response = await fetch(`/api/service/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update service");
      }

      await fetchServices(); // Refresh the services list
    } catch (err) {
      throw new Error("Failed to save service", { cause: err as Error });
    }
  };

  return (
    <>
      <div className="relative w-full p-[24px] flex flex-col gap-[32px] bg-[#F9FAFB]">
        <div className="w-full flex justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#1F2937] leading-[24px]">
              Services
            </h1>
            <h3 className="text-[16px] font-normal text-[#4B5563] leading-[16px] mt-2">
              Manage services and set rates.
            </h3>
          </div>
          <div>
            <Button
              size="lg"
              onClick={() => setCreateServiceModel(true)}
              disabled={isLoadingServices || !!error}
              aria-label="Add new service"
            >
              Add Service
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 p-[16px] rounded-lg" role="alert">
            <p className="text-[16px] font-semibold text-destructive">
              {error}
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={fetchServices}
              disabled={isLoadingServices}
              aria-label="Retry loading services"
            >
              Retry
            </Button>
          </div>
        )}

        {!error && (
          <>
            <div className="bg-[#EFF6FF] p-[16px] rounded-lg" role="note">
              <p className="text-[16px] font-semibold text-[#1F2937]">
                Click on each Service name to edit
              </p>
              <p className="text-[14px] font-normal text-[#4B5563] pt-2">
                Service Descriptions are shown throughout the SimplePractice
                platform internally, in some client communications and in
                superbills.
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-[25px] rounded-md">
              <div className="w-full flex justify-between">
                <p className="font-semibold text-[16px] leading-[16px] text-[#1F2937]">
                  Services
                </p>
                <p className="font-semibold text-[16px] leading-[16px] text-[#1F2937]">
                  Appointment requests
                </p>
              </div>

              {isLoadingServices ? (
                <div
                  className="flex items-center justify-center h-32"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-muted-foreground">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-32"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-muted-foreground">No services found</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setCreateServiceModel(true)}
                    aria-label="Add your first service"
                  >
                    Add your first service
                  </Button>
                </div>
              ) : (
                <div role="list" aria-label="Services list">
                  {services.map((item, indx) => {
                    const isOpen = openItems.includes(item.id);
                    return (
                      <div
                        key={indx}
                        className="border-t border-[#E5E7EB] mt-4"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={
                            isOpen
                              ? "w-full flex justify-between items-center p-4 text-left font-medium bg-[#0000000A]  transition"
                              : "w-full flex justify-between items-center p-4 text-left font-medium transition"
                          }
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <span className="text-[16px] font-normal text-[#2D8467]">
                                {item.code}
                              </span>
                              <span className="text-[16px] font-normal text-[#2D8467]">
                                {item.description}
                              </span>
                            </div>
                            <span className="text-[14px] font-normal text-[#4B5563]">
                              {item.duration} minutes at ${item.rate}
                            </span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="p-4 bg-[#0000000A] animate-in fade-in-10 space-y-3">
                            <form
                              onSubmit={() => submitEditForm(item.id)}
                              className="space-y-6"
                            >
                              <div>
                                <Label
                                  htmlFor="description"
                                  className="block mb-2"
                                >
                                  Description
                                </Label>
                                <Input
                                  id="description"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleChange(
                                      item.id,
                                      e.target.value,
                                      "description",
                                    )
                                  }
                                  className="w-full max-w-md"
                                />
                              </div>

                              <div className="flex flex-wrap gap-6">
                                <div>
                                  <Label htmlFor="rate" className="block mb-2">
                                    Rate
                                  </Label>
                                  <Input
                                    id="rate"
                                    value={item.rate}
                                    onChange={(e) =>
                                      handleChange(
                                        item.id,
                                        e.target.value,
                                        "rate",
                                      )
                                    }
                                    className="w-full max-w-[250px]"
                                  />
                                </div>

                                <div className="flex items-end gap-2">
                                  <div>
                                    <Label
                                      htmlFor="duration"
                                      className="block mb-2"
                                    >
                                      Default Duration
                                    </Label>
                                    <Input
                                      id="duration"
                                      value={item.duration}
                                      onChange={(e) =>
                                        handleChange(
                                          item.id,
                                          e.target.value,
                                          "duration",
                                        )
                                      }
                                      className="w-[80px]"
                                    />
                                  </div>
                                  <span className="mb-2.5 text-gray-600">
                                    min
                                  </span>

                                  <div className="ml-6 mb-2.5 flex items-center gap-2">
                                    <Checkbox
                                      id="active"
                                      defaultChecked={item.isActive}
                                    />
                                    <Label htmlFor="active">Active</Label>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Checkbox id="bill-units" />
                                <Label
                                  htmlFor="bill-units"
                                  className="flex items-center"
                                >
                                  Bill this code in units
                                  {/* <Info className="h-4 w-4 ml-2 text-gray-400" /> */}
                                </Label>
                              </div>

                              <div>
                                <h3 className="font-medium mb-3">
                                  Booking Options
                                </h3>
                                <div className="flex items-center gap-2 mb-4">
                                  <Checkbox id="online-booking" />
                                  <Label htmlFor="online-booking">
                                    Available for online appointment requests
                                  </Label>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <span>Block off</span>
                                  <Input
                                    defaultValue="0"
                                    onChange={(e) =>
                                      handleChange(
                                        item.id,
                                        e.target.value,
                                        "minutesBlockBefore",
                                      )
                                    }
                                    className="w-[60px]"
                                  />
                                  <span>minutes before and</span>
                                  <Input
                                    defaultValue="0"
                                    onChange={(e) =>
                                      handleChange(
                                        item.id,
                                        e.target.value,
                                        "minutesBlockAfter",
                                      )
                                    }
                                    className="w-[60px]"
                                  />
                                  <span>minutes after the appointment</span>
                                </div>
                              </div>

                              <div className="flex gap-3 mt-6">
                                <Button variant="outline">Cancel</Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                  Save
                                </Button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {createServiceModel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-service-title"
        >
          <CreateService
            setCreateServiceModel={setCreateServiceModel}
            onSuccess={() => {
              setCreateServiceModel(false);
              fetchServices();
            }}
          />
        </div>
      )}
    </>
  );
}
