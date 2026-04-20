import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";
import FormRow from "../../ui/FormRow";

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const queryClient = useQueryClient();
  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      queryClient.invalidateQueries("cabins");
      reset();

      toast.success("Cabin created successfully!");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the cabin.",
      );
    },
  });
  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ cabinData, id }) => createEditCabin(cabinData, id),
    onSuccess: () => {
      queryClient.invalidateQueries("cabins");
      reset();

      toast.success("Cabin edited successfully!");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while editing the cabin.",
      );
    },
  });

  const isWorking = isCreating || isEditing;
  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    console.log("Form submitted with data:", data, "and image:", image);
    if (isEditSession) editCabin({ cabinData: { ...data, image }, id: editId });
    else createCabin({ ...data, image: image });
  }
  function onError() {}
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow
        label="Cabin name"
        error={errors?.name?.message}
        disabled={isWorking}
      >
        <Input
          type="text"
          id="name"
          {...register("name", { required: "Cabin name is required" })}
        />
      </FormRow>
      <FormRow
        label="Maximum capacity"
        error={errors?.maxCapacity?.message}
        disabled={isWorking}
      >
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "Maximum capacity is required",
            min: {
              value: 1,
              message: "Maximum capacity must be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Regular price"
        error={errors?.regularPrice?.message}
        disabled={isWorking}
      >
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "Regular price is required",
            min: {
              value: 0,
              message: "Regular price cannot be negative",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Discount"
        error={errors?.discount?.message}
        disabled={isWorking}
      >
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "Discount is required",
            min: {
              value: 0,
              message: "Discount cannot be negative",
            },
            validate: (value) => {
              const regularPrice = parseFloat(getValues("regularPrice"));
              if (regularPrice && parseFloat(value) > regularPrice) {
                return "Discount cannot exceed regular price";
              }
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
        disabled={isWorking}
      >
        <Textarea
          id="description"
          {...register("description", { required: "Description is required" })}
        />
      </FormRow>

      <FormRow
        label="  Cabin photo"
        error={errors?.image?.message}
        disabled={isWorking}
      >
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "Cabin photo is required",
          })}
        />
      </FormRow>

      <FormRow orientation="horizontal">
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit Cabin" : "Create new Cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
