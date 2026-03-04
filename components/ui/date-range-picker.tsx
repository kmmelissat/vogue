"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateRangeDisplay } from "@/lib/date-utils";

type DateRangePickerProps = {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  disabledAfter?: Date;
  numberOfMonths?: number;
};

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  disabledAfter = new Date(),
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(dateRange?.from);
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(
    dateRange
  );

  React.useEffect(() => {
    if (open) {
      setPendingRange(dateRange);
      if (dateRange?.from) setMonth(dateRange.from);
    }
  }, [open, dateRange]);

  const handleSelect = React.useCallback((range: DateRange | undefined) => {
    setPendingRange(range?.from ? range : undefined);
  }, []);

  const handleApply = React.useCallback(() => {
    if (pendingRange?.from) {
      const range: DateRange = {
        from: pendingRange.from,
        to: pendingRange.to ?? pendingRange.from,
      };
      onDateRangeChange(range);
      setOpen(false);
    }
  }, [pendingRange, onDateRangeChange]);

  const hasCompleteRange = Boolean(pendingRange?.from);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="min-w-[240px] justify-start gap-2 font-normal"
        >
          <CalendarIcon className="size-4" />
          {formatDateRangeDisplay(dateRange?.from, dateRange?.to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-white p-0" align="start">
        <Calendar
          mode="range"
          selected={pendingRange}
          onSelect={handleSelect}
          disabled={{ after: disabledAfter }}
          numberOfMonths={numberOfMonths}
          month={month}
          onMonthChange={setMonth}
          defaultMonth={dateRange?.from}
        />
        <div className="border-t p-2 flex justify-end">
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!hasCompleteRange}
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
