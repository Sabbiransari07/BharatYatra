import React from "react";

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Search for a state, city or destination...",
  className = "",
  inputClassName = "",
  inputWrapperClassName = "",
  iconClassName = "",
  buttonClassName = "",
  disabled = false,
  buttonText = "Search",
}) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <div className={inputWrapperClassName}>
        <span className={iconClassName} aria-hidden="true">
          ⌕
        </span>

        <input
          className={inputClassName}
          type="search"
          name="destination"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={placeholder}
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        className={buttonClassName}
        disabled={disabled}
      >
        <span>{buttonText}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
