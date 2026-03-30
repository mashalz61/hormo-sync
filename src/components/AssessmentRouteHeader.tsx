import { Href } from "expo-router";
import { ReactNode } from "react";

import { ChildRouteHeader } from "./ChildRouteHeader";

interface AssessmentRouteHeaderProps {
  title: string;
  subtitle?: string;
  fallbackRoute?: Href;
  backLabel?: string;
  rightAction?: ReactNode;
}

export const AssessmentRouteHeader = ({
  title,
  subtitle,
  fallbackRoute = "/assessments",
  backLabel = "Back to insights",
  rightAction,
}: AssessmentRouteHeaderProps) => (
  <ChildRouteHeader
    title={title}
    subtitle={subtitle}
    fallbackRoute={fallbackRoute}
    backLabel={backLabel}
    rightAction={rightAction}
  />
);
