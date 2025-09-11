import React, { useEffect, useState } from 'react';
import Select, { StylesConfig, Props as SelectProps } from 'react-select';
import { useTheme } from 'next-themes';

interface Option {
  value: string;
  label: string;
}

// Default styles for consistent appearance
const defaultCustomStyles = {
  borderRadius: 3,
  fontSize: '14px',
  color: 'var(--gray-12)',
  primaryColor: 'var(--orange-9)',
  primary25: 'var(--orange-3)',
  primary50: 'var(--orange-5)',
  primary75: 'var(--orange-7)',
  focusBorderColor: 'var(--focus-8)',
  borderColor: 'var(--slate-a5)',
  placeholderColor: 'var(--slate-a7)',
  dropdownIndicatorSize: 30,
  height: 30
};

interface SearchableSelectProps extends Omit<SelectProps<Option, boolean>, 'onChange' | 'value' | 'isMulti'> {
  options: Option[];
  onChange: (value: string | string[] | null) => void;
  value?: string | string[] | null;
  placeholder?: string;
  customStyles?: {
    borderRadius?: string | number;
    height?: string | number;
    color?: string;
    fontSize?: string | number;
  };
  usePortal?: boolean;
  isMulti?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onChange,
  value,
  placeholder = 'Search...',
  customStyles = {},
  usePortal = false,
  isMulti = false,
  ...props
}) => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Set portal target after component mounts to avoid SSR issues
  useEffect(() => {
    setPortalTarget(usePortal ? document.body : null);
  }, [usePortal]);

  // Merge default styles with any custom overrides
  const mergedStyles = {
    ...defaultCustomStyles,
    ...customStyles
  };

  // Convert string value to Option object(s)
  const selectedOption = isMulti 
    ? options.filter(option => Array.isArray(value) && value.includes(option.value))
    : value 
      ? options.find(option => option.value === value) || null 
      : null;

  const isDarkMode = isMounted && resolvedTheme === 'dark';

  const selectStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: mergedStyles.borderRadius,
      borderColor: state.isFocused ? mergedStyles.primary25 : mergedStyles.borderColor,
      minHeight: mergedStyles.height,
      fontSize: mergedStyles.fontSize,
      backgroundColor: isDarkMode ? 'var(--slate-1)' : provided.backgroundColor,
      boxShadow: state.isFocused ? `0 0 0 1px ${mergedStyles.focusBorderColor}` : provided.boxShadow,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: mergedStyles.fontSize,
      cursor: 'pointer',
      backgroundColor: isDarkMode
        ? state.isSelected
          ? 'var(--orange-9)'
          : state.isFocused
            ? 'var(--slate-4)'
            : 'var(--slate-2)'
        : provided.backgroundColor,
      color: isDarkMode
        ? state.isSelected
          ? 'white'
          : 'var(--slate-12)'
        : provided.color,
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: mergedStyles.fontSize,
      color: isDarkMode ? 'var(--slate-12)' : provided.color,
    }),
    valueContainer: (provided) => ({
      ...provided,
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: mergedStyles.fontSize,
      color: isDarkMode ? 'var(--slate-9)' : mergedStyles.placeholderColor,
    }),
    input: (provided) => ({
      ...provided,
      fontSize: mergedStyles.fontSize,
      margin: "0 2px",
      color: isDarkMode ? 'var(--slate-12)' : provided.color,
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      width: mergedStyles.dropdownIndicatorSize,
      height: mergedStyles.dropdownIndicatorSize,
      color: isDarkMode ? 'var(--slate-11)' : provided.color,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      pointerEvents: 'auto',
    }),
    menu: (base) => ({
      ...base,
      zIndex: usePortal ? 9999 : base.zIndex,
      position: usePortal ? 'relative' : base.position,
      backgroundColor: isDarkMode ? 'var(--slate-2)' : base.backgroundColor,
      boxShadow: isDarkMode ? '0 0 0 1px var(--slate-6), 0 4px 11px var(--slate-8)' : base.boxShadow,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? 'var(--slate-4)' : provided.backgroundColor,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: isDarkMode ? 'var(--slate-12)' : provided.color,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: isDarkMode ? 'var(--slate-11)' : provided.color,
      ':hover': {
        backgroundColor: isDarkMode ? 'var(--orange-9)' : provided[':hover'].backgroundColor,
        color: isDarkMode ? 'white' : provided[':hover'].color,
      },
    }),
  };

  const handleChange = (option: Option | Option[] | null) => {
    if (isMulti) {
      const selectedValues = Array.isArray(option) 
        ? option.map(opt => opt.value)
        : option 
          ? [option.value]
          : [];
      onChange(selectedValues.length > 0 ? selectedValues : null);
    } else {
      onChange(option && !Array.isArray(option) ? option.value : null);
    }
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      className="custom-react-select"
      styles={selectStyles}
      menuPortalTarget={portalTarget}
      menuPosition={usePortal ? "fixed" : "absolute"}
      menuPlacement="auto"
      closeMenuOnScroll={false}
      blurInputOnSelect={false}
      isMulti={isMulti}
      theme={(theme) => ({
        ...theme,
        borderRadius: typeof mergedStyles.borderRadius === 'string' ? 
          parseInt(mergedStyles.borderRadius, 10) : 
          Number(mergedStyles.borderRadius),
        colors: {
          ...theme.colors,
          primary: mergedStyles.primaryColor,
          primary25: mergedStyles.primary25,
          primary50: mergedStyles.primary50,
          primary75: mergedStyles.primary75,
          neutral0: isDarkMode ? 'var(--slate-2)' : theme.colors.neutral0,
          neutral5: isDarkMode ? 'var(--slate-3)' : theme.colors.neutral5,
          neutral10: isDarkMode ? 'var(--slate-4)' : theme.colors.neutral10,
          neutral20: isDarkMode ? 'var(--slate-6)' : theme.colors.neutral20,
          neutral30: isDarkMode ? 'var(--slate-7)' : theme.colors.neutral30,
          neutral40: isDarkMode ? 'var(--slate-9)' : theme.colors.neutral40,
          neutral50: isDarkMode ? 'var(--slate-9)' : theme.colors.neutral50,
          neutral60: isDarkMode ? 'var(--slate-10)' : theme.colors.neutral60,
          neutral70: isDarkMode ? 'var(--slate-11)' : theme.colors.neutral70,
          neutral80: isDarkMode ? 'var(--slate-12)' : theme.colors.neutral80,
          neutral90: isDarkMode ? 'var(--slate-12)' : theme.colors.neutral90,
        }
      })}
      {...props}
    />
  );
};

export default SearchableSelect;
