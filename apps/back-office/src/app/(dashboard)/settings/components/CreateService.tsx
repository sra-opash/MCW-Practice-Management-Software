"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  Input,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@mcw/ui";

interface CreateServiceProps {
  setCreateServiceModel: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
}

export function CreateService({
  setCreateServiceModel,
  onSuccess,
}: CreateServiceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Array<{ id: string; code: string }>>(
    [],
  );
  const [formData, setFormData] = useState({
    service: "",
    description: "",
    rate: "",
    duration: "",
    isDefault: false,
    billInUnits: false,
    availableOnline: false,
    allowNewClients: false,
    requireCall: false,
    minutesBefore: "",
    minutesAfter: "",
  });

  const [formErrors, setFormErrors] = useState({
    service: "",
    rate: "",
    duration: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // const response = await fetch('/api/service');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch services');
        // }
        // const data = await response.json();
        const data = [
          { id: "1", code: "1234" },
          { id: "2", code: "5678" },
          { id: "3", code: "9123" },
        ];
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        throw new Error("Failed to load services. Please try again.");
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Manual validation
    const errors = { ...formErrors };
    if (!formData.service) errors.service = "Service is required";
    if (!formData.rate) errors.rate = "Rate is required";
    if (!formData.duration) errors.duration = "Duration is required";

    if (Object.values(errors).some((error) => error)) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create service");
      }

      setFormData({
        service: "",
        description: "",
        rate: "",
        duration: "",
        isDefault: false,
        billInUnits: false,
        availableOnline: false,
        allowNewClients: false,
        requireCall: false,
        minutesBefore: "",
        minutesAfter: "",
      });
      setCreateServiceModel(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[50%]">
      <form
        onSubmit={handleSubmit}
        className="w-full p-[24px] flex flex-col gap-[32px] bg-[#F9FAFB] rounded-lg"
      >
        <div className="w-full flex justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-[#1F2937] leading-[24px]">
              Add New Services
            </h1>
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="flex flex-col w-[48%]">
            <label className="text-[14px] font-semibold text-[#374151]">
              Service
            </label>
            <Select
              name="service"
              onValueChange={handleSelectChange}
              value={formData.service}
            >
              <SelectTrigger className="bg-[#ffffff] w-full mt-2">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.code}>
                    {service.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.service && (
              <div className="text-red-600 text-sm">{formErrors.service}</div>
            )}
          </div>

          <div className="flex flex-col w-[48%]">
            <label className="text-[14px] font-semibold text-[#374151]">
              Description
            </label>
            <Input
              placeholder="Enter Description"
              className="bg-[#ffffff] w-[full] mt-2"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col w-[48%]">
            <label className="text-[14px] font-semibold text-[#374151]">
              Rate
            </label>
            <Input
              placeholder="Enter Rate"
              className="bg-[#ffffff] w-[full] mt-2"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
            />
            {formErrors.rate && (
              <div className="text-red-600 text-sm">{formErrors.rate}</div>
            )}
          </div>

          <div className="w-[48%] flex items-center">
            <label className="text-[14px] font-semibold text-[#374151]">
              Default Duration
            </label>
            <div className="flex items-center gap-2 ml-[10px]">
              <Input
                className="w-[80px] bg-[#ffffff]"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              />
              <span className="text-[14px] text-[#374151]">min</span>
            </div>
            {formErrors.duration && (
              <div className="text-red-600 text-sm ml-[10px]">
                {formErrors.duration}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <Checkbox
              checked={formData.isDefault}
              onChange={(e) =>
                handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>)
              }
              id="isDefault"
            />
            <p className="text-[14px] font-semibold text-[#374151]">
              Make this the default service
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Checkbox
              checked={formData.billInUnits}
              onChange={(e) =>
                handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>)
              }
              id="billInUnits"
            />
            <p className="text-[14px] font-semibold text-[#374151]">
              Bill this code in units
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-bold text-[#1F2937] leading-[18px]">
            Booking Options
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <Checkbox
                checked={formData.availableOnline}
                onChange={(e) =>
                  handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                id="availableOnline"
              />
              <p className="text-[14px] font-semibold text-[#374151]">
                Available for online appointment requests
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Checkbox
                checked={formData.allowNewClients}
                onChange={(e) =>
                  handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                id="allowNewClients"
              />
              <p className="text-[14px] font-semibold text-[#374151]">
                Allow for New Clients
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Checkbox
                checked={formData.requireCall}
                onChange={(e) =>
                  handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                id="requireCall"
              />
              <p className="text-[14px] font-semibold text-[#374151]">
                Require Clients to call to request available appointment
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#374151]">
              Block of
            </span>
            <Input
              className="bg-[#ffffff] w-[64px] mt-2"
              name="minutesBefore"
              value={formData.minutesBefore}
              onChange={handleInputChange}
            />
            <span className="text-[14px] font-semibold text-[#374151]">
              minutes before and
            </span>
            <Input
              className="bg-[#ffffff] w-[64px] mt-2"
              name="minutesAfter"
              value={formData.minutesAfter}
              onChange={handleInputChange}
            />
            <span className="text-[14px] font-semibold text-[#374151]">
              minutes after the appointment
            </span>
          </div>
        </div>

        {/* Continue the form fields similarly for checkboxes and other fields */}

        <div className="flex w-full justify-end items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCreateServiceModel(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
