import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json({ limit: '10mb' }));

const getTemplatesPath = () => {
  return path.join(process.cwd(), 'src', 'custom_ready_templates.json');
};

const defaultPresets = [
  {
    "id": "tpl-default",
    "nameEn": "Basic White",
    "nameRu": "Базовый",
    "descriptionEn": "Clear white minimalism with elegant spacing.",
    "descriptionRu": "Чистый светлый минимализм с аккуратным межстрочным полем.",
    "previewGradient": "from-zinc-50 via-zinc-100 to-zinc-200",
    "config": {
      "designTemplate": "none",
      "theme": "modern",
      "mainBg": {
        "theme": "light",
        "syncThemes": true,
        "lightConfig": {
          "fillType": "color",
          "fillColor": "#FFFFFF"
        }
      },
      "blockDefaults": {
        "bgColor": "bg-white",
        "textColor": "text-black",
        "hasBorder": true,
        "customBorderColor": "#E5E7EB",
        "bgOpacity": 100,
        "enableShadow": false,
        "enableBlurEffect": false,
        "enableGlareEffect": false,
        "enableGlowEffect": false,
        "enableNoiseEffect": false,
        "enableHoverEffect": false
      }
    }
  },
  {
    "id": "tpl-chroma",
    "nameEn": "Chroma Lab",
    "nameRu": "Хрома Лаб",
    "descriptionEn": "Matte glass overlays with an ambient fluid spectrum field.",
    "descriptionRu": "Стильное матовое стекло поверх живой орбитальной волны.",
    "previewGradient": "from-purple-900 via-indigo-950 to-pink-950",
    "config": {
      "designTemplate": "chroma-lab",
      "theme": "modern",
      "mainBg": {
        "theme": "dark",
        "syncThemes": true,
        "lightConfig": {
          "fillType": "color",
          "fillColor": "#050505",
          "effects": [
            { "id": "chroma-lab-eff", "type": "chroma-lab", "color": "#ffffff", "opacity": 100, "speed": 1, "position": "bottom", "height": 100, "seed": 123, "hue": 280 }
          ]
        },
        "darkConfig": {
          "fillType": "color",
          "fillColor": "#050505",
          "effects": [
            { "id": "chroma-lab-eff", "type": "chroma-lab", "color": "#ffffff", "opacity": 100, "speed": 1, "position": "bottom", "height": 100, "seed": 123, "hue": 280 }
          ]
        }
      },
      "blockDefaults": {
        "bgColor": "bg-zinc-950/40",
        "bgOpacity": 15,
        "borderRadius": "lg",
        "hasBorder": true,
        "customBorderColor": "oklch(0.9 0.05 280 / 0.3)",
        "hoverBorderColor": "oklch(0.95 0.1 280 / 0.6)",
        "borderWidthValue": 1,
        "enableBlurEffect": true,
        "blurEffectAmount": 20,
        "enableShadow": true,
        "shadowSize": 25,
        "shadowIntensity": 90,
        "enableHoverEffect": true
      }
    }
  },
  {
    "id": "tpl-retro",
    "nameEn": "Basic Dark",
    "nameRu": "Базовый темный",
    "descriptionEn": "Deep black elegance with sharp contrasts.",
    "descriptionRu": "Глубокая черная элегантность с четкими контрастами.",
    "previewGradient": "from-zinc-800 via-zinc-900 to-black",
    "config": {
      "designTemplate": "none",
      "theme": "modern",
      "mainBg": {
        "theme": "dark",
        "syncThemes": true,
        "darkConfig": {
          "fillType": "color",
          "fillColor": "#000000"
        }
      },
      "blockDefaults": {
        "bgColor": "bg-black",
        "textColor": "text-white",
        "hasBorder": true,
        "customBorderColor": "#3F3F46",
        "bgOpacity": 100,
        "enableShadow": false,
        "enableBlurEffect": false,
        "enableGlareEffect": false,
        "enableGlowEffect": false,
        "enableNoiseEffect": false,
        "enableHoverEffect": false
      }
    }
  }
];

// Helper to read templates from file or fallback to defaults
function readTemplates(): any[] {
  const p = getTemplatesPath();
  try {
    if (fs.existsSync(p)) {
      const data = fs.readFileSync(p, "utf-8");
      return JSON.parse(data);
    } else {
      // Create directories if needed
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(p, JSON.stringify(defaultPresets, null, 2), "utf-8");
      return defaultPresets;
    }
  } catch (err) {
    console.error("Error reading templates:", err);
    return defaultPresets;
  }
}

// Helper to write templates to file
function writeTemplates(templates: any[]): boolean {
  const p = getTemplatesPath();
  try {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(p, JSON.stringify(templates, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing templates:", err);
    return false;
  }
}

// API Routes
app.get("/api/custom-ready-templates", (req, res) => {
  const templates = readTemplates();
  res.json(templates);
});

app.post("/api/custom-ready-templates", (req, res) => {
  const newTemplate = req.body;
  if (!newTemplate || !newTemplate.id) {
    res.status(400).json({ error: "Invalid template structure" });
    return;
  }
  const templates = readTemplates();
  // Avoid duplicate ID
  const filtered = templates.filter(t => t.id !== newTemplate.id);
  filtered.push(newTemplate);
  
  if (writeTemplates(filtered)) {
    res.json({ success: true, templates: filtered });
  } else {
    res.status(500).json({ error: "Failed to write templates" });
  }
});

app.put("/api/custom-ready-templates", (req, res) => {
  const newTemplates = req.body;
  if (!Array.isArray(newTemplates)) {
    res.status(400).json({ error: "Invalid templates array" });
    return;
  }
  if (writeTemplates(newTemplates)) {
    res.json({ success: true, templates: newTemplates });
  } else {
    res.status(500).json({ error: "Failed to write templates" });
  }
});

app.delete("/api/custom-ready-templates/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Missing ID" });
    return;
  }
  const templates = readTemplates();
  const filtered = templates.filter(t => t.id !== id);
  
  if (writeTemplates(filtered)) {
    res.json({ success: true, templates: filtered });
  } else {
    res.status(500).json({ error: "Failed to write templates" });
  }
});

// Vite Middleware & Static Handling
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error("Failed to start server:", err);
});
