import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for prototype
let menuItems = [
  { id: "1", day: "Day 1", name: "Hulk Greens", desc: "Spinach, Celery, Cucumber, Apple, Lemon", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop", price: 15 },
  { id: "2", day: "Day 2", name: "ABC", desc: "Apple, Beetroot, Carrot, Ginger", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=800&auto=format&fit=crop", price: 15 },
  { id: "3", day: "Day 3", name: "Melon Booster", desc: "Watermelon, Mint, Chia Seeds", image: "https://images.unsplash.com/photo-1566454419290-0f5f692ca0bb?q=80&w=800&auto=format&fit=crop", price: 15 },
  { id: "4", day: "Day 4", name: "AMG", desc: "Apple, Mint, Ginger, Lemon", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop", price: 15 },
  { id: "5", day: "Day 5", name: "Ganga Jamuna", desc: "Orange, Sweet Lime", image: "https://images.unsplash.com/photo-1622597467836-f38240662c8b?q=80&w=800&auto=format&fit=crop", price: 15 },
  { id: "6", day: "Day 6", name: "Garden Joy", desc: "Carrot, Orange, Turmeric", image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=800&auto=format&fit=crop", price: 15 },
  { id: "7", day: "Day 7", name: "Coco Fresh", desc: "Tender Coconut Water, Aloe Vera", image: "https://images.unsplash.com/photo-1524156868115-e696b44983db?q=80&w=800&auto=format&fit=crop", price: 15 },
];

// API Routes
app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

app.post("/api/menu", (req, res) => {
  const newItem = {
    id: Date.now().toString(),
    ...req.body
  };
  menuItems.push(newItem);
  res.json(newItem);
});

app.delete("/api/menu/:id", (req, res) => {
  menuItems = menuItems.filter(item => item.id !== req.params.id);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
