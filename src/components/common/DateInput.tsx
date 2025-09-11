"use client";

import { useState, useRef, useEffect } from "react";
import { TextField, Button, Flex, Box, Text, RadioCards } from "@radix-ui/themes";
import { Calendar as CalendarIcon, Clock, Check, X } from "lucide-react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

interface DateInputProps {
  value: Date | undefined | null;
  onChange: (date: Date | undefined | null) => void;
  placeholder?: string;
  maxDate?: Date;
  minDate?: Date;
  includeTime?: boolean;
  position?: 'top' | 'bottom';
  disabled?: boolean;
}

export default function DateInput({
  value,
  onChange,
  placeholder = "Select date...",
  maxDate,
  minDate,
  includeTime = false,
  position = 'bottom',
  disabled = false
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(() => value ? formatDate(value, includeTime) : "");
  const [hours, setHourState] = useState(() => {
    if (!value) return 12;
    const h = value.getHours();
    return h === 0 ? 12 : h > 12 ? h - 12 : h;
  });
  const [minutes, setMinuteState] = useState(() => value ? value.getMinutes() : 0);
  const [period, setPeriod] = useState(() => value ? (value.getHours() >= 12 ? 'PM' : 'AM') : 'AM');
  const [tempDate, setTempDate] = useState<Date | undefined | null>(value);
  const inputRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  // For client-side rendering only
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    // Update displayed text when value changes externally
    setInputValue(value ? formatDate(value, includeTime) : "");
    if (value) {
      const h = value.getHours();
      setHourState(h === 0 ? 12 : h > 12 ? h - 12 : h);
      setMinuteState(value.getMinutes());
      setPeriod(value.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      // Default values when input is null/undefined
      setHourState(12);
      setMinuteState(0);
      setPeriod('AM');
    }
    setTempDate(value);
  }, [value, includeTime]);

  useEffect(() => {
    // Handle clicks outside to close the date picker
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node) && 
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  const handleInputFocus = () => {
    setOpen(true);
    // Reset temp date to current value when opening
    setTempDate(value);
    // Also reset time values
    if (value) {
      const h = value.getHours();
      setHourState(h === 0 ? 12 : h > 12 ? h - 12 : h);
      setMinuteState(value.getMinutes());
      setPeriod(value.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      // Default values when input is null/undefined
      setHourState(12);
      setMinuteState(0);
      setPeriod('AM');
      // If we're opening with no date, set a default date (today)
      if (includeTime && !tempDate) {
        setTempDate(new Date());
      }
    }
  };

  const handleDateSelect = (item: any) => {
    if (!item) {
      setTempDate(null);
      return;
    }
    
    let selectedDate = new Date(item);
    
    // If time is included, apply the current time values
    if (includeTime) {
      const hourValue = period === 'PM' 
        ? (hours === 12 ? 12 : hours + 12) 
        : (hours === 12 ? 0 : hours);
        
      selectedDate = setHours(selectedDate, hourValue);
      selectedDate = setMinutes(selectedDate, minutes);
    }
    
    // Just update the temp date without applying it yet
    setTempDate(selectedDate);
  };

  const handleTimeChange = (type: 'hours' | 'minutes' | 'period', newValue: any) => {
    if (type === 'hours') {
      const hourValue = newValue === '' ? 12 : Math.min(12, Math.max(1, Number(newValue)));
      setHourState(hourValue);
      newValue = hourValue;
    } else if (type === 'minutes') {
      const minuteValue = newValue === '' ? 0 : Math.min(59, Math.max(0, Number(newValue)));
      setMinuteState(minuteValue);
      newValue = minuteValue;
    } else if (type === 'period') {
      setPeriod(newValue);
    }

    // If we don't have a date selected yet but user is setting time, use today's date
    if (!tempDate && includeTime) {
      setTempDate(new Date());
    }

    if (tempDate) {
      const newDate = new Date(tempDate);
      
      if (type === 'hours' || type === 'period') {
        const hourValue = (type === 'period' ? newValue : period) === 'PM' 
          ? (type === 'hours' ? Number(newValue) : hours) === 12 
            ? 12 
            : (type === 'hours' ? Number(newValue) : hours) + 12
          : (type === 'hours' ? Number(newValue) : hours) === 12 
            ? 0 
            : (type === 'hours' ? Number(newValue) : hours);
        
        setHours(newDate, hourValue);
      }
      
      if (type === 'minutes') {
        setMinutes(newDate, Number(newValue));
      }
      
      setTempDate(newDate);
    }
  };

  const handleClear = () => {
    onChange(null);
    setInputValue("");
    setTempDate(null);
    setOpen(false);
  };

  const handleApply = () => {
    if (!tempDate) {
      onChange(null);
      setInputValue("");
    } else {
      // Ensure time values are applied before passing the date to onChange
      if (includeTime) {
        const hourValue = period === 'PM' 
          ? (hours === 12 ? 12 : hours + 12) 
          : (hours === 12 ? 0 : hours);
        
        let finalDate = new Date(tempDate);
        finalDate = setHours(finalDate, hourValue);
        finalDate = setMinutes(finalDate, minutes);
        
        onChange(finalDate);
        setInputValue(formatDate(finalDate, includeTime));
      
      } else {
        onChange(tempDate);
        setInputValue(formatDate(tempDate, includeTime));
      }
    }
    setOpen(false);
  };

  function formatDate(date: Date | null, withTime: boolean): string {
    if (!date || !isValid(date)) return "";
    return withTime 
      ? format(date, "MMM dd, yyyy h:mm a") 
      : format(date, "MMM dd, yyyy");
  }

  return (
    <>
      <div className="relative" ref={inputRef}>
        <TextField.Root
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleInputFocus}
          readOnly={disabled}
        >
          <TextField.Slot>
            {includeTime ? <Clock size={16} /> : <CalendarIcon size={16} />}
          </TextField.Slot>
        </TextField.Root>
         
      {isMounted && open && (
        <div 
          ref={calendarRef}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg rounded-md absolute"
          style={{
            zIndex: 9999,
            [position === 'top' ? 'bottom' : 'top']: position === 'top' ? 'calc(100% + 5px)' : 35,
          }}
        >
          <Box style={{marginTop: -17}}>
            <Calendar
              date={tempDate || undefined}
              onChange={handleDateSelect}
              maxDate={maxDate}
              minDate={minDate}
            />
            
            {includeTime && (
              <Flex p="3" gap="3" direction="column" className="border-t border-gray-200">
                <Flex gap="2" align="end">
                  <Box>
                    <Text size="1">Hour</Text>
                    <TextField.Root 
                      type="number" 
                      value={hours.toString()}
                      onChange={(e) => handleTimeChange('hours', e.target.value)}
                      min="1"
                      max="12"
                      size="1"
                      style={{width: '60px'}}
                    />
                  </Box>
                  <Text size="3" className="mt-1">:</Text>
                  <Box>
                    <Text size="1">Minute</Text>
                    <TextField.Root 
                      type="number" 
                      value={minutes.toString().padStart(2, '0')}
                      onChange={(e) => handleTimeChange('minutes', e.target.value)}
                      min="0"
                      max="59"
                      size="1"
                      style={{width: '60px'}}
                    />
                  </Box>
                  <Box>
                    <Text size="1">AM/PM</Text>
                    <RadioCards.Root 
                      size="1" 
                      value={period} 
                      onValueChange={(value) => handleTimeChange('period', value)} 
                      className="!flex !gap-1"
                    >
                      <RadioCards.Item value="AM" className="!w-10 !text-xs !py-1 !rounded-sm">AM</RadioCards.Item>
                      <RadioCards.Item value="PM" className="!w-10 !text-xs !py-1 !rounded-sm">PM</RadioCards.Item>
                    </RadioCards.Root>
                  </Box>
                </Flex>
              </Flex>
            )}
            
            <Flex gap="2" justify="between" className="p-2">
              <Button style={{fontSize: '13px', padding: '2px 8px'}} variant="soft" color="gray" onClick={handleClear}>
                <X size={14} />
                Clear
              </Button>
              <Button style={{fontSize: '13px', padding: '2px 8px'}} color="green" onClick={handleApply}>
                <Check size={14} />
                Apply
              </Button>
            </Flex>
          </Box>
        </div>
      )}
      </div>
    </>
  );
}
