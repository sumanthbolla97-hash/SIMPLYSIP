export interface MenuItem {
  id: string;
  day: string;
  category: "Signature Blends" | "Single Fruit Series";
  name: string;
  desc: string;
  image: string;
  price: number;
}

export const createSeedMenu = (): MenuItem[] => [
  {
    id: "1",
    day: "Day 1",
    category: "Signature Blends",
    name: "Hulk Greens",
    desc: "Green Apple • Cucumber • Ginger • Spinach • Lime",
    image: "/images/hulk-greens.png",
    price: 15
  },
  {
    id: "2",
    day: "Day 2",
    category: "Signature Blends",
    name: "Melon Booster",
    desc: "Watermelon • Cucumber • Mint",
    image: "/images/melon-booster.png",
    price: 15
  },
  {
    id: "3",
    day: "Day 3",
    category: "Signature Blends",
    name: "ABC",
    desc: "Apple • Beetroot • Carrot",
    image: "/images/abc.png",
    price: 15
  },
  {
    id: "4",
    day: "Day 4",
    category: "Signature Blends",
    name: "A-Star",
    desc: "Apple • Pomegranate",
    image: "/images/a-star.png",
    price: 15
  },
  {
    id: "5",
    day: "Day 5",
    category: "Signature Blends",
    name: "AMG",
    desc: "Apple • Mint • Ginger",
    image: "/images/amg.png",
    price: 15
  },
  {
    id: "6",
    day: "Day 6",
    category: "Signature Blends",
    name: "Ganga Jamuna",
    desc: "Orange • Mosambi",
    image: "/images/ganga-jamuna.png",
    price: 15
  },
  {
    id: "7",
    day: "Day 7",
    category: "Single Fruit Series",
    name: "Coco Fresh",
    desc: "Tender Coconut Water",
    image: "/images/coco-fresh.png",
    price: 15
  },
  {
    id: "8",
    day: "Day 8",
    category: "Single Fruit Series",
    name: "Sunshine Sip",
    desc: "Mosambi",
    image: "/images/sunshine-sip.png",
    price: 15
  },
  {
    id: "9",
    day: "Day 9",
    category: "Single Fruit Series",
    name: "Golden Sunrise",
    desc: "Orange",
    image: "/images/golden-sunrise.png",
    price: 15
  },
  {
    id: "10",
    day: "Day 10",
    category: "Single Fruit Series",
    name: "Orchard Gold",
    desc: "Apple",
    image: "/images/orchard-gold.png",
    price: 15
  },
  {
    id: "11",
    day: "Day 11",
    category: "Single Fruit Series",
    name: "Tropical Bliss",
    desc: "Pineapple",
    image: "/images/tropical-bliss.png",
    price: 15
  },
  {
    id: "12",
    day: "Day 12",
    category: "Single Fruit Series",
    name: "Velvet Vine",
    desc: "Pomegranate",
    image: "/images/velvet-vine.png",
    price: 15
  },
  {
    id: "13",
    day: "Day 13",
    category: "Single Fruit Series",
    name: "Purple Crush",
    desc: "Black Grapes",
    image: "/images/purple-crush.png",
    price: 15
  },
  {
    id: "14",
    day: "Day 14",
    category: "Single Fruit Series",
    name: "Verjus",
    desc: "Green Grapes",
    image: "/images/verjus.png",
    price: 15
  },
  {
    id: "15",
    day: "Day 15",
    category: "Single Fruit Series",
    name: "Garden Joy",
    desc: "Carrot",
    image: "/images/garden-joy.png",
    price: 15
  }
];
