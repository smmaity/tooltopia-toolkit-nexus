
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";
import { differenceInYears, differenceInMonths, differenceInDays, parse, isValid, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  nextBirthday: {
    date: Date;
    daysLeft: number;
  };
}

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);

  const calculateAge = () => {
    if (!birthDate) {
      toast.error("Please select your birth date");
      return;
    }

    if (!endDate) {
      setEndDate(new Date());
    }

    const calcDate = endDate || new Date();
    
    if (birthDate > calcDate) {
      toast.error("Birth date cannot be in the future");
      return;
    }

    // Calculate age
    const years = differenceInYears(calcDate, birthDate);
    
    // Get months difference after accounting for years
    const birthDatePlusYears = new Date(birthDate);
    birthDatePlusYears.setFullYear(birthDatePlusYears.getFullYear() + years);
    const months = differenceInMonths(calcDate, birthDatePlusYears);
    
    // Get days difference after accounting for years and months
    const birthDatePlusYearsAndMonths = new Date(birthDatePlusYears);
    birthDatePlusYearsAndMonths.setMonth(birthDatePlusYearsAndMonths.getMonth() + months);
    const days = differenceInDays(calcDate, birthDatePlusYearsAndMonths);
    
    // Total values
    const totalMonths = differenceInMonths(calcDate, birthDate);
    const totalDays = differenceInDays(calcDate, birthDate);
    
    // Calculate next birthday
    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(calcDate.getFullYear());
    
    // If the birthday has already occurred this year, add 1 to the year
    if (nextBirthday < calcDate) {
      nextBirthday.setFullYear(calcDate.getFullYear() + 1);
    }
    
    const daysUntilBirthday = differenceInDays(nextBirthday, calcDate);
    
    setAgeResult({
      years,
      months,
      days,
      totalMonths,
      totalDays,
      nextBirthday: {
        date: nextBirthday,
        daysLeft: daysUntilBirthday
      }
    });
    
    toast.success("Age calculated successfully");
  };

  const resetCalculator = () => {
    setBirthDate(undefined);
    setEndDate(new Date());
    setAgeResult(null);
  };

  return (
    <AnimatedElement>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Age Calculator</CardTitle>
          <CardDescription>
            Calculate your precise age or the time between two dates
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Birth Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date (optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculateAge}>Calculate Age</Button>
            <Button variant="outline" onClick={resetCalculator}>Reset</Button>
          </div>
          
          {ageResult && (
            <div className="mt-6 space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold text-lg">Your Age</h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <span className="text-2xl font-bold block">{ageResult.years}</span>
                  <span className="text-sm text-muted-foreground">Years</span>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <span className="text-2xl font-bold block">{ageResult.months}</span>
                  <span className="text-sm text-muted-foreground">Months</span>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <span className="text-2xl font-bold block">{ageResult.days}</span>
                  <span className="text-sm text-muted-foreground">Days</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <p className="text-sm">
                  <span className="font-medium">Total months:</span> {ageResult.totalMonths}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total days:</span> {ageResult.totalDays}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Next birthday:</span>{" "}
                  {format(ageResult.nextBirthday.date, "PPP")}
                  {" "}({ageResult.nextBirthday.daysLeft} days left)
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default AgeCalculator;
