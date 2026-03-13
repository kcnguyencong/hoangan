import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "luxe-decor-secret-key";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // --- Database Setup ---
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT,
      price REAL,
      priceStr TEXT,
      cat TEXT,
      color TEXT,
      tag TEXT,
      img TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT,
      location TEXT,
      category TEXT,
      img TEXT,
      desc TEXT,
      fullDesc TEXT,
      gallery TEXT -- JSON string
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      title TEXT,
      subtitle TEXT,
      img TEXT,
      date TEXT,
      desc TEXT,
      content TEXT
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Admin if not exists
  const adminExists = await db.get("SELECT * FROM users WHERE username = ?", ["admin"]);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", hashedPassword]);
  }

  // Seed Initial Data if empty
  const productCount = await db.get("SELECT COUNT(*) as count FROM products");
  if (productCount.count === 0) {
    const initialProducts = [
      { id: '1', title: 'Sàn Gỗ Sồi Nga Heritage', price: 1250000, priceStr: '1.250.000₫', cat: 'Sàn Gỗ Tự Nhiên', color: '#d2b48c', tag: 'Bán Chạy', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80' },
      { id: '2', title: 'Sàn SPC Walnut Dark Stone', price: 450000, priceStr: '450.000₫', cat: 'Sàn Nhựa SPC', color: '#5d4037', img: 'https://images.unsplash.com/photo-1581850518616-bcb8186c443e?auto=format&fit=crop&q=80' },
      { id: '3', title: 'Vinyl Nordic Pine White', price: 320000, priceStr: '320.000₫', cat: 'Sàn Nhựa Vinyl', color: '#f3e5ab', tag: 'Mới', img: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80' },
      { id: '4', title: 'Sàn Gỗ Gõ Đỏ Lào Premium', price: 2800000, priceStr: '2.800.000₫', cat: 'Sàn Gỗ Tự Nhiên', color: '#8b4513', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80' },
      { id: '5', title: 'Sàn SPC Urban Concrete', price: 580000, priceStr: '580.000₫', cat: 'Sàn Nhựa SPC', color: '#d2b48c', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80' },
      { id: '6', title: 'Sàn Gỗ Teak Golden Honey', price: 1950000, priceStr: '1.950.000₫', cat: 'Sàn Gỗ Tự Nhiên', color: '#f3e5ab', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80' },
      { id: '7', title: 'Tấm Ốp Nano Vân Gỗ Sáng', price: 150000, priceStr: '150.000₫', cat: 'Tấm Ốp Tường Nano', color: '#f3e5ab', img: 'https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80' },
      { id: '8', title: 'PVC Vân Đá Marble Trắng', price: 250000, priceStr: '250.000₫', cat: 'PVC Vân Đá', color: '#f3e5ab', img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80' },
      { id: '9', title: 'Giấy Dán Tường Luxury Gold', price: 85000, priceStr: '85.000₫', cat: 'Giấy Dán Tường', color: '#f3e5ab', tag: 'Mới Về', img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80' },
      { id: '10', title: 'Thảm Cỏ Nhân Tạo 3cm', price: 95000, priceStr: '95.000₫', cat: 'Thảm Cỏ Nhân Tạo', color: '#5d4037', img: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80' },
    ];
    for (const p of initialProducts) {
      await db.run("INSERT INTO products (id, title, price, priceStr, cat, color, tag, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [p.id, p.title, p.price, p.priceStr, p.cat, p.color, p.tag, p.img]);
    }
  }

  const projectCount = await db.get("SELECT COUNT(*) as count FROM projects");
  if (projectCount.count === 0) {
    const initialProjects = [
      {
        id: '1',
        title: 'Biệt Thự Vinhomes Riverside',
        location: 'Long Biên, Hà Nội',
        category: 'Sàn Gỗ Tự Nhiên',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
        desc: 'Thi công sàn gỗ Sồi Mỹ cao cấp cho toàn bộ không gian biệt thự tân cổ điển.',
        fullDesc: 'Dự án biệt thự cao cấp tại Vinhomes Riverside yêu cầu sự tỉ mỉ trong từng chi tiết. Chúng tôi đã sử dụng sàn gỗ Sồi Mỹ nhập khẩu với vân gỗ tự nhiên sang trọng, kết hợp cùng phào chỉ trang trí mạ vàng để tôn lên vẻ đẹp quý tộc của gia chủ.',
        gallery: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80']
      },
      {
        id: '2',
        title: 'Penthouse Heritage West Lake',
        location: 'Tây Hồ, Hà Nội',
        category: 'Sàn Nhựa SPC',
        img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
        desc: 'Sử dụng sàn nhựa SPC vân đá Marble cho khu vực bếp và ban công.',
        fullDesc: 'Với tầm nhìn triệu đô ra Hồ Tây, căn Penthouse được thiết kế theo phong cách tối giản hiện đại. Sàn nhựa SPC vân đá Marble không chỉ mang lại vẻ đẹp tinh tế mà còn đảm bảo độ bền, chống thấm nước tuyệt đối cho khu vực bếp và ban công.',
        gallery: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1600607687940-467f5b63c7c7?auto=format&fit=crop&q=80']
      },
      {
        id: '3',
        title: 'Căn Hộ Duplex Sunshine City',
        location: 'Bắc Từ Liêm, Hà Nội',
        category: 'Tấm Ốp Tường Nano',
        img: 'https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80',
        desc: 'Trang trí vách tivi bằng tấm ốp Nano vân gỗ kết hợp nẹp đồng sang trọng.',
        fullDesc: 'Điểm nhấn của căn hộ Duplex này là mảng tường thông tầng cao 6m được ốp hoàn toàn bằng tấm Nano cao cấp. Sự kết hợp giữa vân gỗ ấm áp và nẹp đồng sáng bóng tạo nên không gian sống đẳng cấp và đầy nghệ thuật.',
        gallery: ['https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80']
      },
      {
        id: '4',
        title: 'Nhà Phố Phố Huế',
        location: 'Hai Bà Trưng, Hà Nội',
        category: 'Sàn Gỗ Công Nghiệp',
        img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
        desc: 'Cải tạo không gian cũ với sàn gỗ công nghiệp Malaysia chịu nước.',
        fullDesc: 'Căn nhà phố lâu đời tại Phố Huế đã được khoác lên mình diện mạo mới hoàn toàn. Chúng tôi lựa chọn sàn gỗ công nghiệp Malaysia với khả năng chịu nước và chống mối mọt vượt trội, phù hợp với khí hậu nồm ẩm của miền Bắc.',
        gallery: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80']
      },
      {
        id: '5',
        title: 'Văn Phòng Techcombank',
        location: 'Hoàn Kiếm, Hà Nội',
        category: 'Thảm Cỏ & Sàn Gỗ',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
        desc: 'Kiến tạo không gian xanh với thảm cỏ nhân tạo và sàn gỗ công nghiệp cao cấp.',
        fullDesc: 'Thiết kế văn phòng mở hiện đại cho Techcombank, kết hợp giữa sàn gỗ công nghiệp màu xám trung tính và các mảng xanh từ thảm cỏ nhân tạo tại khu vực pantry và relax zone, giúp nhân viên có không gian làm việc sáng tạo.',
        gallery: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80']
      },
      {
        id: '6',
        title: 'Showroom Mercedes-Benz',
        location: 'Hải Phòng',
        category: 'Sàn Nhựa Vinyl',
        img: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80',
        desc: 'Sàn nhựa Vinyl chống trượt, chịu tải trọng lớn cho khu vực trưng bày xe.',
        fullDesc: 'Showroom ô tô yêu cầu sàn nhà có độ bóng cao nhưng phải chống trượt và chịu được tải trọng lớn của xe trưng bày. Sàn nhựa Vinyl cuộn cao cấp đã đáp ứng hoàn hảo các tiêu chuẩn kỹ thuật khắt khe này.',
        gallery: ['https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80']
      }
    ];
    for (const p of initialProjects) {
      await db.run("INSERT INTO projects (id, title, location, category, img, desc, fullDesc, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [p.id, p.title, p.location, p.category, p.img, p.desc, p.fullDesc, JSON.stringify(p.gallery)]);
    }
  }

  const promoCount = await db.get("SELECT COUNT(*) as count FROM promotions");
  if (promoCount.count === 0) {
    const initialPromos = [
      {
        id: '1',
        title: 'Ưu Đãi Tháng 3: Giảm 20% Thi Công Trọn Gói',
        subtitle: 'Chào mừng ngày Quốc tế Phụ nữ 8/3',
        img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
        date: '01/03/2024 - 31/03/2024',
        desc: 'Giảm ngay 20% tổng giá trị hợp đồng cho khách hàng ký hợp đồng thi công nội thất trọn gói trong tháng 3.',
        content: `
### Chi tiết chương trình:
Nhân dịp tháng 3 - tháng tôn vinh phái đẹp, Hoangan Decor gửi tới quý khách hàng chương trình ưu đãi đặc biệt nhất trong năm:

*   **Giảm ngay 20%** tổng giá trị hợp đồng thi công trọn gói.
*   **Tặng gói thiết kế 3D** trị giá lên đến 20.000.000đ.
*   **Miễn phí vận chuyển** trong nội thành Hà Nội.

### Điều kiện áp dụng:
1. Áp dụng cho hợp đồng thi công có giá trị từ 100.000.000đ trở lên.
2. Thời gian ký hợp đồng từ 01/03 đến hết 31/03/2024.
3. Không áp dụng đồng thời với các chương trình khuyến mãi khác.
        `
      }
    ];
    for (const p of initialPromos) {
      await db.run("INSERT INTO promotions (id, title, subtitle, img, date, desc, content) VALUES (?, ?, ?, ?, ?, ?, ?)", [p.id, p.title, p.subtitle, p.img, p.date, p.desc, p.content]);
    }
  }

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ success: true, user: { username: user.username } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Products
  app.get("/api/products", async (req, res) => {
    const products = await db.all("SELECT * FROM products");
    res.json(products);
  });

  app.post("/api/products", authenticateToken, async (req, res) => {
    const p = req.body;
    await db.run(
      "INSERT OR REPLACE INTO products (id, title, price, priceStr, cat, color, tag, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [p.id, p.title, p.price, p.priceStr, p.cat, p.color, p.tag, p.img]
    );
    res.json({ success: true });
  });

  app.delete("/api/products/:id", authenticateToken, async (req, res) => {
    await db.run("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    const projects = await db.all("SELECT * FROM projects");
    const formatted = projects.map(p => ({ ...p, gallery: JSON.parse(p.gallery || "[]") }));
    res.json(formatted);
  });

  app.post("/api/projects", authenticateToken, async (req, res) => {
    const p = req.body;
    await db.run(
      "INSERT OR REPLACE INTO projects (id, title, location, category, img, desc, fullDesc, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [p.id, p.title, p.location, p.category, p.img, p.desc, p.fullDesc, JSON.stringify(p.gallery || [])]
    );
    res.json({ success: true });
  });

  // Promotions
  app.get("/api/promotions", async (req, res) => {
    const promos = await db.all("SELECT * FROM promotions");
    res.json(promos);
  });

  app.post("/api/promotions", authenticateToken, async (req, res) => {
    const p = req.body;
    await db.run(
      "INSERT OR REPLACE INTO promotions (id, title, subtitle, img, date, desc, content) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [p.id, p.title, p.subtitle, p.img, p.date, p.desc, p.content]
    );
    res.json({ success: true });
  });

  // Contacts
  app.post("/api/contacts", async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    await db.run("INSERT INTO contacts (phone) VALUES (?)", [phone]);
    res.json({ success: true });
  });

  app.get("/api/contacts", authenticateToken, async (req, res) => {
    const contacts = await db.all("SELECT * FROM contacts ORDER BY createdAt DESC");
    res.json(contacts);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
