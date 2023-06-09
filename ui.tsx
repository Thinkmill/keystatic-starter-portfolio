"use client";
import { forwardRef } from "react";

export const ColorFieldInput = forwardRef(function Input(
  props: any,
  forwardedRef: any
) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "rgb(75, 75, 75)" }}
    >
      <label style={{ fontFamily: "Inter, sans-serif" }}>{props.label}</label>
      <input
        type="color"
        ref={forwardedRef}
        autoFocus={props.autoFocus}
        value={props.value === null ? undefined : props.value}
        onChange={(event) => {
          props.onChange(
            (event.target.value === undefined
              ? null
              : event.target.value) as any
          );
        }}
      />
    </div>
  );
});
