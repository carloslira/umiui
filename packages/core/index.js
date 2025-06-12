import plugin from "./builder/plugin";
import variables from "./builder/variables";
import pluginOptionsHandler from "./builder/plugin-options-handler";

import themesObject from "./theme/object";

import { base, components, utilities } from "./imports";

const version = "1.0.0";

export default plugin.withOptions(
  (options) => {
    return ({ addBase, addComponents, addUtilities }) => {
      const {
        include,
        exclude,
        prefix = "",
      } = pluginOptionsHandler(options, addBase, themesObject, version);

      const shouldIncludeItem = (name) => {
        if (include && exclude) {
          return include.includes(name) && !exclude.includes(name);
        }
        if (include) {
          return include.includes(name);
        }
        if (exclude) {
          return !exclude.includes(name);
        }
        return true;
      };

      Object.entries(base).forEach(([name, item]) => {
        if (!shouldIncludeItem(name)) return;
        item({ addBase, prefix });
      });

      Object.entries(components).forEach(([name, item]) => {
        if (!shouldIncludeItem(name)) return;
        item({ addComponents, prefix });
      });

      Object.entries(utilities).forEach(([name, item]) => {
        if (!shouldIncludeItem(name)) return;
        item({ addUtilities, prefix });
      });
    };
  },
  () => ({
    theme: {
      extend: variables,
    },
  })
);
