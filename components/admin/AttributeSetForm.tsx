"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

type Attribute = {
  name: string;
  values: string[];
};

type AttributeSetFormProps = {
  attributeSets: any[]; // Replace with your attribute set type
  value: Attribute[];
  onChange: (value: Attribute[]) => void;
};

export function AttributeSetForm({
  // attributeSets,
  value,
  onChange,
}: AttributeSetFormProps) {
  const [newAttribute, setNewAttribute] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAddAttribute = () => {
    if (newAttribute.trim()) {
      onChange([...value, { name: newAttribute.trim(), values: [] }]);
      setNewAttribute("");
    }
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...value];
    newAttributes.splice(index, 1);
    onChange(newAttributes);
  };

  const handleAddValue = (attributeIndex: number) => {
    if (newValue.trim()) {
      const newAttributes = [...value];
      newAttributes[attributeIndex].values.push(newValue.trim());
      onChange(newAttributes);
      setNewValue("");
    }
  };

  const handleRemoveValue = (attributeIndex: number, valueIndex: number) => {
    const newAttributes = [...value];
    newAttributes[attributeIndex].values.splice(valueIndex, 1);
    onChange(newAttributes);
  };

  return (
    <div className="space-y-4">
      {value.map((attribute, attributeIndex) => (
        <div key={attributeIndex} className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={attribute.name}
              onChange={(e) => {
                const newAttributes = [...value];
                newAttributes[attributeIndex].name = e.target.value;
                onChange(newAttributes);
              }}
              placeholder="Attribute name"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleRemoveAttribute(attributeIndex)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="ml-4 space-y-2">
            {attribute.values.map((val, valueIndex) => (
              <div key={valueIndex} className="flex items-center gap-2">
                <Input
                  value={val}
                  onChange={(e) => {
                    const newAttributes = [...value];
                    newAttributes[attributeIndex].values[valueIndex] =
                      e.target.value;
                    onChange(newAttributes);
                  }}
                  placeholder="Value"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveValue(attributeIndex, valueIndex)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Add value"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddValue(attributeIndex);
                  }
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAddValue(attributeIndex)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          value={newAttribute}
          onChange={(e) => setNewAttribute(e.target.value)}
          placeholder="Add attribute"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddAttribute();
            }
          }}
        />
        <Button variant="outline" size="icon" onClick={handleAddAttribute}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
