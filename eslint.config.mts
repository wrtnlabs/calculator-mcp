import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  type: "app",
  test: true,
  ignores: ["eslint.config.mts", "bin"],
  rules: {
    "no-unsafe-assignment": "off",
    "no-unsafe-call": "off",
    "no-unsafe-member-access": "off",
    "no-console": "off",
  },
});
