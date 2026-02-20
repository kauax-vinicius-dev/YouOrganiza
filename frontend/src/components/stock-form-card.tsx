import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { ReactNode } from "react";

interface StockFormCardProps {
  title: React.ReactNode;
  description: string;
  selectLabel: string;
  selectValue: string;
  onSelectChange: (value: string) => void;
  selectOptions: { value: string; label: string }[];
  inputId: string;
  inputLabel: string;
  inputType?: string;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputPlaceholder?: string;
  inputMin?: number;
  inputMax?: number;
  inputClassName?: string;
  submitLabel: string;
  submitLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children?: ReactNode;
}

export function StockFormCard({
  title,
  description,
  selectLabel,
  selectValue,
  onSelectChange,
  selectOptions,
  inputId,
  inputLabel,
  inputType = "number",
  inputValue,
  onInputChange,
  inputPlaceholder = "0",
  inputMin = 1,
  inputMax,
  inputClassName = "",
  submitLabel,
  submitLoading,
  onSubmit,
  children,
}: StockFormCardProps) {
  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
          <div className="space-y-2">
            <Label>{selectLabel}</Label>
            <Select value={selectValue} onValueChange={onSelectChange}>
              <SelectTrigger className="bg-border/10 cursor-pointer">
                <SelectValue
                  placeholder={`Selecione ${selectLabel.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {selectOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={inputId}>{inputLabel}</Label>
            <Input
              id={inputId}
              type={inputType}
              min={inputMin}
              max={inputMax}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={onInputChange}
              required
              className={`mb-2 bg-border/10 ${inputClassName}`}
            />
          </div>
          <SubmitButton loading={submitLoading} label={submitLabel} fullWidth />
        </form>
      </CardContent>
    </Card>
  );
}
