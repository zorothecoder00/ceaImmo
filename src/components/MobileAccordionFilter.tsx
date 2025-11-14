'use client'

import { motion } from "framer-motion";
import { Filter } from 'lucide-react';
import { ReactNode, MouseEventHandler } from "react";

interface MobileAccordionFilterProps {
  children: ReactNode;
  isOpen: boolean;
  toggle: MouseEventHandler<HTMLButtonElement>;
}

export default function MobileAccordionFilter({
  children,
  isOpen,
  toggle,
}: MobileAccordionFilterProps) {
  return (
    <div className="md:hidden">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center py-3 px-4 rounded-lg bg-gray-100"
      >
        <span className="font-medium">Filtres</span>
        <Filter className="w-5 h-5" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-4 rounded-lg bg-gray-50 border"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
