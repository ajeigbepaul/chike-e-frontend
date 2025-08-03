// import { CategoryType } from "@/types/product";
import { CategoryType } from "@/types/product";
import React, { useState } from "react";
// import { CategoryType } from "@/types/product";

interface CollapsibleCategoryDropdownProps {
  categories: CategoryType[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

export const CollapsibleCategoryDropdown: React.FC<
  CollapsibleCategoryDropdownProps
> = ({ categories, selectedCategory, onSelect }) => {
  // Only one dropdown per level open at a time
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [openSubSub, setOpenSubSub] = useState<string | null>(null);

  const handleMainToggle = (id: string) => {
    setOpenMain((prev) => (prev === id ? null : id));
    setOpenSub(null);
    setOpenSubSub(null);
  };
  const handleSubToggle = (id: string) => {
    setOpenSub((prev) => (prev === id ? null : id));
    setOpenSubSub(null);
  };
  const handleSubSubToggle = (id: string) => {
    setOpenSubSub((prev) => (prev === id ? null : id));
  };

  return (
    <div className="border rounded bg-background">
      <ul className="list-none p-0 m-0">
        {categories.map((cat) => (
          <li key={cat._id} className="border-b">
            <div
              className="flex items-center justify-between px-2 py-1 cursor-pointer"
              onClick={() => handleMainToggle(cat._id)}
            >
              <span className={selectedCategory === cat._id ? "font-bold" : ""}>
                {cat.name}
              </span>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <span>{openMain === cat._id ? "▼" : "▶"}</span>
              )}
            </div>
            <div className="px-4">
              <button
                type="button"
                className={`w-full text-left py-1 ${
                  selectedCategory === cat._id ? "bg-primary text-white" : ""
                }`}
                onClick={() => onSelect(cat._id)}
              >
                Select
              </button>
            </div>
            {cat.subcategories &&
              cat.subcategories.length > 0 &&
              openMain === cat._id && (
                <ul className="pl-6">
                  {cat.subcategories.map((sub) => (
                    <li key={sub._id} className="border-b">
                      <div
                        className="flex items-center justify-between px-2 py-1 cursor-pointer"
                        onClick={() => handleSubToggle(sub._id)}
                      >
                        <span
                          className={
                            selectedCategory === sub._id ? "font-bold" : ""
                          }
                        >
                          {sub.name}
                        </span>
                        {sub.subcategories && sub.subcategories.length > 0 && (
                          <span>{openSub === sub._id ? "▼" : "▶"}</span>
                        )}
                      </div>
                      <div className="px-4">
                        <button
                          type="button"
                          className={`w-full text-left py-1 ${
                            selectedCategory === sub._id
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          onClick={() => onSelect(sub._id)}
                        >
                          Select
                        </button>
                      </div>
                      {sub.subcategories &&
                        sub.subcategories.length > 0 &&
                        openSub === sub._id && (
                          <ul className="pl-6">
                            {sub.subcategories.map((subsub) => (
                              <li key={subsub._id} className="border-b">
                                <div
                                  className="flex items-center justify-between px-2 py-1 cursor-pointer"
                                  onClick={() => handleSubSubToggle(subsub._id)}
                                >
                                  <span
                                    className={
                                      selectedCategory === subsub._id
                                        ? "font-bold"
                                        : ""
                                    }
                                  >
                                    {subsub.name}
                                  </span>
                                </div>
                                <div className="px-4">
                                  <button
                                    type="button"
                                    className={`w-full text-left py-1 ${
                                      selectedCategory === subsub._id
                                        ? "bg-primary text-white"
                                        : ""
                                    }`}
                                    onClick={() => onSelect(subsub._id)}
                                  >
                                    Select
                                  </button>
                                </div>
                                {/* Add further nesting if needed */}
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};
