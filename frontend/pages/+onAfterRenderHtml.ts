import { PageContext } from "vike/types";
import { useConfig } from "vike-react/useConfig";
import clsx from "clsx";

export default (pageContext: PageContext) => {
  const { theme } = pageContext.custom.settings;
  const config = useConfig();

  // Adds dark or system class to let Tailwind know if it should display in dark mode,
  // Configured here as it would cause the screen to flash from light to dark mode
  config({
    htmlAttributes: {
      class: clsx("bg-background text-foreground", theme),
    },
  });
};
