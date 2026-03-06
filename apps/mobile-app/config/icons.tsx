import {
  ArrowRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
  CalendarDotsIcon,
  PencilSimpleIcon,
  TrashSimpleIcon,
} from "phosphor-react-native";

// Export the Icon type from phosphor-react-native
export type { Icon } from "phosphor-react-native";

export const Icons = {
  CaretLeft: CaretLeftIcon,
  ArrowRight: ArrowRightIcon,
  Check: CheckIcon,
  Heart: HeartIcon,
  Plus: PlusIcon,
  ShoppingCart: ShoppingCartIcon,
  Star: StarIcon,
  CaretDown: CaretDownIcon,
  Eye: EyeIcon,
  EyeSlash: EyeSlashIcon,
  Search: MagnifyingGlassIcon,
  CalendarDotsIcon: CalendarDotsIcon,
  Pencil: PencilSimpleIcon,
  Trash: TrashSimpleIcon,
} as const;

export type IconName = keyof typeof Icons;
