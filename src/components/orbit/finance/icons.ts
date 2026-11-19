import { Bus, Clapperboard, Package, Pill, Receipt, ShoppingBag, ShoppingBasket, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/orbit/finance";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Food: UtensilsCrossed,
  Groceries: ShoppingBasket,
  Transport: Bus,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Health: Pill,
  Entertainment: Clapperboard,
  Other: Package,
};
