
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";
import { Progress } from "@/components/ui/progress";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">('cm');
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">('kg');
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");

  const calculateBMI = () => {
    let heightInMeters: number;
    let weightInKg: number;
    
    // Convert height to meters
    if (heightUnit === 'cm') {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum <= 0) {
        toast.error("Please enter a valid height");
        return;
      }
      heightInMeters = heightNum / 100;
    } else {
      const feetNum = parseFloat(feet);
      const inchesNum = parseFloat(inches) || 0;
      if (isNaN(feetNum) || feetNum <= 0) {
        toast.error("Please enter a valid height");
        return;
      }
      heightInMeters = (feetNum * 12 + inchesNum) * 0.0254;
    }
    
    // Convert weight to kg
    if (weightUnit === 'kg') {
      weightInKg = parseFloat(weight);
    } else {
      weightInKg = parseFloat(weight) * 0.453592;
    }
    
    if (isNaN(weightInKg) || weightInKg <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }
    
    // Calculate BMI
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBMI(parseFloat(bmiValue.toFixed(1)));
    
    // Determine BMI category
    let bmiCategory: string;
    if (bmiValue < 18.5) {
      bmiCategory = "Underweight";
    } else if (bmiValue < 24.9) {
      bmiCategory = "Normal weight";
    } else if (bmiValue < 29.9) {
      bmiCategory = "Overweight";
    } else if (bmiValue < 34.9) {
      bmiCategory = "Obesity Class I";
    } else if (bmiValue < 39.9) {
      bmiCategory = "Obesity Class II";
    } else {
      bmiCategory = "Obesity Class III";
    }
    
    setCategory(bmiCategory);
    toast.success(`Your BMI has been calculated: ${bmiValue.toFixed(1)}`);
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setFeet("");
    setInches("");
    setBMI(null);
    setCategory(null);
  };

  const getBMIColor = () => {
    if (!bmi) return "bg-muted";
    
    if (bmi < 18.5) return "bg-blue-500";
    if (bmi < 24.9) return "bg-green-500";
    if (bmi < 29.9) return "bg-yellow-500";
    if (bmi < 34.9) return "bg-orange-500";
    return "bg-red-500";
  };

  const getBMIProgress = () => {
    if (!bmi) return 0;
    
    // Scale the BMI value to a 0-100 percentage for the progress bar
    // We'll use 10 as min BMI and 45 as max BMI for this scale
    const progress = ((bmi - 10) / 35) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <AnimatedElement>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>
            Calculate your Body Mass Index (BMI) to check if your weight is healthy
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="metric">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="metric"
                onClick={() => {
                  setHeightUnit("cm");
                  setWeightUnit("kg");
                }}
              >
                Metric (kg/cm)
              </TabsTrigger>
              <TabsTrigger
                value="imperial"
                onClick={() => {
                  setHeightUnit("ft");
                  setWeightUnit("lb");
                }}
              >
                Imperial (lb/ft)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="metric" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height-cm">Height (cm)</Label>
                  <Input
                    id="height-cm"
                    placeholder="Enter your height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="weight-kg">Weight (kg)</Label>
                  <Input
                    id="weight-kg"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="imperial" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Height</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="feet" className="sr-only">Feet</Label>
                      <Input
                        id="feet"
                        placeholder="Feet"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inches" className="sr-only">Inches</Label>
                      <Input
                        id="inches"
                        placeholder="Inches"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="weight-lb">Weight (lb)</Label>
                  <Input
                    id="weight-lb"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <Button onClick={calculateBMI}>Calculate BMI</Button>
            <Button variant="outline" onClick={resetCalculator}>Reset</Button>
          </div>
          
          {bmi !== null && (
            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Your BMI: {bmi}</span>
                  <span className="font-medium">{category}</span>
                </div>
                <Progress value={getBMIProgress()} className={`h-3 ${getBMIColor()}`} />
              </div>
              
              <div className="grid grid-cols-5 gap-1 text-xs text-center mt-1">
                <div className="bg-blue-500 text-white p-1 rounded-l">Under</div>
                <div className="bg-green-500 text-white p-1">Normal</div>
                <div className="bg-yellow-500 text-white p-1">Over</div>
                <div className="bg-orange-500 text-white p-1">Obese</div>
                <div className="bg-red-500 text-white p-1 rounded-r">Severe</div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="mb-2">BMI Categories:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Underweight: less than 18.5</li>
                  <li>Normal weight: 18.5 - 24.9</li>
                  <li>Overweight: 25 - 29.9</li>
                  <li>Obesity Class I: 30 - 34.9</li>
                  <li>Obesity Class II: 35 - 39.9</li>
                  <li>Obesity Class III: 40 or higher</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default BMICalculator;
