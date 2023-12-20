import { accessibility, accessibilityWritable } from "../app";
import { get } from "svelte/store";

enum A11YOptions {
    Reduced,
    HighContrast,
}
export const getDuration = (duration: number) => accessibility.reduced ? 0 : duration;
export const toggleAccessibilityOption = (option: A11YOptions) => {

    switch (option) {
        case A11YOptions.Reduced:
            accessibility.reduced = !accessibility.reduced;
            break;
        case A11YOptions.HighContrast:
            accessibility.highContrast = !accessibility.highContrast;
            break;
    }

    // Save choice
    accessibilityWritable.set(accessibility);
    localStorage.setItem("accessibility", JSON.stringify(accessibility));
}
