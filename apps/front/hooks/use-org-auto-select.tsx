"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

export const useOrgAutoSelect = () => {
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: true,
  });
  const { orgId } = useAuth();

  useEffect(() => {
    if (orgId || !setActive) return;
    const defaultOrg = userMemberships.data?.[0];
    if (!defaultOrg) return;

    setActive({
      organization: defaultOrg.organization.id,
    });
  }, [orgId, setActive, userMemberships.data]);
};
