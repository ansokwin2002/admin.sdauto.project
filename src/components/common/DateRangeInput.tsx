"use client";

import { useState, useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
import { TextField, Button, Flex, Box } from "@radix-ui/themes";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRangePicker, Range } from "react-date-range";
import format from "date-fns/format";
import isValid from "date-fns/isValid";

interface DateRangeInputProps {
  value: Range;
  onChange: (range: Range) => void;
  placeholder?: string;
  position?: 'top' | 'bottom';
  months?: number;
  usePortal?: boolean;
}

// Default range of last week
// const getDefaultRange = (): Range => {
//   return {
//     startDate: subDays(new Date(), 7),
//     endDate: new Date(),
//     key: 'selection'
//   };
// };

export default function DateRangeInput({
  value,
  onChange,
  placeholder = "Select date range...",
  position = 'bottom',
  months = 1,
  usePortal = false,
}: DateRangeInputProps) {
  // Initialize with default range if both start and end dates are undefined
  //const initialValue = (!value.startDate && !value.endDate) ? getDefaultRange() : value;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [tempRange, setTempRange] = useState<Range | null>(null);
  const [pickerPositionStyle, setPickerPositionStyle] = useState({});
  
  // Set default range if no dates provided
  // useEffect(() => {
  //   if (!value.startDate && !value.endDate) {
  //     onChange(getDefaultRange());
  //   }
  // }, []);

  useEffect(() => {
    // Update displayed text when value changes externally
    setInputValue(formatDateRange(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Close if click is outside both input and picker (if picker exists)
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        pickerRef.current && !pickerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  // Update picker position when opened or scrolled
  useEffect(() => {
    const updatePosition = () => {
      if (open && inputRef.current && !usePortal) {
        // Basic positioning relative to input if not using portal
         setPickerPositionStyle({
            position: 'absolute',
            zIndex: 10, // Ensure it's above other elements
            [position === 'top' ? 'bottom' : 'top']: "100%",
            marginTop: position === 'top' ? 0 : '4px',
            marginBottom: position === 'top' ? '4px' : 0,
         });
      } else if (open && inputRef.current && usePortal) {
         // Calculate position for portal
         const rect = inputRef.current.getBoundingClientRect();
         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
         const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

         const top = position === 'bottom' 
            ? rect.bottom + scrollTop + 4
            : rect.top + scrollTop - 4; // Adjust based on picker height later if needed
         const left = rect.left + scrollLeft;

         setPickerPositionStyle({
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 9999, // High z-index for portal
         });
      }
    };

    if (open) {
      updatePosition();
      // Optional: Add scroll/resize listeners to reposition if needed
      // window.addEventListener('scroll', updatePosition, true);
      // window.addEventListener('resize', updatePosition);
    }

    return () => {
      // window.removeEventListener('scroll', updatePosition, true);
      // window.removeEventListener('resize', updatePosition);
    };
  }, [open, position, usePortal]);

  const handleInputFocus = () => {
    setOpen(true);
    setTempRange(value);
  };

  const handleRangeChange = (item: any) => {
    const newRange = item.selection;
    setTempRange(newRange);
    setInputValue(formatDateRange(newRange));
  };

  const handleApply = () => {
    if (tempRange) {
      onChange(tempRange);
    }
    setOpen(false);
  };

  const handleClear = () => {
    const emptyRange: Range = {
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    };
    setTempRange(emptyRange);
    onChange(emptyRange);
    setInputValue("");
    setOpen(false);
  };

  function formatDateRange(range: Range): string {
    const { startDate, endDate } = range;
    
    if (!startDate && !endDate) return "";
    
    if (startDate && isValid(startDate)) {
      if (endDate && isValid(endDate)) {
        // Both dates are valid
        return `${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`;
      }
      // Only start date is valid
      return format(startDate, "MMM dd, yyyy");
    }
    return "";
  }

  // Use temp range if available, otherwise use the passed value
  const displayRange = tempRange || value;

  // Conditionally render the picker content
  const pickerContent = open ? (
    <div
      ref={pickerRef}
      className="absolute z-10 shadow-lg rdrCalendarWrapper"
      style={usePortal ? pickerPositionStyle : pickerPositionStyle}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <DateRangePicker
        ranges={[displayRange.key === 'selection' ? displayRange : { ...displayRange, key: 'selection' }]}
        onChange={handleRangeChange}
        direction="horizontal"
        months={months}
      />
      <Flex p="2" gap="2" justify="end">
        <Button size="1" variant="soft" color="gray" onClick={handleClear}>
          Clear
        </Button>
        <Button size="1" onClick={handleApply} color="green">
          Apply
        </Button>
      </Flex>
    </div>
  ) : null;

  return (
    <div className="relative" ref={inputRef}>
      <TextField.Root
        placeholder={placeholder}
        value={inputValue}
        onFocus={handleInputFocus}
        readOnly
      >
        <TextField.Slot>
          <CalendarIcon size={16} />
        </TextField.Slot>
      </TextField.Root>
      
      {usePortal ? (pickerContent && ReactDOM.createPortal(pickerContent, document.body)) : pickerContent}
    </div>
  );
} 