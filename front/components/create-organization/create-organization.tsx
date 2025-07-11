"use client";

import Header from "./header";
import FormLayout from "./form-layout";
import { memo } from "react";
import OrganizationForm from "./organization-form";

const CreateOrganization = () => {
  return (
    <FormLayout>
      <Header />
      <OrganizationForm />
    </FormLayout>
  );
};
export default memo(CreateOrganization);
