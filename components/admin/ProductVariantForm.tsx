"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  TrashIcon } from "lucide-react";
import { useState } from "react";

type Attribute = {
  name: string;
  values: string[];
};

type Variant = {
  attributes: Array<{
    name: string;
    value: string;
  }>;
  price: number;
  quantity: number;
};

type ProductVariantFormProps = {
  attributes: Attribute[];
  value: Variant[];
  onChange: (value: Variant[]) => void;
};

export function ProductVariantForm({
  attributes,
  value,
  onChange,
}: ProductVariantFormProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const generateVariants = () => {
    const newVariants: Variant[] = [];
    const attributeNames = attributes.map((attr) => attr.name);
    const attributeValues = attributes.map((attr) => attr.values);

    const generateCombinations = (
      current: Array<{ name: string; value: string }>,
      index: number
    ) => {
      if (index === attributeNames.length) {
        newVariants.push({
          attributes: [...current],
          price: 0,
          quantity: 0,
        });
        return;
      }

      const attrName = attributeNames[index];
      const values = attributeValues[index];

      for (const value of values) {
        current.push({ name: attrName, value });
        generateCombinations(current, index + 1);
        current.pop();
      }
    };

    generateCombinations([], 0);
    onChange(newVariants);
  };

  const handleVariantChange = (
    index: number,
    field: 'price' | 'quantity',
    newValue: number
  ) => {
    const newVariants = [...value];
    newVariants[index] = {
      ...newVariants[index],
      [field]: newValue,
    };
    onChange(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...value];
    newVariants.splice(index, 1);
    onChange(newVariants);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {attributes.map((attribute) => (
          <div key={attribute.name} className="flex-1">
            <Select
              value={selectedAttributes[attribute.name]}
              onValueChange={(value) => {
                setSelectedAttributes({
                  ...selectedAttributes,
                  [attribute.name]: value,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${attribute.name}`} />
              </SelectTrigger>
              <SelectContent>
                {attribute.values.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button onClick={generateVariants}>Generate Variants</Button>
      </div>

      {value.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              {attributes.map((attr) => (
                <TableHead key={attr.name}>{attr.name}</TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.map((variant, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="number"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", Number(e.target.value))
                    }
                    placeholder="Price"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) =>
                      handleVariantChange(index, "quantity", Number(e.target.value))
                    }
                    placeholder="Quantity"
                  />
                </TableCell>
                {attributes.map((attr) => (
                  <TableCell key={attr.name}>
                    {variant.attributes.find(a => a.name === attr.name)?.value}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveVariant(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
