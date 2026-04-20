import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCabin } from "../../services/apiCabins";
import FormRow from "../../ui/FormRow";

function CreateCabinForm({ cabin }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();
  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: (cabinData) => createCabin(cabinData),
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
  function onSubmit(data) {
    console.log(data);
    mutate({ ...data, image: data.image[0] });
  }
  function onError() {}
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          defaultValue={cabin?.name || ""}
          {...register("name", { required: "Cabin name is required" })}
        />
      </FormRow>
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          defaultValue={cabin?.maxCapacity || ""}
          {...register("maxCapacity", {
            required: "Maximum capacity is required",
            min: {
              value: 1,
              message: "Maximum capacity must be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          defaultValue={cabin?.regularPrice || ""}
          {...register("regularPrice", {
            required: "Regular price is required",
            min: {
              value: 0,
              message: "Regular price cannot be negative",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={cabin?.discount || ""}
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
      >
        <Textarea
          id="description"
          defaultValue={cabin?.description || ""}
          {...register("description", { required: "Description is required" })}
        />
      </FormRow>

      <FormRow label="  Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          // defaultValue={cabin ? [cabin.image] : null}
          {...register("image", { required: "Cabin photo is required" })}
        />
      </FormRow>

      <FormRow orientation="horizontal">
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {isCreating ? "Creating..." : "Create cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
